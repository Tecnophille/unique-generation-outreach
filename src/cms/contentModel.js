import { applyPublicContentRepairs } from './publicContentRepairs.js';

const VIDEOS_HUB_DEFAULT = {
  label: 'Videos',
  title: 'Watch with us',
  intro: 'Messages, highlights, and stories on YouTube.',
  heroImage: '',
  storyTitle: 'On the channel',
  story:
    'Messages, gathering highlights, and stories from our YouTube channel — watch with us whenever you need encouragement.',
  cta: { label: 'Explore gatherings', href: '/gatherings' },
  useSiteVideos: true,
  status: 'published',
  custom: true,
};

const RESOURCES_HUB_DEFAULT = {
  label: 'Resources',
  title: 'Resources & downloads',
  intro: 'Guides and materials from Unique Generation Outreach.',
  heroImage: '',
  storyTitle: 'Take something with you',
  story:
    'Practical guides and downloads for volunteering, gatherings, and walking out the mission in daily life. New materials appear here as they are ready.',
  cta: { label: 'Get in touch', href: '/contact' },
  useSiteResources: true,
  status: 'published',
  custom: true,
};

const EVENTS_HUB_DEFAULT = {
  label: 'Events',
  title: 'GHP gatherings & seasons',
  intro: 'Dates, places, and stories from Unique Generation Outreach.',
  heroImage: '',
  storyTitle: 'Come be part of it',
  story:
    'GHP gatherings mark seasons of fellowship, honour, praise, and blessing. Explore the themes below, or ask us about the next date.',
  cta: { label: 'Ask about the next gathering', href: '/contact' },
  useSiteEvents: false,
  custom: true,
  status: 'published',
};

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

  // One-time placement fix: studio library belongs on /videos unless a page opts in.
  // Older auto-opt flags on built-ins made YouTube appear bolted onto every page.
  if (!content.videoPlacementV2) {
    for (const key of Object.keys(pages)) {
      if (key === 'videos' || !pages[key] || typeof pages[key] !== 'object') continue;
      if (pages[key].useSiteVideos) {
        pages[key] = { ...pages[key], useSiteVideos: false };
      }
    }
  }

  return { ...content, pages, videoPlacementV2: true };
}

/** Ensure /resources exists and lists the Resources studio library. */
export function ensureResourcesHub(content = {}) {
  const pages = { ...(content.pages || {}) };
  if (!pages.resources) {
    pages.resources = { ...RESOURCES_HUB_DEFAULT };
  } else {
    pages.resources = {
      ...RESOURCES_HUB_DEFAULT,
      ...pages.resources,
      useSiteResources: pages.resources.useSiteResources !== false,
      status: pages.resources.status || 'published',
      custom: true,
    };
  }
  return { ...content, pages };
}

/** Publish /events using GHP gatherings data when the Events studio list is empty. */
export function ensureEventsHub(content = {}) {
  const pages = { ...(content.pages || {}) };
  const gatheringEvents = Array.isArray(pages.gatherings?.events) ? pages.gatherings.events : [];
  const studioEvents = Array.isArray(content.events) ? content.events : [];
  const hasStudioEvents = studioEvents.some((e) => (e?.status || 'published') === 'published');

  if (hasStudioEvents) {
    pages.events = {
      ...EVENTS_HUB_DEFAULT,
      ...(pages.events || {}),
      status: pages.events?.status || 'published',
      useSiteEvents: true,
      custom: true,
    };
    return { ...content, pages };
  }

  const existing = pages.events || {};
  const pageEvents = Array.isArray(existing.events) ? existing.events : [];
  pages.events = {
    ...EVENTS_HUB_DEFAULT,
    ...existing,
    heroImage: existing.heroImage || pages.gatherings?.heroImage || '',
    status: existing.status || 'published',
    custom: true,
    useSiteEvents: false,
    events: pageEvents.length ? pageEvents : gatheringEvents,
  };

  return { ...content, pages };
}

/** Ensure Home sits before Pillars, and Videos is present — without clobbering custom order. */
export function ensureNavDefaults(content = {}) {
  const nav = Array.isArray(content.nav) ? [...content.nav] : [];

  const hasHome = nav.some((n) => n?.href === '/' || n?.href === '');
  if (!hasHome) {
    const home = { label: 'Home', href: '/' };
    const pillarsIdx = nav.findIndex((n) => n?.href === '/pillars');
    if (pillarsIdx >= 0) nav.splice(pillarsIdx, 0, home);
    else nav.unshift(home);
  }

  if (!nav.some((n) => n?.href === '/videos')) {
    nav.push({ label: 'Videos', href: '/videos' });
  }

  return { ...content, nav };
}

/** Homepage Reflections visual — PDF worship still when unset. */
export const DEFAULT_REFLECTIONS_IMAGE =
  'https://qbiizpnbhqezyflfehze.supabase.co/storage/v1/object/public/ugo-media/uploads/1795465414710-about-worship.jpg';

export function ensureReflectionsImage(content = {}) {
  if (content.reflectionsImage) return content;
  return { ...content, reflectionsImage: DEFAULT_REFLECTIONS_IMAGE };
}

/** Normalize + ensure hubs + visitor-facing copy repairs (read path). */
export function preparePublicContent(raw = {}) {
  const hubs = ensureReflectionsImage(
    ensureNavDefaults(ensureResourcesHub(ensureEventsHub(ensureVideosHub(raw)))),
  );
  return applyPublicContentRepairs(hubs).content;
}

/**
 * Same as preparePublicContent, but reports whether repairs changed payload
 * so the server can persist production CMS fixes.
 */
export function preparePublicContentWithMeta(raw = {}) {
  const hubs = ensureReflectionsImage(
    ensureNavDefaults(ensureResourcesHub(ensureEventsHub(ensureVideosHub(raw)))),
  );
  const { content, changed } = applyPublicContentRepairs(hubs);
  const hubsChanged =
    !raw.pages?.events ||
    !raw.pages?.videos ||
    !raw.pages?.resources ||
    !raw.videoPlacementV2 ||
    !raw.reflectionsImage ||
    !(Array.isArray(raw.nav) && raw.nav.some((n) => n?.href === '/' || n?.href === ''));
  return { content, changed: changed || hubsChanged };
}

export function normalizeContent(raw = {}) {
  const base = {
    ...raw,
    brand: raw.brand || { name: 'Unique Generation Outreach', short: 'UGO' },
    events: Array.isArray(raw.events) ? raw.events : [],
    videos: Array.isArray(raw.videos) ? raw.videos : [],
    homeBlocks: Array.isArray(raw.homeBlocks) ? raw.homeBlocks : [],
    reflectionsImage: raw.reflectionsImage || '',
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
  return preparePublicContent(base);
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
