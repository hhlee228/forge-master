export function formatTimeDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0초'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}일`)
  if (h > 0) parts.push(`${h}시간`)
  if (m > 0) parts.push(`${m}분`)
  if (s > 0 || parts.length === 0) parts.push(`${s}초`)
  return parts.join(' ')
}

export function getTierClass(fromLevel: number): string {
  if (fromLevel <= 6) return 'tier-1'
  if (fromLevel <= 9) return 'tier-2'
  if (fromLevel <= 12) return 'tier-3'
  if (fromLevel <= 15) return 'tier-4'
  return 'tier-5'
}

export function safeNumber(value: string): number {
  if (!value.trim()) return 0
  const n = Number(value.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR')
}

const K = 1000
const M = 1_000_000
const B = 1_000_000_000

export function formatWithUnit(value: number): string {
  if (value >= B) return (value / B).toFixed(2) + 'b'
  if (value >= M) return (value / M).toFixed(2) + 'm'
  if (value >= K) return (value / K).toFixed(2) + 'k'
  return String(Math.round(value))
}
