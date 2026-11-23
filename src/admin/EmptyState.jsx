export default function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  icon = 'inbox',
}) {
  return (
    <div className="admin-empty" role="status">
      <div className={`admin-empty__icon admin-empty__icon--${icon}`} aria-hidden="true">
        {icon === 'search' ? (
          <svg viewBox="0 0 24 24" width="28" height="28">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16.2 16.2 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : icon === 'media' ? (
          <svg viewBox="0 0 24 24" width="28" height="28">
            <rect x="3.5" y="5" width="17" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10.5" r="1.6" fill="currentColor" />
            <path d="M7 17.5 11.2 13l2.3 2.2L16 12.5l3.5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : icon === 'list' ? (
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M8 7h11M8 12h11M8 17h11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="5" cy="7" r="1" fill="currentColor" />
            <circle cx="5" cy="12" r="1" fill="currentColor" />
            <circle cx="5" cy="17" r="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path
              d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M4 8.5 12 13l8-4.5M12 13v7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </div>
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
      {(actionLabel && onAction) || (secondaryLabel && onSecondary) ? (
        <div className="admin-empty__actions">
          {actionLabel && onAction ? (
            <button className="admin-btn primary" type="button" onClick={onAction}>
              {actionLabel}
            </button>
          ) : null}
          {secondaryLabel && onSecondary ? (
            <button className="admin-btn ghost" type="button" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
