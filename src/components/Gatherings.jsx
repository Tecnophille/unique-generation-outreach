import { motion } from 'framer-motion';
import { gatherings } from '../data/content';
import { IconCal } from './Icons';

export default function Gatherings() {
  return (
    <section className="section" id="gatherings" style={{ background: 'var(--paper)' }}>
      <div className="wrap">
        <div className="section-head">
          <span className="label label--center">Gatherings</span>
          <h2>News and moments from our community</h2>
          <p>
            From Koinonia to Shabach, our GHP gatherings mark seasons of fellowship, honour, and
            praise. Gallery photos coming soon — placeholders shown for now.
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
                <img src={g.image} alt="" />
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
          <a className="btn btn--outline" href="#contact">
            Learn about Berakah 2026
          </a>
        </div>
      </div>
    </section>
  );
}
