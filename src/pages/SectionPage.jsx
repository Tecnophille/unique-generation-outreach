import { useParams } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import PageHero from '../components/PageHero';
import Contact from '../components/Contact';
import BootScreen from '../components/BootScreen';
import { useContent } from '../cms/ContentContext';
import NotFoundPage from './NotFoundPage';
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
  resources: CustomPageUnique,
};

const RESERVED = new Set(['admin', 'api', 'uploads']);

export default function SectionPage({ pageKey: pageKeyProp }) {
  const params = useParams();
  const pageKey = pageKeyProp || params.pageKey;
  const { content, loading, error } = useContent();

  if (loading) {
    return <BootScreen />;
  }

  if (error || !content) {
    return (
      <div className="boot-screen boot-screen--message">
        <div className="boot-screen__message">
          <img
            className="boot-screen__logo boot-screen__logo--sm"
            src="/logo-icon.png?v=3"
            alt=""
            width={56}
            height={56}
          />
          <p>Could not load site content.{error ? ` ${error}` : ''}</p>
        </div>
      </div>
    );
  }

  if (!pageKey || RESERVED.has(pageKey)) {
    return <NotFoundPage />;
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
    return <NotFoundPage />;
  }

  const View = VIEW_MAP[pageKey] || CustomPageUnique;

  return (
    <SiteLayout>
      <div className="page-shell" key={pageKey}>
        <PageHero
          label={page.label || pageKey}
          title={page.title || pageKey}
          intro={page.intro}
          image={page.heroImage}
          imagePosition={page.heroImagePosition}
        />
        <div className="page-shell__body">
          <View page={page} pageKey={pageKey} />
          {pageKey === 'contact' ? <Contact /> : null}
        </div>
      </div>
    </SiteLayout>
  );
}
