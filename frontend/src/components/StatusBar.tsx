export default function StatusBar() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1">
      <span className="text-[15px] font-semibold tracking-tight text-gloss-dark">
        {timeStr}
      </span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#1c1c1e" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#1c1c1e" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#1c1c1e" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#1c1c1e" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" fill="#1c1c1e" transform="translate(0,-2)" />
          <path d="M5 9.5a4.2 4.2 0 016 0" stroke="#1c1c1e" strokeWidth="1.5" strokeLinecap="round" transform="translate(0,-2)" />
          <path d="M2.5 7a7.5 7.5 0 0111 0" stroke="#1c1c1e" strokeWidth="1.5" strokeLinecap="round" transform="translate(0,-2)" />
          <path d="M0.5 4.5a11 11 0 0115 0" stroke="#1c1c1e" strokeWidth="1.5" strokeLinecap="round" transform="translate(0,-2)" />
        </svg>
        {/* Battery */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#1c1c1e" strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="#1c1c1e" />
          <path d="M24 4v4a2 2 0 000-4z" fill="#1c1c1e" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
