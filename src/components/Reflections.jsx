import { motion } from 'framer-motion';
import { reflections } from '../data/content';

export default function Reflections() {
  return (
    <section className="section" id="reflections">
      <div className="wrap">
        <span className="eyebrow">Reflections</span>
        <h2 className="section-title">Nourish the journey with the Word</h2>
        <p className="section-lead">
          Short reflections that connect faith to everyday life — sample pieces inspired by our GHP
          themes until official teachings are published.
        </p>
        <div className="reflections-list">
          {reflections.map((r, i) => (
            <motion.article
              key={r.title}
              className="reflection"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="reflection__date">{r.date}</div>
              <div>
                <h3>{r.title}</h3>
                <p>{r.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
