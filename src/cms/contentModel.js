const VIDEOS_HUB_DEFAULT = {
  label: 'Videos',
  title: 'Watch with us',
  intro: 'Messages, highlights, and stories on YouTube.',
  heroImage: '',
  storyTitle: 'On the channel',
  story: 'Videos managed from the CMS YouTube studio.',
  cta: { label: 'Contact us', href: '/contact' },
  useSiteVideos: true,
  status: 'published',
  custom: true,
};

/** Built-in routes that show the YouTube studio library unless explicitly turned off. */
export const BUILTIN_SITE_VIDEO_PAGES = new Set([
  'videos',
  'gatherings',
  'about',
  'pillars',
  'reflections',
  'leadership',
]);

export function ensureVideosHub(content = {}) {
  const pages = { ...(content.pages || {}) };
  if (!pages.videos) {
    pages.videos = { ...VIDEOS_HUB_DEFAULT };
  } else {
    pages.videos = {
      ...pages.videos,
      useSiteVideos: pages.videos.useSiteVideos !== false,
      status: pages.videos.status || 'published',
    };
  }

  // Opt built-in pages into the studio library when the flag was never set.
  for (const key of BUILTIN_SITE_VIDEO_PAGES) {
    if (!pages[key] || key === 'videos') continue;
    if (pages[key].useSiteVideos === undefined) {
      pages[key] = { ...pages[key], useSiteVideos: true };
    }
  }

  const nav = Array.isArray(content.nav) ? [...content.nav] : [];
  if (!nav.some((n) => n?.href === '/videos')) {
    nav.push({ label: 'Videos', href: '/videos' });
  }

  return { ...content, pages, nav };
}

export function normalizeContent(raw = {}) {
  const base = {
    ...raw,
    brand: raw.brand || { name: 'Unique Generation Outreach', short: 'UGO' },
    events: Array.isArray(raw.events) ? raw.events : [],
    videos: Array.isArray(raw.videos) ? raw.videos : [],
    homeBlocks: Array.isArray(raw.homeBlocks) ? raw.homeBlocks : [],
    announcements: Array.isArray(raw.announcements) ? raw.announcements : [],
    testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : [],
    partners: Array.isArray(raw.partners) ? raw.partners : [],
    resources: Array.isArray(raw.resources) ? raw.resources : [],
    redirects: Array.isArray(raw.redirects) ? raw.redirects : [],
    seo: {
      titleTemplate: '%s · Unique Generation Outreach',
      defaultDescription: '',
      ogImage: '/logo-icon.png',
      ...(raw.seo || {}),
    },
    social: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: '',
      ...(raw.social || {}),
    },
    footer: {
      blurb: '',
      copyright: '',
      ...(raw.footer || {}),
    },
    contact: {
      eyebrow: '',
      title: '',
      body: '',
      cta: 'Reach out to us',
      email: '',
      phone: '',
      skyImage: '',
      ...(raw.contact || {}),
      newsletter: {
        titleBefore: 'Join our ',
        titleAccent: 'newsletter.',
        body: '',
        features: [],
        ...((raw.contact && raw.contact.newsletter) || {}),
      },
      placeholders: {
        email: '',
        phone: '',
        ...((raw.contact && raw.contact.placeholders) || {}),
      },
    },
    pages: raw.pages || {},
    nav: Array.isArray(raw.nav) ? raw.nav : [],
  };
  return ensureVideosHub(base);
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
