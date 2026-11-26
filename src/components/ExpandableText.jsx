import { useId, useState } from 'react';

/** Truncate long copy with an in-place Read more / Show less control. */
export default function ExpandableText({
  text,
  limit = 220,
  as: Comp = 'p',
  className = '',
  moreLabel = 'Read more',
  lessLabel = 'Show less',
}) {
  const full = String(text || '').trim();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (!full) return null;
  if (full.length <= limit) {
    return <Comp className={className}>{full}</Comp>;
  }

  const cut = full.slice(0, limit);
  const teaser = `${cut.replace(/\s+\S*$/, '').trimEnd()}…`;

  return (
    <div className={`expandable${className ? ` ${className}` : ''}`}>
      <Comp id={panelId}>{open ? full : teaser}</Comp>
      <button
        type="button"
        className="expandable__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? lessLabel : moreLabel}
      </button>
    </div>
  );
}
