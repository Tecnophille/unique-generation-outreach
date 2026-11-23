export default function BootScreen({ label = 'Loading Unique Generation Outreach' }) {
  return (
    <div className="boot-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="boot-screen__mark">
        <img
          className="boot-screen__logo"
          src="/logo-icon.png?v=3"
          alt=""
          width={88}
          height={88}
          decoding="async"
        />
        <span className="visually-hidden">{label}</span>
      </div>
    </div>
  );
}
