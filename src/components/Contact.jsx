import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { mediaAlt } from '../cms/mediaAlt';
import { IconMail, IconPeople } from './Icons';
import { useMotionPrefs } from './motion';

export const CONTACT_TOPICS = [
  'General enquiries',
  'Volunteering',
  'Gatherings',
  'Partnership',
  'Prayer',
  'Other',
];

export function topicFromChannelTitle(title) {
  const t = String(title || '').toLowerCase();
  if (t.includes('volunteer')) return 'Volunteering';
  if (t.includes('gather')) return 'Gatherings';
  if (t.includes('partner')) return 'Partnership';
  if (t.includes('pray')) return 'Prayer';
  if (t.includes('general') || t.includes('enquir')) return 'General enquiries';
  return 'General enquiries';
}

export function topicQueryValue(topic) {
  return String(topic || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function topicFromQuery(value) {
  const slug = String(value || '')
    .toLowerCase()
    .trim();
  if (!slug) return '';
  const match = CONTACT_TOPICS.find((t) => topicQueryValue(t) === slug);
  if (match) return match;
  if (slug.includes('volunteer')) return 'Volunteering';
  if (slug.includes('gather')) return 'Gatherings';
  if (slug.includes('partner')) return 'Partnership';
  if (slug.includes('pray')) return 'Prayer';
  if (slug.includes('general') || slug.includes('enquir')) return 'General enquiries';
  return '';
}

function telHref(phone) {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
}

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [searchParams] = useSearchParams();
  const enquiryRef = useRef(null);
  const formIds = useId();
  const { reduce, transition } = useMotionPrefs();

  const [name, setName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [topic, setTopic] = useState('General enquiries');
  const [message, setMessage] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState('');
  const [enquiryError, setEnquiryError] = useState('');
  const [enquiryBusy, setEnquiryBusy] = useState(false);

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

  useEffect(() => {
    const fromQuery = topicFromQuery(searchParams.get('topic'));
    if (fromQuery) setTopic(fromQuery);

    if (window.location.hash === '#enquiry' && enquiryRef.current) {
      const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      enquiryRef.current.scrollIntoView({
        behavior: prefersReduce ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, [searchParams]);

  async function submitEnquiry(e) {
    e.preventDefault();
    setEnquiryBusy(true);
    setEnquiryStatus('');
    setEnquiryError('');
    try {
      const chosenTopic = topic || 'General enquiries';
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: enquiryEmail.trim(),
          subject: chosenTopic,
          message: message.trim(),
          source: 'enquiry',
        }),
      });
      if (!res.ok) {
        let detail = 'Could not send your message right now';
        try {
          const data = await res.json();
          if (data?.error) detail = data.error;
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }
      setEnquiryStatus('Thank you — your message is with the Unique Generation Outreach team.');
      setName('');
      setEnquiryEmail('');
      setMessage('');
    } catch (err) {
      setEnquiryError(err.message || 'Submit failed');
    } finally {
      setEnquiryBusy(false);
    }
  }

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
      <div className="wrap contact-stack">
        <motion.div
          className="contact-enquiry"
          id="enquiry"
          ref={enquiryRef}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={transition}
        >
          <div className="contact-enquiry__intro">
            <span className="label">Write to us</span>
            <h2>Send a message</h2>
            <p>
              Share a question, volunteering interest, or gathering note. We read every message and
              reply as soon as we can.
            </p>
          </div>
          <form className="enquiry-form" onSubmit={submitEnquiry} noValidate={false}>
            <div className="enquiry-form__row">
              <div className="enquiry-form__field">
                <label htmlFor={`${formIds}-name`}>Name</label>
                <input
                  id={`${formIds}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={120}
                />
              </div>
              <div className="enquiry-form__field">
                <label htmlFor={`${formIds}-email`}>Email</label>
                <input
                  id={`${formIds}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={enquiryEmail}
                  onChange={(e) => setEnquiryEmail(e.target.value)}
                  required
                  maxLength={180}
                />
              </div>
            </div>
            <div className="enquiry-form__field">
              <label htmlFor={`${formIds}-topic`}>Topic (optional)</label>
              <select
                id={`${formIds}-topic`}
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {CONTACT_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="enquiry-form__field">
              <label htmlFor={`${formIds}-message`}>Message</label>
              <textarea
                id={`${formIds}-message`}
                name="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={5000}
                placeholder="How can we walk with you?"
              />
            </div>
            <div className="enquiry-form__actions">
              <button type="submit" className="btn btn--solid" disabled={enquiryBusy}>
                {enquiryBusy ? 'Sending…' : 'Send message'}
              </button>
              {enquiryStatus ? <p className="enquiry-form__status">{enquiryStatus}</p> : null}
              {enquiryError ? (
                <p className="enquiry-form__status enquiry-form__status--error">{enquiryError}</p>
              ) : null}
            </div>
          </form>
        </motion.div>

        <motion.div
          className="contact-panel"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={transition}
        >
          <div className="contact-cta">
            {contact.skyImage ? (
              <img
                src={contact.skyImage}
                alt={mediaAlt(contact, 'Unique Generation Outreach community')}
              />
            ) : null}
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
              <label className="sr-only" htmlFor={`${formIds}-news-email`}>
                Email
              </label>
              <input
                id={`${formIds}-news-email`}
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
