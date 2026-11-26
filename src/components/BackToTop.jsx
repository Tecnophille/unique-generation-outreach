import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.footer');

    const update = () => {
      const scrolled = window.scrollY > 420;
      let footerInView = false;
      if (footer) {
        const rect = footer.getBoundingClientRect();
        footerInView = rect.top < window.innerHeight - 24;
      }
      setVisible(scrolled && !footerInView);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      aria-label="Return to top"
      title="Return to top"
      onClick={() => {
        const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior = prefersReduce ? 'auto' : 'smooth';
        const html = document.documentElement;
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = behavior;
        window.scrollTo({ top: 0, behavior });
        window.setTimeout(() => {
          html.style.scrollBehavior = previous;
        }, prefersReduce ? 0 : 600);
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M12 5.5 5.5 12M12 5.5 18.5 12M12 5.5V19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
