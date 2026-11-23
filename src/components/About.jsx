import { motion } from 'framer-motion';
import { about } from '../data/content';

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="wrap">
        <motion.div
          className="about__text"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="label">{about.label}</span>
          <h2>{about.body}</h2>
          <a className="btn btn--outline" href={about.cta.href}>
            {about.cta.label}
          </a>
        </motion.div>
        <div className="about__gallery">
          {about.images.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={src} alt="" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
