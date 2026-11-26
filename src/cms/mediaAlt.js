/** Prefer CMS-provided alt/caption/title; fall back to a short sensible label. */
export function mediaAlt(source, fallback = '') {
  if (typeof source === 'string') {
    const trimmed = source.trim();
    return trimmed || fallback;
  }
  if (!source || typeof source !== 'object') return fallback;
  const candidates = [source.alt, source.imageAlt, source.caption, source.title, source.name];
  for (const value of candidates) {
    const trimmed = String(value || '').trim();
    if (trimmed) return trimmed;
  }
  return fallback;
}

export function slugifyAnchor(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}
