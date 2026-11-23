import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeContent } from './contentModel';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/content', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load content');
      const data = await res.json();
      setContent(normalizeContent(data));
    } catch (err) {
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
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
    setContent(normalizeContent(saved));
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
