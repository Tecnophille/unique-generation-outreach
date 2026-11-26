/**
 * Idempotent repairs for visitor-facing CMS copy and contact typos.
 * Runs on every content read so production DB rows pick up fixes without a manual CMS save.
 */

export const CORRECT_CONTACT_EMAIL = 'contact@uniquegenerationoutreach.org';
/** Typo domain only — must not match inside the correct `uniquegeneration…` host. */
const EMAIL_TYPO_RE = /(?<![a-z])niquegenerationoutreach\.org/gi;

const CONTACT_STORY_BAD =
  'Official email and phone will replace the placeholders below as soon as they are confirmed. Until then, use the form and the channels listed in the CMS contact fields.';
const CONTACT_STORY_GOOD =
  'Email us, call when you can, or subscribe below — we read every note about volunteering, partnership, gatherings, and prayer.';

const REFLECTIONS_STORY_BAD =
  'These reflections connect faith to ordinary courage: work, family, leadership, and community. Replace samples with official teachings anytime in the CMS.';
const REFLECTIONS_STORY_GOOD =
  'These reflections connect faith to ordinary courage: work, family, leadership, and community. Sit with one this week and let it shape how you serve.';

const VIDEOS_STORY_BAD = 'Videos managed from the CMS YouTube studio.';
const VIDEOS_STORY_GOOD =
  'Messages, gathering highlights, and stories from our YouTube channel — watch with us whenever you need encouragement.';

const EVENTS_STORY_BAD = 'Browse events managed from the CMS Events studio.';
const EVENTS_STORY_GOOD =
  'GHP gatherings mark seasons of fellowship, honour, praise, and blessing. Explore the themes below, or ask us about the next date.';

const NEWSLETTER_BODY_BAD = 'Subscribe to receive the latest updates when contact details are confirmed.';
const NEWSLETTER_BODY_GOOD =
  'Subscribe for news, reflections, and gathering updates from Unique Generation Outreach.';

const SAMPLE_DATE_RE = /^Sample\s*·\s*GHP$/i;

/** Truncated production CMS label was “Bold Voic ” with an empty body. */
export const BOLD_VOICES_YEAR = 'Bold Voices';
export const BOLD_VOICES_TEXT =
  'Bold Voice TV and public platforms that amplify faith, leadership, and community stories across the mission.';
const BOLD_VOICES_TRUNCATED_RE = /^bold\s*voic\w*\s*$/i;

const REFLECTION_DATE_BY_TITLE = [
  { match: /koinonia/i, date: 'GHP · Koinonia' },
  { match: /kavod/i, date: 'GHP · Kavod' },
  { match: /shabach/i, date: 'GHP · Shabach' },
  { match: /berakah/i, date: 'GHP · Berakah' },
];

function fixEmailTypo(value) {
  if (typeof value !== 'string' || !EMAIL_TYPO_RE.test(value)) return value;
  EMAIL_TYPO_RE.lastIndex = 0;
  return value.replace(EMAIL_TYPO_RE, 'uniquegenerationoutreach.org');
}

function deepFixEmails(node, seen = new WeakSet()) {
  if (node == null) return { value: node, changed: false };
  if (typeof node === 'string') {
    const next = fixEmailTypo(node);
    return { value: next, changed: next !== node };
  }
  if (typeof node !== 'object') return { value: node, changed: false };
  if (seen.has(node)) return { value: node, changed: false };
  seen.add(node);

  if (Array.isArray(node)) {
    let changed = false;
    const next = node.map((item) => {
      const result = deepFixEmails(item, seen);
      if (result.changed) changed = true;
      return result.value;
    });
    return { value: changed ? next : node, changed };
  }

  let changed = false;
  const next = { ...node };
  for (const key of Object.keys(node)) {
    const result = deepFixEmails(node[key], seen);
    if (result.changed) {
      next[key] = result.value;
      changed = true;
    }
  }
  return { value: changed ? next : node, changed };
}

function reflectionDateFor(title, fallbackIndex) {
  for (const row of REFLECTION_DATE_BY_TITLE) {
    if (row.match.test(title || '')) return row.date;
  }
  const defaults = ['GHP · Koinonia', 'GHP · Kavod', 'GHP · Berakah'];
  return defaults[fallbackIndex] || 'GHP';
}

function repairHomeReflections(list) {
  if (!Array.isArray(list) || !list.length) return { value: list, changed: false };
  let changed = false;
  const next = list.map((item, i) => {
    if (!item || typeof item !== 'object') return item;
    if (!SAMPLE_DATE_RE.test(String(item.date || ''))) return item;
    changed = true;
    return { ...item, date: reflectionDateFor(item.title, i) };
  });
  return { value: changed ? next : list, changed };
}

function repairAboutMilestones(list) {
  if (!Array.isArray(list)) return { value: list, changed: false };
  let changed = false;
  const next = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') {
      changed = true;
      continue;
    }
    let year = String(item.year || '').trim();
    let text = String(item.text || '').trim();

    if (BOLD_VOICES_TRUNCATED_RE.test(year)) {
      if (year !== BOLD_VOICES_YEAR) {
        year = BOLD_VOICES_YEAR;
        changed = true;
      }
      if (!text) {
        text = BOLD_VOICES_TEXT;
        changed = true;
      }
    } else if (/^bold\s*voices$/i.test(year) && !text) {
      year = BOLD_VOICES_YEAR;
      text = BOLD_VOICES_TEXT;
      changed = true;
    }

    if (!year && !text) {
      changed = true;
      continue;
    }
    if (!text) {
      // Do not leave empty milestone cells on the public About page.
      changed = true;
      continue;
    }

    if (year !== item.year || text !== item.text) {
      changed = true;
      next.push({ ...item, year, text });
    } else {
      next.push(item);
    }
  }

  return { value: changed ? next : list, changed };
}

/**
 * @returns {{ content: object, changed: boolean }}
 */
export function applyPublicContentRepairs(raw = {}) {
  let content = { ...raw };
  let changed = false;

  const emailPass = deepFixEmails(content);
  content = emailPass.value;
  if (emailPass.changed) changed = true;

  const contact = { ...(content.contact || {}) };
  if (!String(contact.email || '').trim() || EMAIL_TYPO_RE.test(contact.email || '')) {
    EMAIL_TYPO_RE.lastIndex = 0;
    if (contact.email !== CORRECT_CONTACT_EMAIL) {
      contact.email = CORRECT_CONTACT_EMAIL;
      changed = true;
    }
  }
  if (contact.placeholders && typeof contact.placeholders === 'object') {
    const placeholders = { ...contact.placeholders };
    if (placeholders.email === 'Contact email coming soon') {
      placeholders.email = CORRECT_CONTACT_EMAIL;
      contact.placeholders = placeholders;
      changed = true;
    }
  }
  const newsletter = { ...(contact.newsletter || {}) };
  if (newsletter.body === NEWSLETTER_BODY_BAD) {
    newsletter.body = NEWSLETTER_BODY_GOOD;
    contact.newsletter = newsletter;
    changed = true;
  }
  content.contact = { ...content.contact, ...contact };

  const pages = { ...(content.pages || {}) };
  if (pages.contact?.story === CONTACT_STORY_BAD) {
    pages.contact = { ...pages.contact, story: CONTACT_STORY_GOOD };
    changed = true;
  }
  if (pages.reflections?.story === REFLECTIONS_STORY_BAD) {
    pages.reflections = { ...pages.reflections, story: REFLECTIONS_STORY_GOOD };
    changed = true;
  }
  if (pages.videos?.story === VIDEOS_STORY_BAD) {
    pages.videos = { ...pages.videos, story: VIDEOS_STORY_GOOD };
    changed = true;
  }
  if (pages.events?.story === EVENTS_STORY_BAD) {
    pages.events = { ...pages.events, story: EVENTS_STORY_GOOD };
    changed = true;
  }

  if (pages.about && Array.isArray(pages.about.milestones)) {
    const milestonesFix = repairAboutMilestones(pages.about.milestones);
    if (milestonesFix.changed) {
      pages.about = { ...pages.about, milestones: milestonesFix.value };
      changed = true;
    }
  }

  content.pages = pages;

  const reflectionsFix = repairHomeReflections(content.reflections);
  if (reflectionsFix.changed) {
    content.reflections = reflectionsFix.value;
    changed = true;
  }

  return { content, changed };
}
