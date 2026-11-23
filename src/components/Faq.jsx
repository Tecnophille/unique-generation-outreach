import { useContent } from '../cms/ContentContext';

export default function Faq() {
  const { content } = useContent();
  const faqs = content.faqs || [];

  return (
    <section className="section" id="faq">
      <div className="wrap faq">
        <div className="faq__intro">
          <span className="label">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                {item.q}
                <span className="faq-item__plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="faq-item__body">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
