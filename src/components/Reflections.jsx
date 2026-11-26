import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { DEFAULT_REFLECTIONS_IMAGE } from '../cms/contentModel';
import { mediaAlt, slugifyAnchor } from '../cms/mediaAlt';
import { IconBook, IconCal } from './Icons';
import { useMotionPrefs } from './motion';

export default function Reflections() {
  const { content } = useContent();
  const reflections = content.reflections || [];
  const image = content.reflectionsImage || DEFAULT_REFLECTIONS_IMAGE;
  const { reduce, transition, stagger } = useMotionPrefs();

  return (
    <section className="section" id="reflections">
      <div className="wrap reflections">
        <motion.div
          className="reflections__intro"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={transition}
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
              <img
                src={typeof image === 'string' ? image : image.src || image.url}
                alt={mediaAlt(
                  typeof image === 'string' ? { src: image } : image,
                  'Worship and the Word at Unique Generation Outreach',
                )}
              />
            </figure>
          ) : null}
        </motion.div>
        <div className="reflection-cards">
          {reflections.map((r, i) => {
            const pageArticles = content.pages?.reflections?.articles || [];
            const matched =
              pageArticles.find((a) => a.title === r.title) ||
              pageArticles.find((a) => a.date && a.date === r.date);
            const anchor = slugifyAnchor(matched?.title || '');
            return (
              <motion.article
                key={r.title}
                className="reflection-card"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...transition, delay: reduce ? 0 : i * stagger }}
              >
                <div className="reflection-card__date">
                  <IconCal />
                  {r.date}
                </div>
                <h3>{r.title}</h3>
                <p>{r.excerpt}</p>
                <Link
                  className="link-more"
                  to={anchor ? `/reflections#${anchor}` : '/reflections'}
                >
                  Read reflection
                  <span className="link-more__arrow">↗</span>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
