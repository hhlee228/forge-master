import { MAX_FORGE_LEVEL, TECH_LABELS } from '../../constants'

type LevelGridCardProps = {
  setTimerSelectedLevel: (fn: (prev: number) => number) => void
  setCostSelectedLevel: (fn: (prev: number) => number) => void
  levelFromGrid: (techIndex: number, stageNum: number) => number
  isInTimerRange: (techIndex: number, stageNum: number) => boolean
  isInCostRange: (techIndex: number, stageNum: number) => boolean
}

export function LevelGridCard({
  setTimerSelectedLevel,
  setCostSelectedLevel,
  levelFromGrid,
  isInTimerRange,
  isInCostRange,
}: LevelGridCardProps) {
  return (
    <div className="card level-grid-card">
      <h3>단계 선택 (클릭 시 1단계 ~ 해당 단계까지 선택)</h3>
      <p className="card-description">
        예: 테크 II 4단계 클릭 → 테크 I 1단계 ~ 테크 II 4단계까지 선택. 재련 타이머는 시간 4% 감소, 재련 업그레이드 비용은 2% 감소 적용.
      </p>
      <div className="level-grids">
        <div className="level-grid-block">
          <p className="level-grid-label">재련 타이머</p>
          <div className="level-grid" role="grid">
            {TECH_LABELS.map((tech, techIndex) => (
              <div key={tech} className="level-grid-row">
                <div className="level-grid-row-label">{tech}</div>
                <div className="level-grid-cells">
                  {[1, 2, 3, 4, 5].map((stageNum) => {
                    const level = levelFromGrid(techIndex, stageNum)
                    if (level > MAX_FORGE_LEVEL) return null
                    const selected = isInTimerRange(techIndex, stageNum)
                    return (
                      <button
                        key={stageNum}
                        type="button"
                        className={`level-grid-cell ${selected ? 'selected' : ''}`}
                        onClick={() =>
                          setTimerSelectedLevel((prev) => (prev === level ? 0 : level))
                        }
                        title={`${level}단계 (1~${level})`}
                      >
                        {stageNum}단계
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="level-grid-block">
          <p className="level-grid-label">재련 업그레이드 비용</p>
          <div className="level-grid" role="grid">
            {TECH_LABELS.map((tech, techIndex) => (
              <div key={tech} className="level-grid-row">
                <div className="level-grid-row-label">{tech}</div>
                <div className="level-grid-cells">
                  {[1, 2, 3, 4, 5].map((stageNum) => {
                    const level = levelFromGrid(techIndex, stageNum)
                    if (level > MAX_FORGE_LEVEL) return null
                    const selected = isInCostRange(techIndex, stageNum)
                    return (
                      <button
                        key={stageNum}
                        type="button"
                        className={`level-grid-cell ${selected ? 'selected' : ''}`}
                        onClick={() =>
                          setCostSelectedLevel((prev) => (prev === level ? 0 : level))
                        }
                        title={`${level}단계 (1~${level})`}
                      >
                        {stageNum}단계
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
