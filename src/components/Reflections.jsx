import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { DEFAULT_REFLECTIONS_IMAGE } from '../cms/contentModel';
import { IconBook, IconCal } from './Icons';

export default function Reflections() {
  const { content } = useContent();
  const reflections = content.reflections || [];
  const image = content.reflectionsImage || DEFAULT_REFLECTIONS_IMAGE;

  return (
    <section className="section" id="reflections">
      <div className="wrap reflections">
        <motion.div
          className="reflections__intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="label">Reflections</span>
          <h2>Nourish your faith day to day with the Word</h2>
          <p>
            Short reflections that connect faith to everyday life — drawn from our GHP themes of
            fellowship, honour, praise, and blessing.
          </p>
          <Link className="btn btn--outline" to="/reflections">
            Read more reflections
            <span className="btn__icon">
              <IconBook />
            </span>
          </Link>
          {image ? (
            <figure className="reflections__media">
              <img src={image} alt="Worship and the Word at Unique Generation Outreach" />
            </figure>
          ) : null}
        </motion.div>
        <div className="reflection-cards">
          {reflections.map((r, i) => (
            <motion.article
              key={r.title}
              className="reflection-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="reflection-card__date">
                <IconCal />
                {r.date}
              </div>
              <h3>{r.title}</h3>
              <p>{r.excerpt}</p>
              <Link className="link-more" to="/reflections">
                Read reflection
                <span className="link-more__arrow">↗</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
