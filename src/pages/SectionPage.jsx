import { Link } from 'react-router-dom';
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
} from './views/UniquePages';

const VIEW_MAP = {
  about: AboutUnique,
  pillars: PillarsUnique,
  gatherings: GatheringsUnique,
  reflections: ReflectionsUnique,
  leadership: LeadershipUnique,
  faq: FaqUnique,
  contact: ContactUnique,
};

export default function SectionPage({ pageKey }) {
  const { content, loading, error } = useContent();

  if (loading) {
    return <div className="boot-screen">Loading Unique Generation Outreach…</div>;
  }

  if (error || !content) {
    return <div className="boot-screen">Could not load site content. {error}</div>;
  }

  const page = content.pages?.[pageKey] || {};
  const View = VIEW_MAP[pageKey];

  if (!View) {
    return (
      <SiteLayout>
        <div className="section wrap">
          <h1>Page not found</h1>
          <Link to="/">Back home</Link>
        </div>
      </SiteLayout>
    );
  }

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
