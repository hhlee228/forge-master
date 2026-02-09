import { safeNumber } from '../../utils'
import { MIN_FORGE_LEVEL, MAX_FORGE_LEVEL } from '../../constants'

type HammerCardProps = {
  currentGold: string
  setCurrentGold: (v: string) => void
  hammerTargetLevel: number
  setHammerTargetLevel: (n: number) => void
  gearSellTier: number
  setGearSellTier: (n: number) => void
  goldPerHammer: number
  hammerResult: { neededGold: number; hammers: number }
}

export function HammerCard({
  currentGold,
  setCurrentGold,
  hammerTargetLevel,
  setHammerTargetLevel,
  gearSellTier,
  setGearSellTier,
  goldPerHammer,
  hammerResult,
}: HammerCardProps) {
  return (
    <div className="card">
      <h3>망치 소모량 추정</h3>
      <p className="card-description">
        망치 1개당 50골드 기준, 장비 판매 금액 단계별 2%씩 추가됩니다.
        <br />
        목표 대장간 레벨까지 필요한 총 비용에 맞춰 필요한 망치 개수를 계산합니다.
      </p>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="current-gold">현재 보유 골드</label>
          <div className="input-with-buttons">
            <input
              id="current-gold"
              type="text"
              inputMode="decimal"
              placeholder="예: 12,000"
              value={currentGold}
              onChange={(e) => setCurrentGold(e.target.value)}
            />
            <button
              type="button"
              className="unit-btn"
              onClick={() => {
                const n = safeNumber(currentGold) * 1000
                setCurrentGold(String(Math.round(n)))
              }}
            >
              k 단위 변경
            </button>
            <button
              type="button"
              className="unit-btn"
              onClick={() => {
                const n = safeNumber(currentGold) * 1_000_000
                setCurrentGold(String(Math.round(n)))
              }}
            >
              m 단위 변경
            </button>
          </div>
          <span className="field-hint">
            숫자 입력 후 k/m 단위 변경 시 1000배, 100만 배 적용됩니다.
          </span>
        </div>

        <div className="field">
          <label htmlFor="hammer-target-level">목표 대장간 레벨</label>
          <input
            id="hammer-target-level"
            type="number"
            min={MIN_FORGE_LEVEL}
            max={MAX_FORGE_LEVEL}
            value={hammerTargetLevel}
            onChange={(e) =>
              setHammerTargetLevel(
                Math.min(
                  MAX_FORGE_LEVEL,
                  Math.max(
                    MIN_FORGE_LEVEL,
                    Number(e.target.value) || MIN_FORGE_LEVEL,
                  ),
                ),
              )
            }
          />
          <span className="field-hint">
            현재 레벨 ~ {MAX_FORGE_LEVEL} 사이로 입력하세요.
          </span>
        </div>

        <div className="field">
          <label htmlFor="gear-sell-tier">장비 판매 금액 단계</label>
          <input
            id="gear-sell-tier"
            type="number"
            min={1}
            value={gearSellTier}
            onChange={(e) =>
              setGearSellTier(Math.max(1, Number(e.target.value) || 1))
            }
          />
          <span className="field-hint">
            1단계 = 50골드+2%, 2단계 = +4%, … (단계당 2% 추가)
          </span>
        </div>
      </div>

      <div className="result-block">
        <p className="result-value hammer-result-sentence">
          망치 1개당 <strong>{Math.round(goldPerHammer)}</strong>골드 기준,
          필요한 망치는{' '}
          <span className="hammer-result-nowrap">
            <strong>{hammerResult.hammers.toLocaleString('ko-KR')}</strong>개
          </span>
          입니다.
        </p>
        <p className="result-note">
          ※ 오프라인 골드, 무료 제작 기회 반영되지 않은 단순 계산입니다. 실제
          소모량은 이보다 적을 수 있습니다.
        </p>
      </div>
    </div>
  )
}
