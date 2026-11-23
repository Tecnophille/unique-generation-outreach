import { motion } from 'framer-motion';
import { brand, contact, nav } from '../data/content';
import { IconMail, IconPeople } from './Icons';

export default function Contact() {
  return (
    <>
      <section className="section" id="contact">
        <div className="wrap">
          <motion.div
            className="contact-panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contact-cta">
              <img src={contact.skyImage} alt="" />
              <h2>{contact.title}</h2>
              <p>{contact.body}</p>
              <a className="btn btn--primary" href="mailto:hello@uniquegeneration.outreach">
                {contact.cta}
                <span className="btn__icon">
                  <IconMail />
                </span>
              </a>
              <p className="contact-placeholders">
                {contact.placeholders.email} · {contact.placeholders.phone}
              </p>
            </div>
            <div className="contact-news">
              <h3>
                {contact.newsletter.titleBefore}
                <em>{contact.newsletter.titleAccent}</em>
              </h3>
              <p>{contact.newsletter.body}</p>
              {contact.newsletter.features.map((f) => (
                <div key={f.title} className="news-feature">
                  <div className="news-feature__icon" aria-hidden="true">
                    {f.title.includes('Community') ? <IconPeople /> : <IconMail />}
                  </div>
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </div>
                </div>
              ))}
              <form
                className="news-form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input id="email" type="email" name="email" placeholder="jane@email.com" />
                <button type="submit" className="btn btn--primary">
                  Submit
                </button>
              </form>
              <p className="contact-placeholders">Form is a visual placeholder until mailing is wired.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__grid">
            <div>
              <div className="footer__brand">
                <span className="nav__mark" aria-hidden="true">
                  <span>UG</span>
                </span>
                {brand.short}
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '16rem' }}>
                Unity · Empowerment · Opportunities · Transformation
              </p>
            </div>
            <div>
              <h4>Follow us</h4>
              <ul>
                <li>
                  <a href="#contact">Social links coming soon</a>
                </li>
                <li>
                  <a href="#contact">Volunteer with us</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Pillars</h4>
              <ul>
                <li>
                  <a href="#pillars">Unity</a>
                </li>
                <li>
                  <a href="#pillars">Empowerment</a>
                </li>
                <li>
                  <a href="#gatherings">Gatherings</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Pages</h4>
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
                <li>
                  <a href="#leadership">Leadership</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
          <p className="footer__copy">
            Copyright {new Date().getFullYear()} · {brand.name}
          </p>
        </div>
      </footer>
    </>
  );
}
