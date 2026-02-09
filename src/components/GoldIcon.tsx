/** 골드 아이콘 (이모지 대신 SVG로 깨짐 방지) */
export function GoldIcon({ className = '' }: { className?: string }) {
  return (
    <span className={className} aria-hidden style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6" fill="#fbbf24" opacity="0.9" />
        <path d="M8 12h8M12 8v8" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
