import { initials } from '../cms/ContentContext';

export default function TeamAvatar({ person, large = false }) {
  const photo = person?.photo || person?.image || '';
  const className = large ? 'avatar avatar--lg' : 'avatar';
  if (photo) {
    return (
      <div className={`${className} avatar--photo`}>
        <img src={photo} alt={person.name || ''} />
      </div>
    );
  }
  return (
    <div className={className} aria-hidden="true">
      {initials(person?.name)}
    </div>
  );
}
