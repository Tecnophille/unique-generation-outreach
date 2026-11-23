import { motion } from 'framer-motion';
import { brand, hero } from '../data/content';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-label="Hero">
      <div className="hero__media" aria-hidden="true">
        <img src={hero.image} alt="" />
        <div className="hero__overlay" />
      </div>
      <div className="hero__content">
        <motion.p
          className="hero__brand"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {brand.name}
        </motion.p>
        <motion.h1
          className="hero__headline"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          className="hero__support"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.support}
        </motion.p>
        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <a className="btn btn--primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </a>
          <a className="btn btn--ghost" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
