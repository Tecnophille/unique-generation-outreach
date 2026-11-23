import { motion } from 'framer-motion';
import { gatherings } from '../data/content';

export default function Gatherings() {
  return (
    <section className="section" id="gatherings">
      <div className="wrap">
        <span className="eyebrow">Gatherings</span>
        <h2 className="section-title">GHP — seasons of encounter</h2>
        <p className="section-lead">
          From Koinonia to Berakah, our flagship gatherings mark years of fellowship, honour,
          praise, and blessing.
        </p>
        <div className="gatherings-grid">
          {gatherings.map((g, i) => (
            <motion.article
              key={g.name}
              className="gathering"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={g.image} alt="" />
              <div className="gathering__shade" aria-hidden="true" />
              <div className="gathering__meta">
                <div className="gathering__year">GHP {g.year}</div>
                <h3>{g.name}</h3>
                <p>{g.theme}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="gatherings-note">
          Photo placeholders — replace with official GHP gallery images and Convener moments when
          available.
        </p>
      </div>
    </section>
  );
}
