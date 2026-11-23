import { Field } from './fields';
import MediaPicker from './MediaPicker';

export default function SettingsEditor({ draft, setDraft }) {
  const seo = draft.seo || {};
  const social = draft.social || {};
  const footer = draft.footer || {};
  const brand = draft.brand || {};

  return (
    <>
      <h2>Site settings</h2>
      <p className="hint">Brand identity, default SEO, social profiles, and footer copy.</p>

      <div className="admin-card admin-grid">
        <h3 style={{ margin: 0 }}>Brand</h3>
        <div className="admin-grid two">
          <Field label="Organization name">
            <input
              value={brand.name || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, brand: { ...d.brand, name: e.target.value } }))
              }
            />
          </Field>
          <Field label="Short name">
            <input
              value={brand.short || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, brand: { ...d.brand, short: e.target.value } }))
              }
            />
          </Field>
        </div>
      </div>

      <div className="admin-card admin-grid">
        <h3 style={{ margin: 0 }}>Default SEO</h3>
        <Field label="Title template" hint="Use %s for the page title.">
          <input
            value={seo.titleTemplate || ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, seo: { ...d.seo, titleTemplate: e.target.value } }))
            }
          />
        </Field>
        <Field label="Default meta description">
          <textarea
            value={seo.defaultDescription || ''}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                seo: { ...d.seo, defaultDescription: e.target.value },
              }))
            }
          />
        </Field>
        <Field label="Default social image URL">
          <input
            value={seo.ogImage || ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, seo: { ...d.seo, ogImage: e.target.value } }))
            }
          />
        </Field>
        <MediaPicker
          onPick={(url) => setDraft((d) => ({ ...d, seo: { ...d.seo, ogImage: url } }))}
          label="Pick OG image"
        />
      </div>

      <div className="admin-card admin-grid">
        <h3 style={{ margin: 0 }}>Social links</h3>
        <div className="admin-grid two">
          {['facebook', 'instagram', 'youtube', 'twitter'].map((key) => (
            <Field key={key} label={key}>
              <input
                value={social[key] || ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    social: { ...d.social, [key]: e.target.value },
                  }))
                }
              />
            </Field>
          ))}
        </div>
      </div>

      <div className="admin-card admin-grid">
        <h3 style={{ margin: 0 }}>Footer</h3>
        <Field label="Footer blurb">
          <textarea
            value={footer.blurb || ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, footer: { ...d.footer, blurb: e.target.value } }))
            }
          />
        </Field>
        <Field label="Copyright line">
          <input
            value={footer.copyright || ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, footer: { ...d.footer, copyright: e.target.value } }))
            }
          />
        </Field>
        <p className="hint" style={{ margin: 0 }}>
          Public email and phone for the footer and contact panel are edited under{' '}
          <strong>Contact panel</strong> in the studio sidebar.
        </p>
      </div>
    </>
  );
}
