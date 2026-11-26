import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

const SITE_FALLBACK_DESCRIPTION =
  'Unique Generation Outreach — unity, empowerment, opportunities, and community transformation.';

/** Short, crawl-friendly titles when CMS seo.title is empty. */
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
  '/resources': 'Resources',
  '/admin': 'CMS',
};

/** Sensible descriptions when page seo.description / intro are empty. */
const ROUTE_DESCRIPTIONS = {
  '/':
    'Unique Generation Outreach promotes unity, creates opportunities, and inspires transformation across communities — through faith, service, and purposeful leadership.',
  '/about':
    'Our story of faith, unity, and opportunity — how Unique Generation Outreach raises a generation that serves with purpose.',
  '/pillars':
    'Six commitments that carry the Unique Generation Outreach mission: the working language of how we serve.',
  '/gatherings':
    'GHP seasons that mark our journey — themes of fellowship, honour, praise, and blessing.',
  '/reflections':
    'Word for the journey — reflections from Unique Generation Outreach for faith and daily life.',
  '/leadership':
    'Stewards of the mission — the Convener and cross-functional team behind Unique Generation Outreach.',
  '/contact':
    'Volunteer, partner, pray, or ask about gatherings — reach Unique Generation Outreach.',
  '/faq':
    'Answers about who we are, how GHP works, and how you can serve or partner with Unique Generation Outreach.',
  '/events':
    'Dates, places, and stories from Unique Generation Outreach gatherings and seasons.',
  '/videos':
    'Messages, highlights, and stories from Unique Generation Outreach on YouTube.',
  '/resources':
    'Guides and downloads from Unique Generation Outreach for volunteering, gatherings, and the mission.',
};

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => {
      if (k !== 'content') el.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  if (attrs.content != null) el.setAttribute('content', attrs.content);
  return el;
}

function absoluteUrl(url, origin) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = (origin || '').replace(/\/$/, '');
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

function buildTitle(base, leaf, brand, template) {
  if (base === '/') return brand;
  const tmpl = template || `%s · ${brand}`;
  return tmpl.includes('%s') ? tmpl.replace('%s', leaf) : `${leaf} · ${brand}`;
}

function removeJsonLd() {
  document.getElementById('ugo-jsonld-org')?.remove();
}

function upsertOrganizationJsonLd({ brand, origin, logo, email, social }) {
  removeJsonLd();
  const sameAs = [social?.facebook, social?.instagram, social?.youtube, social?.twitter].filter(
    Boolean,
  );
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand,
    url: origin || undefined,
    logo: logo || undefined,
    email: email || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
  const script = document.createElement('script');
  script.id = 'ugo-jsonld-org';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Client-side document head for the Vite SPA (no SSR/prerender).
 * index.html keeps sensible static fallbacks for first paint / non-JS crawlers.
 */
export default function DocumentMeta() {
  const { pathname } = useLocation();
  const { content } = useContent();

  useEffect(() => {
    const brand = content?.brand?.name || 'Unique Generation Outreach';
    const seo = content?.seo || {};
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const base = pathname.startsWith('/admin') ? '/admin' : pathname.replace(/\/+$/, '') || '/';
    const pageKey = base === '/' ? null : base.slice(1);
    const page = pageKey ? content?.pages?.[pageKey] : null;
    const isKnownRoute = Boolean(ROUTE_TITLES[base] || page);
    const isHome = base === '/';

    const leaf =
      page?.seo?.title ||
      page?.label ||
      ROUTE_TITLES[base] ||
      page?.title ||
      (isKnownRoute ? 'Page' : 'Not found');

    const title = buildTitle(base, leaf, brand, seo.titleTemplate);
    document.title = title;

    const desc = String(
      page?.seo?.description ||
        page?.intro ||
        ROUTE_DESCRIPTIONS[base] ||
        seo.defaultDescription ||
        content?.hero?.support ||
        SITE_FALLBACK_DESCRIPTION,
    )
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);

    upsertMeta('meta[name="description"]', { name: 'description', content: desc });

    // Open Graph + Twitter — title/description always; image when a hero exists.
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: desc,
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: `${origin}${base === '/' ? '/' : base}`,
    });

    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: desc,
    });

    const heroImage = isHome
      ? content?.hero?.image
      : page?.heroImage || page?.hero?.image || '';
    const hasHero = Boolean(String(heroImage || '').trim());
    const ogImageRaw = hasHero ? heroImage : seo.ogImage || '/logo-icon.png';
    const ogImage = absoluteUrl(ogImageRaw, origin);

    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: hasHero ? 'summary_large_image' : 'summary',
    });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    if (isHome) {
      upsertOrganizationJsonLd({
        brand,
        origin,
        logo: absoluteUrl(seo.ogImage || '/logo-icon.png', origin),
        email: content?.contact?.email || '',
        social: content?.social || {},
      });
    } else {
      removeJsonLd();
    }
  }, [pathname, content]);

  return null;
}
