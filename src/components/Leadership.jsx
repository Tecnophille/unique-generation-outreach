import { motion } from 'framer-motion';
import { useContent } from '../cms/ContentContext';
import TeamAvatar from './TeamAvatar';

export default function Leadership() {
  const { content } = useContent();
  const leadership = content.leadership || [];
  const [convener, ...team] = leadership;

  if (!convener) return null;

  return (
    <section className="section" id="leadership" style={{ background: 'var(--paper)' }}>
      <div className="wrap">
        <div className="section-head">
          <span className="label label--center">Leadership</span>
          <h2>People who steward the mission</h2>
          <p>
            Meet the Convener and the team who carry Unique Generation Outreach across
            administration, events, creativity, protocol, volunteering, and development.
          </p>
        </div>

        <motion.article
          className="leader leader-featured"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <TeamAvatar person={convener} large />
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
              className="leader team-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <TeamAvatar person={person} />
              <div>
                <div className="leader__role">{person.role}</div>
                <h3>{person.name}</h3>
                <p className="leader__titles">{person.titles}</p>
                {person.location ? <p className="leader__location">{person.location}</p> : null}
                <p>{person.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
