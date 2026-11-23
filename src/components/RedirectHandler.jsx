import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

export default function RedirectHandler() {
  const { content } = useContent();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const rules = (content?.redirects || []).filter((r) => r.enabled !== false && r.from && r.to);
    const match = rules.find((r) => {
      const from = r.from.startsWith('/') ? r.from : `/${r.from}`;
      return from.replace(/\/$/, '') === pathname.replace(/\/$/, '');
    });
    if (!match) return;
    const to = match.to;
    if (/^https?:\/\//i.test(to)) {
      window.location.replace(to);
      return;
    }
    navigate(to.startsWith('/') ? to : `/${to}`, { replace: true });
  }, [content, pathname, navigate]);

  return null;
}
