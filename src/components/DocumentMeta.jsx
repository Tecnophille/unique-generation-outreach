import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

const ROUTE_TITLES = {
  '/': 'Home',
  '/about': 'About',
  '/pillars': 'Pillars',
  '/gatherings': 'Gatherings',
  '/reflections': 'Reflections',
  '/contact': 'Contact',
  '/leadership': 'Leadership',
  '/faq': 'FAQ',
  '/admin': 'CMS',
};

export default function DocumentMeta() {
  const { pathname } = useLocation();
  const { content } = useContent();
  const brand = content?.brand?.name || 'Unique Generation Outreach';

  useEffect(() => {
    const base = pathname.startsWith('/admin') ? '/admin' : pathname;
    const leaf = ROUTE_TITLES[base] || content?.pages?.[base.slice(1)]?.title || 'Page';
    document.title = base === '/' ? brand : `${leaf} · ${brand}`;

    const desc =
      content?.pages?.[base.slice(1)]?.intro ||
      content?.hero?.subhead ||
      'Unique Generation Outreach — unity, empowerment, opportunities, and community transformation.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', String(desc).slice(0, 300));
  }, [pathname, content, brand]);

  return null;
}
