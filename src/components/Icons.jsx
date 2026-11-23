export function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 5v14M8 9h8" strokeLinecap="round" />
    </svg>
  );
}

export function IconHands() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 11V8.5a1.5 1.5 0 013 0V11M11 11V7.5a1.5 1.5 0 013 0V11M14 11V8a1.5 1.5 0 013 0v5.5a4.5 4.5 0 01-4.5 4.5H12A4.5 4.5 0 017.5 13.5V11A1.5 1.5 0 0110 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 16.5v-11z" strokeLinejoin="round" />
      <path d="M5 16.5A2.5 2.5 0 017.5 19H19" strokeLinecap="round" />
    </svg>
  );
}

export function IconCal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPeople() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3.5 18c.8-2.4 2.8-4 5.5-4s4.7 1.6 5.5 4M13 18c.4-1.5 1.5-2.8 3-3.2 1.7-.4 3.4.3 4.3 1.7" strokeLinecap="round" />
    </svg>
  );
}

export function PillarGlyph({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', 'aria-hidden': true };
  switch (name) {
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.6 12 20 12 20z" strokeLinejoin="round" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M4.9 6.9l2.8 2.8M16.3 14.3l2.8 2.8M3 12h4M17 12h4M4.9 17.1l2.8-2.8M16.3 9.7l2.8-2.8" strokeLinecap="round" />
        </svg>
      );
    case 'path':
      return (
        <svg {...common}>
          <path d="M5 19c3-1 5-4 5-7s1-5 4-6 5 0 5 0" strokeLinecap="round" />
          <circle cx="17" cy="6" r="2" />
        </svg>
      );
    case 'bloom':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
        </svg>
      );
    case 'people':
      return <IconPeople />;
    case 'hands':
      return <IconHands />;
    default:
      return <IconCross />;
  }
}
