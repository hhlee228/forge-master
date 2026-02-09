import { GoldIcon } from '../GoldIcon'
import { formatTimeDuration, formatWithUnit } from '../../utils'
import { MIN_FORGE_LEVEL, MAX_FORGE_LEVEL } from '../../constants'
import type { ForgeStepWithReduction } from '../../types'

type UpgradeRangeCardProps = {
  forgeCurrentLevel: number
  setForgeCurrentLevel: (n: number) => void
  forgeTargetLevel: number
  setForgeTargetLevel: (n: number) => void
  forgeCost: number
  forgeTimeTotalSec: number
  forgeStepsInRange: ForgeStepWithReduction[]
}

export function UpgradeRangeCard({
  forgeCurrentLevel,
  setForgeCurrentLevel,
  forgeTargetLevel,
  setForgeTargetLevel,
  forgeCost,
  forgeTimeTotalSec,
  forgeStepsInRange,
}: UpgradeRangeCardProps) {
  return (
    <div className="card">
      <h3>업그레이드 범위 설정 계산</h3>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="forge-current">현재 대장간 레벨</label>
          <select
            id="forge-current"
            value={forgeCurrentLevel}
            onChange={(e) => setForgeCurrentLevel(Number(e.target.value))}
          >
            {Array.from(
              { length: MAX_FORGE_LEVEL - MIN_FORGE_LEVEL },
              (_, i) => MIN_FORGE_LEVEL + i,
            ).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}단계
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="forge-target">목표 대장간 레벨</label>
          <select
            id="forge-target"
            value={forgeTargetLevel}
            onChange={(e) => setForgeTargetLevel(Number(e.target.value))}
          >
            {Array.from(
              { length: MAX_FORGE_LEVEL - MIN_FORGE_LEVEL },
              (_, i) => MIN_FORGE_LEVEL + i + 1,
            ).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}단계
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-block">
        <p className="result-label">목표까지 필요한 총 업그레이드 비용</p>
        <p className="result-value">
          <GoldIcon className="cost-icon" />
          {formatWithUnit(forgeCost)}
          <span className="result-unit"> 골드</span>
        </p>
        <p className="result-label">목표까지 필요한 총 소요 시간</p>
        <p className="result-value">
          <span className="time-icon" aria-hidden>🕐</span>
          {formatTimeDuration(forgeTimeTotalSec)}
        </p>
      </div>

      <div className="step-list">
        <p className="step-list-title">구간별 업그레이드 상세</p>
        <ul>
          {forgeStepsInRange.map((step) => (
            <li key={step.from} className="step-list-item">
              <span>
                {step.from} ➜ {step.to}단계
              </span>
              <span>
                <GoldIcon className="cost-icon" /> {formatWithUnit(step.cost)}
              </span>
              <span className="step-time">
                🕐 {formatTimeDuration(step.timeSec)}
              </span>
            </li>
          ))}
          {forgeStepsInRange.length === 0 && (
            <li className="step-list-item muted">
              현재 레벨과 목표 레벨이 같거나 낮습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
