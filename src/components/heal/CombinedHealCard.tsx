import { UnitInput } from './UnitInput'
import { formatWithUnit } from '../../utils'
import type { CombinedHistoryEntry } from '../../types'

type CombinedHealCardProps = {
  combinedRegenPercent: string
  setCombinedRegenPercent: (v: string) => void
  combinedTotalHPInput: string
  setCombinedTotalHPInput: (v: string) => void
  combinedLifestealPercent: string
  setCombinedLifestealPercent: (v: string) => void
  combinedActualDamageInput: string
  setCombinedActualDamageInput: (v: string) => void
  combinedAttackSpeedPercent: string
  setCombinedAttackSpeedPercent: (v: string) => void
  combinedResult: number
  combinedRecoveryPercent: number | null
  combinedHistory: CombinedHistoryEntry[]
  saveCombined: () => void
}

export function CombinedHealCard({
  combinedRegenPercent,
  setCombinedRegenPercent,
  combinedTotalHPInput,
  setCombinedTotalHPInput,
  combinedLifestealPercent,
  setCombinedLifestealPercent,
  combinedActualDamageInput,
  setCombinedActualDamageInput,
  combinedAttackSpeedPercent,
  setCombinedAttackSpeedPercent,
  combinedResult,
  combinedRecoveryPercent,
  combinedHistory,
  saveCombined,
}: CombinedHealCardProps) {
  return (
    <div className="card heal-card">
      <h3>종합 회복량 계산</h3>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="combined-regen-percent">체력 재생 %</label>
          <input
            id="combined-regen-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 2.5"
            value={combinedRegenPercent}
            onChange={(e) => setCombinedRegenPercent(e.target.value)}
          />
        </div>
        <UnitInput
          id="combined-total-hp"
          label="총 체력"
          value={combinedTotalHPInput}
          onChange={setCombinedTotalHPInput}
        />
        <div className="field">
          <label htmlFor="combined-lifesteal-percent">생명력 흡수 %</label>
          <input
            id="combined-lifesteal-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 10"
            value={combinedLifestealPercent}
            onChange={(e) => setCombinedLifestealPercent(e.target.value)}
          />
        </div>
        <UnitInput
          id="combined-actual-damage"
          label="실제 피해"
          value={combinedActualDamageInput}
          onChange={setCombinedActualDamageInput}
        />
        <div className="field">
          <label htmlFor="combined-attack-speed-percent">공격 속도 %</label>
          <input
            id="combined-attack-speed-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 50"
            value={combinedAttackSpeedPercent}
            onChange={(e) => setCombinedAttackSpeedPercent(e.target.value)}
          />
        </div>
      </div>
      <div className="result-block">
        <p className="result-label">종합 초당 회복량 (체젠 + 생흡)</p>
        <p className="result-value">
          ❤️ {combinedResult.toFixed(2)}
          <span className="result-unit"> / 초</span>
          {combinedRecoveryPercent != null && (
            <span className="result-unit">
              {' '}
              (초당 회복 퍼센트 {combinedRecoveryPercent.toFixed(2)}%)
            </span>
          )}
        </p>
      </div>
      <div className="save-and-history">
        <button
          type="button"
          className="save-result-btn"
          onClick={saveCombined}
          disabled={combinedResult <= 0}
        >
          저장
        </button>
        {combinedHistory.length > 0 && (
          <div className="result-history">
            <p className="result-history-title">저장한 계산 기록 (최대 5개)</p>
            <ul className="result-history-list">
              {combinedHistory.map((entry, i) => (
                <li key={`${entry.result}-${entry.totalHP}-${i}`}>
                  체력 재생 <strong>{entry.regenPercent}%</strong>, 총 체력{' '}
                  <strong>{formatWithUnit(entry.totalHP)}</strong>, 생명력 흡수{' '}
                  <strong>{entry.lifestealPercent}%</strong>, 실제 피해{' '}
                  <strong>{formatWithUnit(entry.actualDamage)}</strong>, 공격
                  속도 <strong>{entry.attackSpeedPercent}%</strong> →{' '}
                  <strong>{entry.result.toFixed(2)}</strong> /초
                  {entry.totalHP > 0 && (
                    <span>
                      {' '}
                      (초당 회복 퍼센트{' '}
                      {((entry.result / entry.totalHP) * 100).toFixed(2)}%)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
