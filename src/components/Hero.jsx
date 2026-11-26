import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { IconCross, IconHands } from './Icons';
import { useMotionPrefs } from './motion';

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;
  const { reduce, transition } = useMotionPrefs();

  return (
    <section className="hero" id="top" aria-label="Hero">
      <div className="hero__media" aria-hidden="true">
        <img
          src={hero.image}
          alt=""
          style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
        />
        <div className="hero__overlay" />
      </div>
      <div className="hero__content">
        <motion.div
          className="hero__badge"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition }}
        >
          <span className="hero__badge-dot" aria-hidden="true">
            ✦
          </span>
          {hero.badge}
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduce ? 0 : 0.08 }}
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          className="hero__support"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduce ? 0 : 0.2 }}
        >
          {hero.support}
        </motion.p>
        <motion.div
          className="hero__ctas"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduce ? 0 : 0.34 }}
        >
          <Link className="btn btn--primary" to={hero.primaryCta.href || '/pillars'}>
            {hero.primaryCta.label}
            <span className="btn__icon">
              <IconCross />
            </span>
          </Link>
          <Link className="btn btn--ghost" to={hero.secondaryCta.href || '/contact'}>
            {hero.secondaryCta.label}
            <span className="btn__icon">
              <IconHands />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
