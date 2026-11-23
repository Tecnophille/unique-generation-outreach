import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { IconCal } from './Icons';

export default function Gatherings() {
  const { content } = useContent();
  const gatherings = content.gatherings || [];

  return (
    <section className="section" id="gatherings" style={{ background: 'var(--paper)' }}>
      <div className="wrap">
        <div className="section-head">
          <span className="label label--center">Gatherings</span>
          <h2>News and moments from our community</h2>
          <p>
            From Koinonia to Shabach, our GHP gatherings mark seasons of fellowship, honour, and
            praise across Nigeria and beyond.
          </p>
        </div>
        <div className="gatherings-grid">
          {gatherings.map((g, i) => (
            <motion.article
              key={g.name}
              className="gather-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="gather-card__img">
                <img src={g.image} alt={`${g.name} gathering`} />
              </div>
              <div className="gather-card__meta">
                <span className="tag">{g.tag}</span>
                <span className="gather-card__date">
                  <IconCal />
                  {g.year}
                </span>
              </div>
              <h3>{g.name}</h3>
              <p>{g.theme}</p>
            </motion.article>
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn btn--outline" to="/contact">
            Learn about Berakah 2026
          </Link>
        </div>
      </div>
    </section>
  );
}
