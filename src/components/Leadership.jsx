import { motion } from 'framer-motion';
import { initials, leadership } from '../data/content';

export default function Leadership() {
  const [convener, ...team] = leadership;

  return (
    <section className="section" id="leadership">
      <div className="wrap">
        <span className="eyebrow">Leadership</span>
        <h2 className="section-title">People who steward the mission</h2>
        <p className="section-lead">
          Meet the Convener and the team who carry Unique Generation Outreach across administration,
          events, creativity, protocol, volunteering, and development.
        </p>

        <motion.article
          className="leader leader-featured"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="avatar avatar--lg" aria-hidden="true">
            {initials(convener.name)}
          </div>
          <div>
            <div className="leader__role">{convener.role}</div>
            <h3>{convener.name}</h3>
            <p className="leader__titles">{convener.titles}</p>
            <p>{convener.bio}</p>
          </div>
        </motion.article>

        <div className="team-grid">
          {team.map((person, i) => (
            <motion.article
              key={person.name}
              className="leader team-member"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="avatar" aria-hidden="true">
                {initials(person.name)}
              </div>
              <div>
                <div className="leader__role">{person.role}</div>
                <h3>{person.name}</h3>
                <p className="leader__titles">{person.titles}</p>
                {person.location ? (
                  <p className="leader__location">{person.location}</p>
                ) : null}
                <p>{person.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="gatherings-note">
          Portrait placeholders use initials — swap in official headshots when provided.
        </p>
      </div>
    </section>
  );
}
