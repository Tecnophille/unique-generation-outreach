import { initials } from '../cms/ContentContext';
import { mediaAlt } from '../cms/mediaAlt';

export default function TeamAvatar({ person, large = false }) {
  const photo = person?.photo || person?.image || '';
  const className = large ? 'avatar avatar--lg' : 'avatar';
  const position = person?.photoPosition || person?.imagePosition || 'center top';
  if (photo) {
    return (
      <div className={`${className} avatar--photo`}>
        <img
          src={photo}
          alt={mediaAlt(person, person?.name ? `Portrait of ${person.name}` : 'Team member portrait')}
          style={{ objectPosition: position }}
        />
      </div>
    );
  }
  return (
    <div className={className} aria-hidden="true">
      {initials(person?.name)}
    </div>
  );
}
