import { motion } from 'framer-motion';
import { hero } from '../data/content';
import { IconCross, IconHands } from './Icons';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-label="Hero">
      <div className="hero__media" aria-hidden="true">
        <img src={hero.image} alt="" />
        <div className="hero__overlay" />
      </div>
      <div className="hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero__badge-dot" aria-hidden="true">
            ✦
          </span>
          {hero.badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          className="hero__support"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.support}
        </motion.p>
        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <a className="btn btn--primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
            <span className="btn__icon">
              <IconCross />
            </span>
          </a>
          <a className="btn btn--ghost" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
            <span className="btn__icon">
              <IconHands />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
