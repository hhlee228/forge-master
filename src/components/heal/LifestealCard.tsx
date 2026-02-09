import { UnitInput } from './UnitInput'
import { formatWithUnit } from '../../utils'
import type { LifestealHistoryEntry } from '../../types'

type LifestealCardProps = {
  lifestealPercent: string
  setLifestealPercent: (v: string) => void
  actualDamageInput: string
  setActualDamageInput: (v: string) => void
  attackSpeedPercent: string
  setAttackSpeedPercent: (v: string) => void
  lifestealTotalHPInput: string
  setLifestealTotalHPInput: (v: string) => void
  lifestealResult: number
  lifestealRecoveryPercent: number | null
  lifestealHistory: LifestealHistoryEntry[]
  saveLifesteal: () => void
}

export function LifestealCard({
  lifestealPercent,
  setLifestealPercent,
  actualDamageInput,
  setActualDamageInput,
  attackSpeedPercent,
  setAttackSpeedPercent,
  lifestealTotalHPInput,
  setLifestealTotalHPInput,
  lifestealResult,
  lifestealRecoveryPercent,
  lifestealHistory,
  saveLifesteal,
}: LifestealCardProps) {
  return (
    <div className="card heal-card">
      <h3>생흡 회복량 계산</h3>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="lifesteal-percent">생명력 흡수 %</label>
          <input
            id="lifesteal-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 10"
            value={lifestealPercent}
            onChange={(e) => setLifestealPercent(e.target.value)}
          />
        </div>
        <UnitInput
          id="actual-damage"
          label="실제 피해"
          value={actualDamageInput}
          onChange={setActualDamageInput}
        />
        <div className="field">
          <label htmlFor="attack-speed-percent">공격 속도 %</label>
          <input
            id="attack-speed-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 50"
            value={attackSpeedPercent}
            onChange={(e) => setAttackSpeedPercent(e.target.value)}
          />
        </div>
        <UnitInput
          id="lifesteal-total-hp"
          label="총 체력 (선택 입력)"
          value={lifestealTotalHPInput}
          onChange={setLifestealTotalHPInput}
        />
      </div>
      <div className="result-block">
        <p className="result-label">생흡 초당 회복량</p>
        <p className="result-value">
          ❤️ {lifestealResult.toFixed(2)}
          <span className="result-unit"> / 초</span>
          {lifestealRecoveryPercent != null && (
            <span className="result-unit">
              {' '}
              (초당 회복 퍼센트 {lifestealRecoveryPercent.toFixed(2)}%)
            </span>
          )}
        </p>
      </div>
      <div className="save-and-history">
        <button
          type="button"
          className="save-result-btn"
          onClick={saveLifesteal}
          disabled={lifestealResult <= 0}
        >
          저장
        </button>
        {lifestealHistory.length > 0 && (
          <div className="result-history">
            <p className="result-history-title">저장한 계산 기록 (최대 5개)</p>
            <ul className="result-history-list">
              {lifestealHistory.map((entry, i) => (
                <li key={`${entry.result}-${entry.actualDamage}-${i}`}>
                  생명력 흡수 <strong>{entry.lifestealPercent}%</strong>, 실제
                  피해 <strong>{formatWithUnit(entry.actualDamage)}</strong>,
                  공격 속도 <strong>{entry.attackSpeedPercent}%</strong> →{' '}
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
