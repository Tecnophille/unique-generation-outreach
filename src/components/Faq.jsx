import { faqs } from '../data/content';

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <span className="eyebrow">FAQ</span>
        <h2 className="section-title">Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p className="faq-item__body">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
