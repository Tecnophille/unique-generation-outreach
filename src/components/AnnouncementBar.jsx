import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

export default function AnnouncementBar() {
  const { content } = useContent();
  const item = (content?.announcements || []).find((a) => a.enabled && a.text);
  if (!item) return null;

  const inner = item.href ? (
    item.href.startsWith('http') ? (
      <a href={item.href}>{item.text}</a>
    ) : (
      <Link to={item.href}>{item.text}</Link>
    )
  ) : (
    <span>{item.text}</span>
  );

  return (
    <div className={`announce announce--${item.tone || 'accent'}`} role="status">
      <div className="wrap announce__inner">{inner}</div>
    </div>
  );
}
