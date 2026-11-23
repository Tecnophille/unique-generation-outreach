import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

export default function About() {
  const { content } = useContent();
  const about = content.about;

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
          <Link className="btn btn--outline" to={about.cta.href || '/leadership'}>
            {about.cta.label}
          </Link>
        </motion.div>
        <div className="about__gallery">
          {(about.images || []).map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={src} alt="Community life in Nigeria" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
