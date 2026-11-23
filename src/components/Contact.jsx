import { motion } from 'framer-motion';
import { brand, contact, nav } from '../data/content';

export default function Contact() {
  return (
    <>
      <section className="section section--tight" id="contact">
        <div className="wrap contact-block">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">Connect</span>
            <h2 className="section-title">{contact.title}</h2>
            <p className="section-lead">{contact.body}</p>
            <p style={{ marginTop: '1.75rem' }}>
              <a className="btn btn--solid" href="#leadership">
                Meet the team
              </a>
            </p>
          </motion.div>
          <div className="contact-details">
            <div className="contact-detail">
              <span>Email</span>
              <p>{contact.placeholders.email}</p>
              <span className="placeholder-tag">Awaiting official address</span>
            </div>
            <div className="contact-detail">
              <span>Phone</span>
              <p>{contact.placeholders.phone}</p>
              <span className="placeholder-tag">Awaiting official number</span>
            </div>
            <div className="contact-detail">
              <span>Presence</span>
              <p>{contact.placeholders.location}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div>
            <div className="footer__brand">{brand.name}</div>
            <p className="footer__copy">
              Unity · Empowerment · Opportunities · Transformation
              <br />© {new Date().getFullYear()} {brand.name}
            </p>
          </div>
          <ul className="footer__links">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
