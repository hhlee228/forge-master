import { UnitInput } from './UnitInput'
import { formatWithUnit } from '../../utils'
import type { RegenHistoryEntry } from '../../types'

type RegenCardProps = {
  regenPercent: string
  setRegenPercent: (v: string) => void
  totalHPInput: string
  setTotalHPInput: (v: string) => void
  regenResult: number
  regenRecoveryPercent: number | null
  regenHistory: RegenHistoryEntry[]
  saveRegen: () => void
}

export function RegenCard({
  regenPercent,
  setRegenPercent,
  totalHPInput,
  setTotalHPInput,
  regenResult,
  regenRecoveryPercent,
  regenHistory,
  saveRegen,
}: RegenCardProps) {
  return (
    <div className="card heal-card">
      <h3>체젠 회복량 계산</h3>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="regen-percent">체력 재생 %</label>
          <input
            id="regen-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 2.5"
            value={regenPercent}
            onChange={(e) => setRegenPercent(e.target.value)}
          />
        </div>
        <UnitInput
          id="total-hp"
          label="총 체력"
          value={totalHPInput}
          onChange={setTotalHPInput}
        />
      </div>
      <div className="result-block">
        <p className="result-label">체젠 초당 회복량</p>
        <p className="result-value">
          ❤️ {regenResult.toFixed(2)}
          <span className="result-unit"> / 초</span>
          {regenRecoveryPercent != null && (
            <span className="result-unit">
              {' '}
              (초당 회복 퍼센트 {regenRecoveryPercent.toFixed(2)}%)
            </span>
          )}
        </p>
      </div>
      <div className="save-and-history">
        <button
          type="button"
          className="save-result-btn"
          onClick={saveRegen}
          disabled={regenResult <= 0}
        >
          저장
        </button>
        {regenHistory.length > 0 && (
          <div className="result-history">
            <p className="result-history-title">저장한 계산 기록 (최대 5개)</p>
            <ul className="result-history-list">
              {regenHistory.map((entry, i) => (
                <li key={`${entry.result}-${entry.totalHP}-${i}`}>
                  체력 재생 <strong>{entry.regenPercent}%</strong>, 총 체력{' '}
                  <strong>{formatWithUnit(entry.totalHP)}</strong> →{' '}
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
