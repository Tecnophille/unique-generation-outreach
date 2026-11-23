import { motion } from 'framer-motion';
import { pillars } from '../data/content';

export default function Pillars() {
  return (
    <section className="section" id="pillars">
      <div className="wrap">
        <span className="eyebrow">Our pillars</span>
        <h2 className="section-title">Moments of purpose that shape our journey</h2>
        <p className="section-lead">
          Each pillar guides how we serve — from unity and empowerment to gatherings that bring
          communities together.
        </p>
        <div className="pillars-grid">
          {pillars.map((item, i) => (
            <motion.article
              key={item.title}
              className="pillar"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pillar__index">0{i + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
