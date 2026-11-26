import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { PillarGlyph } from './Icons';
import { useMotionPrefs } from './motion';

export default function Pillars() {
  const { content } = useContent();
  const pillars = content.pillars || [];
  const { reduce, transition, stagger } = useMotionPrefs();

  return (
    <section className="section" id="pillars">
      <div className="wrap">
        <div className="section-head">
          <span className="label label--center">Pillars</span>
          <h2>Moments of purpose that shape our journey</h2>
          <p>
            Each pillar guides how we serve — from unity and empowerment to gatherings that bring
            communities together in faith and service.
          </p>
        </div>
        <div className="pillars-grid">
          {pillars.map((item, i) => (
            <motion.article
              key={item.title}
              className="pillar-card"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ ...transition, delay: reduce ? 0 : i * stagger }}
            >
              <div className="pillar-card__icon" style={{ background: item.color }} aria-hidden="true">
                <PillarGlyph name={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link className="link-more" to="/contact">
                Learn more
                <span className="link-more__arrow">↗</span>
              </Link>
            </motion.article>
          ))}
        </div>
        <div className="section-cta section-cta--flush">
          <Link className="btn btn--outline" to="/pillars">
            Explore all pillars
          </Link>
        </div>
      </div>
    </section>
  );
}
