import Nav from './Nav';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import BackToTop from './BackToTop';
import BootScreen from './BootScreen';
import { useContent } from '../cms/ContentContext';

export default function SiteLayout({ children }) {
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
