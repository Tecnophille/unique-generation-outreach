import { motion } from 'framer-motion';
import { about } from '../data/content';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">{about.eyebrow}</span>
          <h2 className="section-title">{about.title}</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-lead">{about.body}</p>
          <p className="about__note">{about.note}</p>
        </motion.div>
      </div>
    </section>
  );
}
