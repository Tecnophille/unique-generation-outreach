import { useEffect, useMemo, useState } from 'react';

export default function CommandPalette({ open, onClose, sections, onSelect, unread = 0 }) {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (open) setQ('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sections.filter(
      (s) =>
        !needle ||
        s.label.toLowerCase().includes(needle) ||
        s.group.toLowerCase().includes(needle) ||
        s.id.includes(needle),
    );
  }, [sections, q]);

  if (!open) return null;

  return (
    <div className="admin-cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" className="admin-cmdk__backdrop" aria-label="Close" onClick={onClose} />
      <div className="admin-cmdk__panel">
        <input
          className="admin-cmdk__input"
          placeholder="Jump to studio… (Esc to close)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && items[0]) {
              onSelect(items[0].id);
              onClose();
            }
          }}
        />
        <div className="admin-cmdk__list">
          {items.length === 0 ? <p className="hint">No matches.</p> : null}
          {items.map((s) => (
            <button
              key={s.id}
              type="button"
              className="admin-cmdk__item"
              onClick={() => {
                onSelect(s.id);
                onClose();
              }}
            >
              <span>{s.label}</span>
              <em>
                {s.group}
                {s.id === 'inbox' && unread > 0 ? ` · ${unread} new` : ''}
              </em>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
