/** Caixote, o robô de papelão que guia a Oficina do Atlas. */
export default function Caixote({ size = 72, acenando = true }: { size?: number; acenando?: boolean }) {
  return (
    <svg width={size} height={size * 196 / 210} viewBox="0 0 210 196" aria-hidden="true" className="caixote">
      <line x1="104" y1="30" x2="104" y2="12" stroke="#1d2433" strokeWidth="5" strokeLinecap="round" />
      <circle cx="104" cy="12" r="9" fill="#d9622b" stroke="#1d2433" strokeWidth="3.5" />
      <rect x="64" y="30" width="80" height="58" rx="6" fill="#d2ae7e" stroke="#1d2433" strokeWidth="5" />
      <circle cx="88" cy="58" r="12" fill="#fff" stroke="#1d2433" strokeWidth="3.5" />
      <circle cx="120" cy="58" r="12" fill="#fff" stroke="#1d2433" strokeWidth="3.5" />
      <circle cx="90" cy="60" r="5" fill="#1d2433" />
      <circle cx="122" cy="60" r="5" fill="#1d2433" />
      <path d="M94 76 Q104 82 114 76" fill="none" stroke="#1d2433" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="54" y="94" width="100" height="78" rx="6" fill="#c9a272" stroke="#1d2433" strokeWidth="5" />
      <rect x="54" y="122" width="100" height="14" fill="#e9d7a6" stroke="#1d2433" strokeWidth="3.5" />
      <circle cx="80" cy="154" r="6" fill="#2f7d4f" stroke="#1d2433" strokeWidth="3" />
      <circle cx="100" cy="154" r="6" fill="#f2b33d" stroke="#1d2433" strokeWidth="3" />
      <circle cx="120" cy="154" r="6" fill="#d9622b" stroke="#1d2433" strokeWidth="3" />
      <rect x="22" y="104" width="34" height="14" rx="4" fill="#d2ae7e" stroke="#1d2433" strokeWidth="4" transform="rotate(30 56 110)" />
      {acenando
        ? <rect x="150" y="80" width="48" height="14" rx="4" fill="#d2ae7e" stroke="#1d2433" strokeWidth="4" transform="rotate(-40 154 104)" />
        : <rect x="154" y="104" width="34" height="14" rx="4" fill="#d2ae7e" stroke="#1d2433" strokeWidth="4" transform="rotate(-30 154 110)" />}
      <circle cx="154" cy="104" r="4" fill="#9aa3b5" stroke="#1d2433" strokeWidth="2" />
      <circle cx="56" cy="110" r="4" fill="#9aa3b5" stroke="#1d2433" strokeWidth="2" />
      <rect x="72" y="170" width="18" height="12" rx="3" fill="#1d2433" />
      <rect x="118" y="170" width="18" height="12" rx="3" fill="#1d2433" />
    </svg>
  );
}
