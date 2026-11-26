import { useState } from 'react';

export function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|v=)([\w-]{11})/,
  );
  return m?.[1] || '';
}

/** Thumbnail poster that mounts the YouTube iframe only after click / keyboard activation. */
export default function YouTubeEmbed({ url, id: idProp, title }) {
  const id = idProp || youtubeId(url);
  const [active, setActive] = useState(false);

  if (!id) return null;

  if (active) {
    return (
      <div className="uniq-video__frame">
        <iframe
          title={title || 'YouTube video'}
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  const label = title ? `Play video: ${title}` : 'Play video';

  return (
    <div className="uniq-video__frame">
      <button
        type="button"
        className="uniq-video__poster"
        onClick={() => setActive(true)}
        aria-label={label}
      >
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="uniq-video__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M8.5 6.8v10.4L18 12 8.5 6.8z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
