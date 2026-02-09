import { GoldIcon } from '../GoldIcon'
import { formatTimeDuration, formatWithUnit, getTierClass } from '../../utils'
import { TECH_KEYS } from '../../constants'
import type { ForgeStepWithReduction } from '../../types'

type UpgradeTableCardProps = {
  forgeStepsWithReduction: ForgeStepWithReduction[]
}

export function UpgradeTableCard({ forgeStepsWithReduction }: UpgradeTableCardProps) {
  return (
    <div className="card upgrade-table-card">
      <h3>업그레이드 정보 (전체)</h3>
      <p className="card-description">
        아래 재련 타이머 / 재련 업그레이드 비용에서 단계를 선택하면 해당 구간 행이 강조됩니다. 단계마다 비용 2% 감소, 시간 4% 감소 적용.
      </p>
      <div className="table-wrap">
        <table className="upgrade-table">
          <thead>
            <tr>
              <th>레벨</th>
              <th>총 비용</th>
              <th>시간</th>
              {TECH_KEYS.map((key) => (
                <th key={key} className={`tech-th tech-th-${key}`}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forgeStepsWithReduction.map((step) => (
              <tr key={step.from} className={getTierClass(step.from)}>
                <td>{step.from} → {step.to}</td>
                <td>
                  <GoldIcon className="cost-icon" />
                  {formatWithUnit(step.cost)}
                </td>
                <td>
                  <span className="time-icon" aria-hidden>🕐</span>
                  {formatTimeDuration(step.timeSec)}
                </td>
                {TECH_KEYS.map((key) => {
                  const val = step.tech[key]
                  const hasData = val > 0
                  return (
                    <td
                      key={key}
                      className={`tech-cell ${hasData ? `tech-cell-${key}` : ''}`}
                    >
                      {hasData ? `${Number(val).toFixed(2)}%` : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
