import { Link } from 'react-router-dom';

export default function PageHero({ label, title, intro, image }) {
  return (
    <section className={`page-hero${image ? '' : ' page-hero--plain'}`}>
      <div className="page-hero__media" aria-hidden="true">
        {image ? <img src={image} alt="" /> : null}
        <div className="page-hero__overlay" />
      </div>
      <div className="wrap page-hero__content">
        <p className="page-hero__crumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>{label || title}</span>
        </p>
        {label ? (
          <span className="label page-hero__label">{label}</span>
        ) : null}
        <h1>{title}</h1>
        {intro ? <p className="page-hero__intro">{intro}</p> : null}
      </div>
    </section>
  );
}
