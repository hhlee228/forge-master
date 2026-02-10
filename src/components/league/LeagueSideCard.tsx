import type { LeagueSideState, LeagueSkillInput } from '../../hooks/useLeagueSimulator'
import { LEAGUE_SKILLS } from '../../hooks/useLeagueSimulator'
import { UnitInput } from '../heal/UnitInput'

type LeagueSideCardProps = {
  sideLabel: string
  state: LeagueSideState
  onFieldChange: (field: keyof LeagueSideState, value: string) => void
  onSkillChange: (index: number, patch: Partial<LeagueSkillInput>) => void
}

export function LeagueSideCard({
  sideLabel,
  state,
  onFieldChange,
  onSkillChange,
}: LeagueSideCardProps) {
  return (
    <div className="card">
      <h3>{sideLabel}</h3>
      <p className="card-description">
        총 피해/체력과 추가 옵션, 장착 스킬을 입력하면 전투 결과를 대략적으로
        시뮬레이션합니다.
      </p>

      <div className="field">
        <label>무기 타입</label>
        <div className="input-with-buttons">
          <label>
            <input
              type="radio"
              name={`${sideLabel}-weapon-type`}
              value="melee"
              checked={state.weaponType === 'melee'}
              onChange={() => onFieldChange('weaponType', 'melee')}
            />{' '}
            근거리 무기
          </label>
          <label>
            <input
              type="radio"
              name={`${sideLabel}-weapon-type`}
              value="range"
              checked={state.weaponType === 'range'}
              onChange={() => onFieldChange('weaponType', 'range')}
            />{' '}
            원거리 무기
          </label>
        </div>
      </div>

      <div className="field-grid">
        <UnitInput
          id={`${sideLabel}-total-damage`}
          label="총 피해"
          value={state.totalDamageInput}
          onChange={(v) => onFieldChange('totalDamageInput', v)}
        />
        <UnitInput
          id={`${sideLabel}-total-hp`}
          label="총 체력"
          value={state.totalHPInput}
          onChange={(v) => onFieldChange('totalHPInput', v)}
        />
      </div>

      <div className="field-grid">
        <div className="field">
          <label>치명타 확률 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 30"
            value={state.critChancePercentInput}
            onChange={(e) =>
              onFieldChange('critChancePercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>치명타 피해 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 100"
            value={state.critDamagePercentInput}
            onChange={(e) =>
              onFieldChange('critDamagePercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>블록 확률 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 20"
            value={state.blockChancePercentInput}
            onChange={(e) =>
              onFieldChange('blockChancePercentInput', e.target.value)
            }
          />
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>체력 재생 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 2.5"
            value={state.regenPercentInput}
            onChange={(e) =>
              onFieldChange('regenPercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>체력 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 50"
            value={state.maxHPPercentInput}
            onChange={(e) =>
              onFieldChange('maxHPPercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>생명력 흡수 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 5"
            value={state.lifestealPercentInput}
            onChange={(e) =>
              onFieldChange('lifestealPercentInput', e.target.value)
            }
          />
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>더블 찬스 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 20"
            value={state.doubleChancePercentInput}
            onChange={(e) =>
              onFieldChange('doubleChancePercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>피해 % (공통)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 50"
            value={state.damagePercentInput}
            onChange={(e) =>
              onFieldChange('damagePercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>근접 피해 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 30"
            value={state.meleeDamagePercentInput}
            onChange={(e) =>
              onFieldChange('meleeDamagePercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>원거리 피해 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 30"
            value={state.rangeDamagePercentInput}
            onChange={(e) =>
              onFieldChange('rangeDamagePercentInput', e.target.value)
            }
          />
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>공격 속도 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 20"
            value={state.attackSpeedPercentInput}
            onChange={(e) =>
              onFieldChange('attackSpeedPercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>스킬 피해 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 40"
            value={state.skillDamagePercentInput}
            onChange={(e) =>
              onFieldChange('skillDamagePercentInput', e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>스킬 재사용 대기시간 %</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="예: 30"
            value={state.skillCooldownPercentInput}
            onChange={(e) =>
              onFieldChange('skillCooldownPercentInput', e.target.value)
            }
          />
        </div>
      </div>

      <div className="field">
        <label>장착 스킬 (최대 3개)</label>
      </div>

      {state.skills.map((skill, index) => {
        const def = LEAGUE_SKILLS.find((s) => s.id === skill.skillId)
        const isBuff = def?.kind === 'buff'

        return (
          <div className="field-grid" key={index}>
            <div className="field">
              <label>스킬 {index + 1}</label>
              <select
                value={skill.skillId}
                onChange={(e) =>
                  onSkillChange(index, {
                    skillId: e.target.value as LeagueSkillInput['skillId'],
                  })
                }
              >
                <option value="">선택 안 함</option>
                {LEAGUE_SKILLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.grade}] {s.name} ({s.description})
                  </option>
                ))}
              </select>
            </div>
            {!isBuff && (
              <div className="field">
                <UnitInput
                  id={`${sideLabel}-skill-${index}-power`}
                  label="스킬 피해/회복량 (1회 발동 기준)"
                  value={skill.powerInput}
                  onChange={(v) =>
                    onSkillChange(index, { powerInput: v })
                  }
                />
              </div>
            )}
            {isBuff && (
              <>
                <div className="field">
                  <label>버프 피해 증가 (고정 수치)</label>
                  <UnitInput
                    id={`${sideLabel}-skill-${index}-buff-dmg`}
                    label="버프 피해 증가 (고정 수치)"
                    value={skill.buffDamageFlatInput}
                    onChange={(v) =>
                      onSkillChange(index, {
                        buffDamageFlatInput: v,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>버프 체력 증가 (고정 수치)</label>
                  <UnitInput
                    id={`${sideLabel}-skill-${index}-buff-hp`}
                    label="버프 체력 증가 (고정 수치)"
                    value={skill.buffHpFlatInput}
                    onChange={(v) =>
                      onSkillChange(index, {
                        buffHpFlatInput: v,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

