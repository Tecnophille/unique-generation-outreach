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

export default function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <About />
      <Pillars />
      <div className="wrap section-cta" style={{ paddingBottom: '0.5rem' }}>
        <Link className="btn btn--outline" to="/pillars">
          Explore all pillars
        </Link>
      </div>
      <Gatherings />
      <div className="wrap section-cta" style={{ paddingBottom: '0.5rem' }}>
        <Link className="btn btn--outline" to="/gatherings">
          Read full GHP stories
        </Link>
      </div>
      <FeaturedEventsStrip />
      <Reflections />
      <div className="wrap section-cta" style={{ paddingBottom: '0.5rem' }}>
        <Link className="btn btn--outline" to="/reflections">
          Read full reflections
        </Link>
      </div>
      <TestimonialsStrip />
      <PartnersStrip />
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
