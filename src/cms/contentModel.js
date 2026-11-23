export function normalizeContent(raw = {}) {
  return {
    ...raw,
    brand: raw.brand || { name: 'Unique Generation Outreach', short: 'UGO' },
    events: Array.isArray(raw.events) ? raw.events : [],
    videos: Array.isArray(raw.videos) ? raw.videos : [],
    announcements: Array.isArray(raw.announcements) ? raw.announcements : [],
    testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : [],
    partners: Array.isArray(raw.partners) ? raw.partners : [],
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
    pages: raw.pages || {},
    nav: Array.isArray(raw.nav) ? raw.nav : [],
  };
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
