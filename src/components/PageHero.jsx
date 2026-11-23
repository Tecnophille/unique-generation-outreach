import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ease } from './motion';

export default function PageHero({ label, title, intro, image }) {
  const reduce = useReducedMotion();

  return (
    <section className={`page-hero${image ? '' : ' page-hero--plain'}`}>
      <div className="page-hero__media" aria-hidden="true">
        {image ? (
          <motion.img
            src={image}
            alt=""
            initial={reduce ? false : { opacity: 0.55, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 1.15, ease }}
          />
        ) : null}
        <div className="page-hero__overlay" />
      </div>
      <div className="wrap page-hero__content">
        <motion.p
          className="page-hero__crumb"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, ease }}
        >
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>{label || title}</span>
        </motion.p>
        {label ? (
          <motion.span
            className="label page-hero__label"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.06, ease }}
          >
            {label}
          </motion.span>
        ) : null}
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.1, ease }}
        >
          {title}
        </motion.h1>
        {intro ? (
          <motion.p
            className="page-hero__intro"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.22, ease }}
          >
            {intro}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
