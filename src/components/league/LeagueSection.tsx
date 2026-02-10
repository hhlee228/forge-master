import { useLeagueSimulator } from '../../hooks/useLeagueSimulator'
import { LeagueSideCard } from './LeagueSideCard'
import { formatNumber } from '../../utils'

export function LeagueSection() {
  const league = useLeagueSimulator()

  return (
    <section id="league" className="section" role="tabpanel">
      <header className="section-header">
        <h2>리그전 시뮬레이션</h2>
        <p>
          리그전 PVP에서 내 조합과 상대 조합을 입력하면, 누가 먼저 쓰러질지
          간단히 시뮬레이션해 줍니다.
          <br />
          실제 게임 공식과 100% 일치하지 않을 수 있으며, 대략적인 비교용
          도구입니다.
        </p>
      </header>

      <div className="card-grid">
        <LeagueSideCard
          sideLabel="내 조합"
          state={league.me}
          onFieldChange={(field, value) =>
            league.updateField('me', field, value)
          }
          onSkillChange={(index, patch) =>
            league.updateSkill('me', index, patch)
          }
        />
        <LeagueSideCard
          sideLabel="상대 조합"
          state={league.enemy}
          onFieldChange={(field, value) =>
            league.updateField('enemy', field, value)
          }
          onSkillChange={(index, patch) =>
            league.updateSkill('enemy', index, patch)
          }
        />
      </div>

      <div className="card league-result-card">
        <h3>시뮬레이션 결과</h3>
        <p className="card-description">
          입력한 수치 기준으로, 초당 피해/회복량과 예상 처치 시간을 계산합니다.
        </p>

        <div className="league-vs-grid">
          <div>
            <h4>내 조합</h4>
            <ul className="league-metrics">
              <li>
                <span>총 체력 (버프 포함)</span>
                <strong>{formatNumber(Math.round(league.result.me.maxHP))}</strong>
              </li>
              <li>
                <span>기본 DPS</span>
                <strong>{formatNumber(Math.round(league.result.me.baseDps))}</strong>
              </li>
              <li>
                <span>스킬 DPS</span>
                <strong>
                  {formatNumber(Math.round(league.result.me.skillDamageDps))}
                </strong>
              </li>
              <li>
                <span>총 DPS (블록 적용 전)</span>
                <strong>
                  {formatNumber(
                    Math.round(league.result.me.totalDpsWithoutBlock),
                  )}
                </strong>
              </li>
              <li>
                <span>초당 회복량 (재생+생흡+스킬)</span>
                <strong>{formatNumber(Math.round(league.result.me.totalHps))}</strong>
              </li>
            </ul>
          </div>
          <div>
            <h4>상대 조합</h4>
            <ul className="league-metrics">
              <li>
                <span>총 체력 (버프 포함)</span>
                <strong>
                  {formatNumber(Math.round(league.result.enemy.maxHP))}
                </strong>
              </li>
              <li>
                <span>기본 DPS</span>
                <strong>
                  {formatNumber(Math.round(league.result.enemy.baseDps))}
                </strong>
              </li>
              <li>
                <span>스킬 DPS</span>
                <strong>
                  {formatNumber(Math.round(league.result.enemy.skillDamageDps))}
                </strong>
              </li>
              <li>
                <span>총 DPS (블록 적용 전)</span>
                <strong>
                  {formatNumber(
                    Math.round(league.result.enemy.totalDpsWithoutBlock),
                  )}
                </strong>
              </li>
              <li>
                <span>초당 회복량 (재생+생흡+스킬)</span>
                <strong>
                  {formatNumber(Math.round(league.result.enemy.totalHps))}
                </strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="league-summary">
          <p className="league-winner">{league.result.winnerLabel}</p>
          {league.result.summary && (
            <p className="league-times">{league.result.summary}</p>
          )}
          <p className="result-note">
            ※ 스킬 피해%는 데미지 스킬에만, 스킬 재사용 대기시간%는 쿨감(양수 입력 시
            더 자주 사용)으로 적용됩니다. 회복 스킬은 1회 발동 시 총 회복량을, 버프
            스킬은 체력/피해 증가%를 입력해 주세요.
          </p>
        </div>
      </div>
    </section>
  )
}

