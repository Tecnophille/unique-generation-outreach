import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { mediaAlt } from '../cms/mediaAlt';
import { useMotionPrefs } from './motion';

export default function About() {
  const { content } = useContent();
  const about = content.about;
  const { reduce, transition, stagger } = useMotionPrefs();

  return (
    <section className="about section" id="about">
      <div className="wrap">
        <motion.div
          className="about__text"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={transition}
        >
          <span className="label">{about.label}</span>
          <h2>{about.body}</h2>
          <Link className="btn btn--outline" to={about.cta.href || '/leadership'}>
            {about.cta.label}
          </Link>
        </motion.div>
        <div className="about__gallery">
          {(about.images || []).map((src, i) => {
            const item = typeof src === 'string' ? { src } : src;
            const imageSrc = item.src || item.url || src;
            return (
              <motion.figure
                key={`${imageSrc}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...transition, delay: reduce ? 0 : i * stagger }}
              >
                <img
                  src={imageSrc}
                  alt={mediaAlt(item, 'Community life with Unique Generation Outreach')}
                />
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
