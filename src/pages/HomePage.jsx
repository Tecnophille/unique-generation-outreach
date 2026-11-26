import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import Hero from '../components/Hero';
import About from '../components/About';
import Pillars from '../components/Pillars';
import Gatherings from '../components/Gatherings';
import Reflections from '../components/Reflections';
import Contact from '../components/Contact';
import {
  FeaturedEventsStrip,
  PartnersStrip,
  TestimonialsStrip,
} from '../components/SocialProof';
import { useContent } from '../cms/ContentContext';
import { PageBlocks } from './views/UniquePages';

export default function HomePage() {
  const { content } = useContent();

  return (
    <SiteLayout>
      <Hero />
      <About />
      <Pillars />
      <Gatherings />
      <FeaturedEventsStrip />
      <Reflections />
      <TestimonialsStrip />
      <PartnersStrip />
      <PageBlocks blocks={content?.homeBlocks} />
      <section className="section section--tight">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <span className="label label--center">Go deeper</span>
          <h2 className="section-title" style={{ marginInline: 'auto' }}>
            Explore the full story
          </h2>
          <p className="section-lead" style={{ marginInline: 'auto' }}>
            Menu pages carry unique content — leadership, FAQ, gatherings, and more — beyond these
            homepage teasers.
          </p>
          <div className="hero__ctas" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <Link className="btn btn--solid" to="/about">
              Our story
            </Link>
            <Link className="btn btn--outline" to="/leadership">
              Leadership
            </Link>
            <Link className="btn btn--outline" to="/faq">
              FAQ
            </Link>
          </div>
        </div>
      </section>
      <Contact />
    </SiteLayout>
  );
}
