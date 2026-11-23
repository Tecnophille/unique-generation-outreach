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
  '/events': 'Events',
  '/videos': 'Videos',
  '/admin': 'CMS',
};

export default function DocumentMeta() {
  const { pathname } = useLocation();
  const { content } = useContent();
  const brand = content?.brand?.name || 'Unique Generation Outreach';
  const seo = content?.seo || {};

  useEffect(() => {
    const base = pathname.startsWith('/admin') ? '/admin' : pathname;
    const page = content?.pages?.[base.slice(1)];
    const leaf =
      page?.seo?.title || ROUTE_TITLES[base] || page?.title || 'Page';
    const template = seo.titleTemplate || `%s · ${brand}`;
    document.title =
      base === '/'
        ? brand
        : template.includes('%s')
          ? template.replace('%s', leaf)
          : `${leaf} · ${brand}`;

    const desc =
      page?.seo?.description ||
      page?.intro ||
      seo.defaultDescription ||
      content?.hero?.support ||
      'Unique Generation Outreach — unity, empowerment, opportunities, and community transformation.';

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', String(desc).slice(0, 300));

    const ogImage = page?.heroImage || seo.ogImage || '/logo-icon.png';
    let og = document.querySelector('meta[property="og:image"]');
    if (!og) {
      og = document.createElement('meta');
      og.setAttribute('property', 'og:image');
      document.head.appendChild(og);
    }
    og.setAttribute('content', ogImage);
  }, [pathname, content, brand, seo]);

  return null;
}
