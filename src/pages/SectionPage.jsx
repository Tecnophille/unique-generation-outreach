import { Link, useParams } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import PageHero from '../components/PageHero';
import Contact from '../components/Contact';
import { useContent } from '../cms/ContentContext';
import {
  AboutUnique,
  PillarsUnique,
  GatheringsUnique,
  ReflectionsUnique,
  LeadershipUnique,
  FaqUnique,
  ContactUnique,
  CustomPageUnique,
} from './views/UniquePages';

const VIEW_MAP = {
  about: AboutUnique,
  pillars: PillarsUnique,
  gatherings: GatheringsUnique,
  reflections: ReflectionsUnique,
  leadership: LeadershipUnique,
  faq: FaqUnique,
  contact: ContactUnique,
  events: CustomPageUnique,
  videos: CustomPageUnique,
};

const RESERVED = new Set(['admin', 'api', 'uploads']);

export default function SectionPage({ pageKey: pageKeyProp }) {
  const params = useParams();
  const pageKey = pageKeyProp || params.pageKey;
  const { content, loading, error } = useContent();

  if (loading) {
    return <div className="boot-screen">Loading Unique Generation Outreach…</div>;
  }

  if (error || !content) {
    return <div className="boot-screen">Could not load site content. {error}</div>;
  }

  if (!pageKey || RESERVED.has(pageKey)) {
    return (
      <SiteLayout>
        <div className="section wrap">
          <h1>Page not found</h1>
          <Link to="/">Back home</Link>
        </div>
      </SiteLayout>
    );
  }

  const page = content.pages?.[pageKey];
  const status = page?.status || 'published';
  const scheduledReady =
    status === 'scheduled' &&
    page?.publishAt &&
    !Number.isNaN(Date.parse(page.publishAt)) &&
    Date.parse(page.publishAt) <= Date.now();
  const isLive = status === 'published' || scheduledReady;
  if (!page || !isLive) {
    return (
      <SiteLayout>
        <div className="section wrap">
          <h1>Page not found</h1>
          <Link to="/">Back home</Link>
        </div>
      </SiteLayout>
    );
  }

  const View = VIEW_MAP[pageKey] || CustomPageUnique;

  return (
    <SiteLayout>
      <PageHero
        label={page.label || pageKey}
        title={page.title || pageKey}
        intro={page.intro}
        image={page.heroImage}
      />
      <View page={page} />
      {pageKey === 'contact' ? <Contact /> : null}
    </SiteLayout>
  );
}
