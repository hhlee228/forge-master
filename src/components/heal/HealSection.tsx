import { useHealCalculator } from '../../hooks/useHealCalculator'
import { RegenCard } from './RegenCard'
import { LifestealCard } from './LifestealCard'
import { CombinedHealCard } from './CombinedHealCard'

export function HealSection() {
  const heal = useHealCalculator()

  return (
    <section id="heal" className="section" role="tabpanel">
      <header className="section-header">
        <h2>초당 회복력 계산기</h2>
        <p>
          체력 재생(체젠)과 생명력 흡수(생흡) 수치를 입력하면,
          <br />
          초당 총 회복량을 간단하게 합산해 보여줍니다.
        </p>
      </header>

      <div className="heal-sections">
        <RegenCard
          regenPercent={heal.regen.regenPercent}
          setRegenPercent={heal.regen.setRegenPercent}
          totalHPInput={heal.regen.totalHPInput}
          setTotalHPInput={heal.regen.setTotalHPInput}
          regenResult={heal.regen.regenResult}
          regenRecoveryPercent={heal.regen.regenRecoveryPercent}
          regenHistory={heal.regen.regenHistory}
          saveRegen={heal.regen.saveRegen}
        />
        <LifestealCard
          lifestealPercent={heal.lifesteal.lifestealPercent}
          setLifestealPercent={heal.lifesteal.setLifestealPercent}
          actualDamageInput={heal.lifesteal.actualDamageInput}
          setActualDamageInput={heal.lifesteal.setActualDamageInput}
          attackSpeedPercent={heal.lifesteal.attackSpeedPercent}
          setAttackSpeedPercent={heal.lifesteal.setAttackSpeedPercent}
          lifestealTotalHPInput={heal.lifesteal.lifestealTotalHPInput}
          setLifestealTotalHPInput={heal.lifesteal.setLifestealTotalHPInput}
          lifestealResult={heal.lifesteal.lifestealResult}
          lifestealRecoveryPercent={heal.lifesteal.lifestealRecoveryPercent}
          lifestealHistory={heal.lifesteal.lifestealHistory}
          saveLifesteal={heal.lifesteal.saveLifesteal}
        />
        <CombinedHealCard
          combinedRegenPercent={heal.combined.combinedRegenPercent}
          setCombinedRegenPercent={heal.combined.setCombinedRegenPercent}
          combinedTotalHPInput={heal.combined.combinedTotalHPInput}
          setCombinedTotalHPInput={heal.combined.setCombinedTotalHPInput}
          combinedLifestealPercent={heal.combined.combinedLifestealPercent}
          setCombinedLifestealPercent={heal.combined.setCombinedLifestealPercent}
          combinedActualDamageInput={heal.combined.combinedActualDamageInput}
          setCombinedActualDamageInput={heal.combined.setCombinedActualDamageInput}
          combinedAttackSpeedPercent={heal.combined.combinedAttackSpeedPercent}
          setCombinedAttackSpeedPercent={heal.combined.setCombinedAttackSpeedPercent}
          combinedResult={heal.combined.combinedResult}
          combinedRecoveryPercent={heal.combined.combinedRecoveryPercent}
          combinedHistory={heal.combined.combinedHistory}
          saveCombined={heal.combined.saveCombined}
        />
        <p className="result-note">
          ※ 실제 게임 계산 공식이랑 다를 수 있습니다.
        </p>
      </div>
    </section>
  )
}
