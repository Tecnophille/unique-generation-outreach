import { useState } from 'react';
import { Field } from './fields';
import MediaPicker from './MediaPicker';
import BlocksEditor from './BlocksEditor';
import { DEFAULT_REFLECTIONS_IMAGE } from '../cms/contentModel';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About teaser' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'gatherings', label: 'Gatherings' },
  { id: 'reflections', label: 'Reflections' },
  { id: 'blocks', label: 'Extra blocks' },
];

export default function HomepageEditor({ draft, setDraft }) {
  const [tab, setTab] = useState('hero');

  return (
    <>
      <h2>Homepage studio</h2>
      <p className="hint">
        Edit hero and teasers here. Use Extra blocks for the same flexible sections as menu pages
        (rich text, quote, gallery, YouTube, CTA, stats, embed).
      </p>
      <div className="admin-page-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'is-active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <div className="admin-card admin-grid">
          <Field label="Badge">
            <input
              value={draft.hero?.badge || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, badge: e.target.value } }))
              }
            />
          </Field>
          <Field label="Headline">
            <input
              value={draft.hero?.headline || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, headline: e.target.value } }))
              }
            />
          </Field>
          <Field label="Support text">
            <textarea
              value={draft.hero?.support || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, support: e.target.value } }))
              }
            />
          </Field>
          <Field label="Hero image URL">
            <input
              value={draft.hero?.image || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hero: { ...d.hero, image: e.target.value } }))
              }
            />
          </Field>
          <MediaPicker
            onPick={(url) => setDraft((d) => ({ ...d, hero: { ...d.hero, image: url } }))}
          />
          {draft.hero?.image ? <img className="admin-thumb" src={draft.hero.image} alt="" /> : null}
          <div className="admin-grid two">
            <Field label="Primary CTA label">
              <input
                value={draft.hero?.primaryCta?.label || ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      primaryCta: { ...(d.hero?.primaryCta || {}), label: e.target.value },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Primary CTA href">
              <input
                value={draft.hero?.primaryCta?.href || ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      primaryCta: { ...(d.hero?.primaryCta || {}), href: e.target.value },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Secondary CTA label">
              <input
                value={draft.hero?.secondaryCta?.label || ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      secondaryCta: { ...(d.hero?.secondaryCta || {}), label: e.target.value },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Secondary CTA href">
              <input
                value={draft.hero?.secondaryCta?.href || ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    hero: {
                      ...d.hero,
                      secondaryCta: { ...(d.hero?.secondaryCta || {}), href: e.target.value },
                    },
                  }))
                }
              />
            </Field>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="admin-card admin-grid">
          <Field label="Label">
            <input
              value={draft.about?.label || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, about: { ...d.about, label: e.target.value } }))
              }
            />
          </Field>
          <Field label="Body">
            <textarea
              value={draft.about?.body || ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, about: { ...d.about, body: e.target.value } }))
              }
            />
          </Field>
          <Field label="CTA label">
            <input
              value={draft.about?.cta?.label || ''}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  about: { ...d.about, cta: { ...(d.about?.cta || {}), label: e.target.value } },
                }))
              }
            />
          </Field>
          {(draft.about?.images || []).map((src, i) => (
            <Field key={i} label={`Gallery image ${i + 1}`}>
              <input
                value={src}
                onChange={(e) => {
                  const images = [...(draft.about.images || [])];
                  images[i] = e.target.value;
                  setDraft((d) => ({ ...d, about: { ...d.about, images } }));
                }}
              />
              <MediaPicker
                onPick={(url) => {
                  const images = [...(draft.about.images || [])];
                  images[i] = url;
                  setDraft((d) => ({ ...d, about: { ...d.about, images } }));
                }}
              />
              {src ? <img className="admin-thumb" src={src} alt="" /> : null}
            </Field>
          ))}
        </div>
      )}

      {tab === 'pillars' &&
        (draft.pillars || []).map((p, i) => (
          <div className="admin-card admin-grid" key={i}>
            <div className="admin-grid two">
              <Field label="Title">
                <input
                  value={p.title || ''}
                  onChange={(e) => {
                    const pillars = [...draft.pillars];
                    pillars[i] = { ...p, title: e.target.value };
                    setDraft((d) => ({ ...d, pillars }));
                  }}
                />
              </Field>
              <Field label="Color">
                <input
                  value={p.color || ''}
                  onChange={(e) => {
                    const pillars = [...draft.pillars];
                    pillars[i] = { ...p, color: e.target.value };
                    setDraft((d) => ({ ...d, pillars }));
                  }}
                />
              </Field>
            </div>
            <Field label="Text">
              <textarea
                value={p.text || ''}
                onChange={(e) => {
                  const pillars = [...draft.pillars];
                  pillars[i] = { ...p, text: e.target.value };
                  setDraft((d) => ({ ...d, pillars }));
                }}
              />
            </Field>
          </div>
        ))}

      {tab === 'gatherings' && (
        <>
          {(draft.gatherings || []).map((g, i) => (
            <div className="admin-card admin-grid" key={i}>
              <div className="admin-grid two">
                <Field label="Year">
                  <input
                    value={g.year || ''}
                    onChange={(e) => {
                      const gatherings = [...draft.gatherings];
                      gatherings[i] = { ...g, year: e.target.value };
                      setDraft((d) => ({ ...d, gatherings }));
                    }}
                  />
                </Field>
                <Field label="Name">
                  <input
                    value={g.name || ''}
                    onChange={(e) => {
                      const gatherings = [...draft.gatherings];
                      gatherings[i] = { ...g, name: e.target.value };
                      setDraft((d) => ({ ...d, gatherings }));
                    }}
                  />
                </Field>
              </div>
              <Field label="Theme">
                <input
                  value={g.theme || ''}
                  onChange={(e) => {
                    const gatherings = [...draft.gatherings];
                    gatherings[i] = { ...g, theme: e.target.value };
                    setDraft((d) => ({ ...d, gatherings }));
                  }}
                />
              </Field>
              <Field label="Image URL">
                <input
                  value={g.image || ''}
                  onChange={(e) => {
                    const gatherings = [...draft.gatherings];
                    gatherings[i] = { ...g, image: e.target.value };
                    setDraft((d) => ({ ...d, gatherings }));
                  }}
                />
              </Field>
              <MediaPicker
                onPick={(url) => {
                  const gatherings = [...draft.gatherings];
                  gatherings[i] = { ...g, image: url };
                  setDraft((d) => ({ ...d, gatherings }));
                }}
              />
              <Field label="Image focus (CSS object-position)">
                <input
                  placeholder="center 18%"
                  value={g.imagePosition || ''}
                  onChange={(e) => {
                    const gatherings = [...draft.gatherings];
                    gatherings[i] = { ...g, imagePosition: e.target.value };
                    setDraft((d) => ({ ...d, gatherings }));
                  }}
                />
              </Field>
              <button
                className="admin-btn danger"
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    gatherings: d.gatherings.filter((_, idx) => idx !== i),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="admin-btn ghost"
            type="button"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                gatherings: [
                  ...(d.gatherings || []),
                  { year: '', name: '', theme: '', tag: 'GHP', image: '' },
                ],
              }))
            }
          >
            Add gathering card
          </button>
        </>
      )}

      {tab === 'reflections' && (
        <>
          <div className="admin-card admin-grid">
            <Field label="Section image (fills space under the intro)">
              <input
                value={draft.reflectionsImage || ''}
                onChange={(e) => setDraft((d) => ({ ...d, reflectionsImage: e.target.value }))}
                placeholder={DEFAULT_REFLECTIONS_IMAGE}
              />
            </Field>
            <MediaPicker
              onPick={(url) => setDraft((d) => ({ ...d, reflectionsImage: url }))}
            />
            {(draft.reflectionsImage || DEFAULT_REFLECTIONS_IMAGE) ? (
              <img
                className="admin-thumb"
                src={draft.reflectionsImage || DEFAULT_REFLECTIONS_IMAGE}
                alt=""
              />
            ) : null}
          </div>
          {(draft.reflections || []).map((r, i) => (
            <div className="admin-card admin-grid" key={i}>
              <Field label="Date / label">
                <input
                  value={r.date || ''}
                  onChange={(e) => {
                    const reflections = [...draft.reflections];
                    reflections[i] = { ...r, date: e.target.value };
                    setDraft((d) => ({ ...d, reflections }));
                  }}
                />
              </Field>
              <Field label="Title">
                <input
                  value={r.title || ''}
                  onChange={(e) => {
                    const reflections = [...draft.reflections];
                    reflections[i] = { ...r, title: e.target.value };
                    setDraft((d) => ({ ...d, reflections }));
                  }}
                />
              </Field>
              <Field label="Excerpt">
                <textarea
                  value={r.excerpt || ''}
                  onChange={(e) => {
                    const reflections = [...draft.reflections];
                    reflections[i] = { ...r, excerpt: e.target.value };
                    setDraft((d) => ({ ...d, reflections }));
                  }}
                />
              </Field>
              <button
                className="admin-btn danger"
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    reflections: d.reflections.filter((_, idx) => idx !== i),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="admin-btn ghost"
            type="button"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                reflections: [...(d.reflections || []), { date: '', title: '', excerpt: '' }],
              }))
            }
          >
            Add reflection teaser
          </button>
        </>
      )}

      {tab === 'blocks' && (
        <BlocksEditor
          blocks={draft.homeBlocks || []}
          onChange={(homeBlocks) => setDraft((d) => ({ ...d, homeBlocks }))}
        />
      )}
    </>
  );
}
