import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';

export default function NotFoundPage() {
  return (
    <SiteLayout>
      <section className="section">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 560, marginInline: 'auto' }}>
          <span className="label label--center">404</span>
          <h1 className="section-title" style={{ marginInline: 'auto' }}>
            This page is not on our path
          </h1>
          <p className="section-lead" style={{ marginInline: 'auto' }}>
            The link may be outdated, or the page moved. Head home to continue exploring Unique
            Generation Outreach.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn--primary" to="/">
              Back home
            </Link>
            <Link className="btn btn--outline" to="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
