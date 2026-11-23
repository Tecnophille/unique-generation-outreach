import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../cms/ContentContext';
import { IconMail, IconPeople } from './Icons';

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitNewsletter(e) {
    e.preventDefault();
    setBusy(true);
    setFormStatus('');
    setFormError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: '',
          subject: 'Newsletter signup',
          message: `Please add ${email} to the Unique Generation Outreach updates list.`,
          source: 'newsletter',
        }),
      });
      if (!res.ok) throw new Error('Could not submit right now');
      setFormStatus('Thanks — we received your request.');
      setEmail('');
    } catch (err) {
      setFormError(err.message || 'Submit failed');
    } finally {
      setBusy(false);
    }
  }

  return (
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
            <form className="news-form" onSubmit={submitNewsletter}>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="jane@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn--primary" disabled={busy}>
                {busy ? 'Sending…' : 'Submit'}
              </button>
            </form>
            {formStatus ? <p className="contact-placeholders">{formStatus}</p> : null}
            {formError ? <p className="contact-placeholders">{formError}</p> : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
