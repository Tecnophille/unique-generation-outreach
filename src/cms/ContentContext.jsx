import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeContent } from './contentModel';

const ContentContext = createContext(null);

/** Short client TTL — pairs with public Cache-Control on GET /api/content. */
const CONTENT_TTL_MS = 30_000;

let sharedCache = {
  data: null,
  fetchedAt: 0,
  inflight: null,
};

function cacheIsFresh(now = Date.now()) {
  return Boolean(sharedCache.data) && now - sharedCache.fetchedAt < CONTENT_TTL_MS;
}

async function loadContent({ force = false } = {}) {
  const now = Date.now();
  if (!force && cacheIsFresh(now)) return sharedCache.data;
  if (sharedCache.inflight) return sharedCache.inflight;

  sharedCache.inflight = (async () => {
    const res = await fetch('/api/content', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to load content');
    const data = await res.json();
    const normalized = normalizeContent(data);
    sharedCache = {
      data: normalized,
      fetchedAt: Date.now(),
      inflight: null,
    };
    return normalized;
  })().catch((err) => {
    sharedCache.inflight = null;
    throw err;
  });

  return sharedCache.inflight;
}

function rememberContent(normalized) {
  sharedCache = {
    data: normalized,
    fetchedAt: Date.now(),
    inflight: null,
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => sharedCache.data);
  const [loading, setLoading] = useState(!sharedCache.data);
  const [error, setError] = useState('');

  const refresh = useCallback(async ({ soft = false, force = false } = {}) => {
    // Soft revalidation respects TTL and coalesces with an in-flight fetch.
    if (soft && !force && cacheIsFresh()) return sharedCache.data;

    if (!soft && !sharedCache.data) setLoading(true);
    if (!sharedCache.data) setError('');
    try {
      const next = await loadContent({ force: force || !soft });
      setContent(next);
      setError('');
      return next;
    } catch (err) {
      // Keep last good content on failure; only surface error when empty.
      if (!sharedCache.data) {
        setError(err.message || 'Failed to load content');
      }
      if (!soft) throw err;
      return sharedCache.data;
    } finally {
      if (!soft) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  // Pick up CMS saves when returning to a public tab (visibility only — focus+visibility
  // used to double-fetch). TTL + shared inflight prevent stampedes.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== 'visible') return;
      if (window.location.pathname.startsWith('/admin')) return;
      refresh({ soft: true }).catch(() => {});
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  const saveContent = useCallback(async (next) => {
    const res = await fetch('/api/content', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Save failed');
    }
    const saved = await res.json();
    const normalized = normalizeContent(saved);
    rememberContent(normalized);
    setContent(normalized);
    setError('');
    return saved;
  }, []);

  const value = useMemo(
    () => ({ content, loading, error, refresh, saveContent, setContent }),
    [content, loading, error, refresh, saveContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function initials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter((w) => !/^(Leader|Ing\.|Engr\.|Dr\.)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
