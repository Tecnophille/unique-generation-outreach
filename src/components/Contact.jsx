import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../cms/ContentContext';
import { IconMail, IconPeople } from './Icons';

function telHref(phone) {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
}

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const contactEmail = (contact.email || '').trim();
  const contactPhone = (contact.phone || '').trim();
  const mailHref = contactEmail ? `mailto:${contactEmail}` : '';
  const phoneHref = telHref(contactPhone);
  const emailLabel =
    contactEmail || contact.placeholders?.email || 'contact@uniquegenerationoutreach.org';
  const phoneLabel = contactPhone || contact.placeholders?.phone || 'Phone number coming soon';

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
            {contact.skyImage ? <img src={contact.skyImage} alt="" /> : null}
            <h2>{contact.title}</h2>
            <p>{contact.body}</p>
            {mailHref ? (
              <a className="btn btn--primary" href={mailHref}>
                {contact.cta || 'Reach out to us'}
                <span className="btn__icon">
                  <IconMail />
                </span>
              </a>
            ) : (
              <span className="btn btn--primary" aria-disabled="true">
                {contact.cta || 'Reach out to us'}
                <span className="btn__icon">
                  <IconMail />
                </span>
              </span>
            )}
            <p className="contact-placeholders">
              {mailHref ? (
                <a href={mailHref}>{emailLabel}</a>
              ) : (
                <span>{emailLabel}</span>
              )}
              <span aria-hidden="true"> · </span>
              {phoneHref ? (
                <a href={phoneHref}>{phoneLabel}</a>
              ) : (
                <span>{phoneLabel}</span>
              )}
            </p>
          </div>
          <div className="contact-news">
            <h3>
              {contact.newsletter?.titleBefore}
              <em>{contact.newsletter?.titleAccent}</em>
            </h3>
            <p>{contact.newsletter?.body}</p>
            {(contact.newsletter?.features || []).map((f) => (
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
