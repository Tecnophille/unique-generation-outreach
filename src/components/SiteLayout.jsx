import Nav from './Nav';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import BackToTop from './BackToTop';
import { useContent } from '../cms/ContentContext';

export default function SiteLayout({ children }) {
  const { content, loading, error } = useContent();

  if (loading) {
    return <div className="boot-screen">Loading Unique Generation Outreach…</div>;
  }

  if (error || !content) {
    return <div className="boot-screen">Could not load site content. {error}</div>;
  }

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main id="top" className="site-main">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
