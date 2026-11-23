import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentPath = path.join(root, 'public/cms/content.json');
const base = 'http://127.0.0.1:5173';

const U = (name) => `/uploads/from-pdf/selected/${name}`;

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

content.hero.image = U('hero-hall.jpg');
content.about.images = [U('about-worship.jpg'), U('about-joy.jpg'), U('about-music.jpg')];

content.gatherings = [
  {
    tag: 'GHP',
    name: 'Koinonia',
    year: '2022',
    image: U('ghp-koinonia.jpg'),
    theme: 'Fellowship & belonging',
  },
  {
    tag: 'GHP',
    name: 'Kavod',
    year: '2024',
    image: U('ghp-kavod.jpg'),
    theme: 'Honour & reverence in community life',
  },
  {
    tag: 'GHP',
    name: 'Shabach',
    year: '2025',
    image: U('ghp-shabach.jpg'),
    theme: 'Praise, celebration, and shared joy',
  },
];

const photoByName = {
  'Leader Daniel Ajuruchukwu': U('convener.jpg'),
  'Oguaju Soromkelechi Victor': U('team-sorom.jpg'),
  'Sunday Hope Anulika': U('team-hope.jpg'),
  'Ing. Cynthia Uloma Offor': U('team-cynthia.jpg'),
  'Oziomachukwu Amaefula': U('team-ozioma.jpg'),
  'Ifeanyi Daniel': U('team-ifeanyi.jpg'),
  'Chibuike Henry Vincent': U('team-chibuike.jpg'),
  'Okafor Chukwunwem': U('team-okafor.jpg'),
  'Dr. Cosmic Macduff': U('team-cosmic.jpg'),
  'Ojugbana Chukwuka Bobby': U('team-bobby.jpg'),
};

content.leadership = (content.leadership || []).map((person) => {
  const photo = photoByName[person.name];
  if (!photo) return person;
  return { ...person, photo };
});

const pages = content.pages || {};

if (pages.about) {
  pages.about.heroImage = U('about-leadership-line.jpg');
  pages.about.gallery = [
    { src: U('about-worship.jpg'), caption: 'Worship and devotion at UGO gatherings' },
    { src: U('community-white.jpg'), caption: 'Community gathered in unity' },
    { src: U('bold-voice-leaders.jpg'), caption: 'Bold Voice TV · Unique Generation Outreach' },
  ];
}

if (pages.gatherings) {
  pages.gatherings.heroImage = U('hero-hall.jpg');
  pages.gatherings.events = (pages.gatherings.events || []).map((ev) => {
    const map = {
      Koinonia: U('ghp-koinonia.jpg'),
      Kavod: U('ghp-kavod.jpg'),
      Shabach: U('ghp-shabach.jpg'),
      Berakah: U('ghp-berakah.jpg'),
    };
    return map[ev.name] ? { ...ev, image: map[ev.name] } : ev;
  });
}

if (pages.leadership) {
  pages.leadership.heroImage = U('bold-voice-leaders.jpg');
}
if (pages.pillars) {
  pages.pillars.heroImage = U('about-music.jpg');
}
if (pages.reflections) {
  pages.reflections.heroImage = U('about-worship.jpg');
}
if (pages.faq) {
  pages.faq.heroImage = U('community-white.jpg');
}
if (pages.contact) {
  pages.contact.heroImage = U('about-leadership-line.jpg');
}

content.contact.skyImage = U('hero-hall.jpg');
content.seo = content.seo || {};
content.seo.ogImage = U('hero-hall.jpg');
content.updatedAt = new Date().toISOString();

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
console.log('Wrote', contentPath);

const loginRes = await fetch(`${base}/api/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@ugo.local', password: 'ugoadmin2026' }),
});
const loginBody = await loginRes.json();
if (!loginRes.ok) {
  console.error('Login failed', loginBody);
  process.exit(1);
}
const token = loginBody.token;
const putRes = await fetch(`${base}/api/content`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    Cookie: `ugo_cms_token=${token}`,
  },
  body: JSON.stringify(content),
});
const putBody = await putRes.json().catch(() => ({}));
if (!putRes.ok) {
  console.error('Content save failed', putRes.status, putBody);
  process.exit(1);
}
console.log('CMS content updated via API');
console.log(
  'Photos mapped:',
  content.leadership.filter((p) => p.photo).map((p) => p.name).join(', '),
);
