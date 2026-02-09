import { useForgeCalculator } from '../../hooks/useForgeCalculator'
import { UpgradeTableCard } from './UpgradeTableCard'
import { LevelGridCard } from './LevelGridCard'
import { UpgradeRangeCard } from './UpgradeRangeCard'
import { HammerCard } from './HammerCard'

export function ForgeSection() {
  const forge = useForgeCalculator()

  return (
    <section id="forge" className="section" role="tabpanel">
      <header className="section-header">
        <h2>대장간 업그레이드 계산기</h2>
        <p>
          레벨별 업그레이드 비용·시간을 표로 확인하고, 단계를 클릭해 선택할 수
          있습니다.
          <br />
          단계마다 비용 2% 감소, 시간 4% 감소가 적용된 수치입니다.
        </p>
      </header>

      <UpgradeTableCard forgeStepsWithReduction={forge.forgeStepsWithReduction} />

      <LevelGridCard
        setTimerSelectedLevel={forge.setTimerSelectedLevel}
        setCostSelectedLevel={forge.setCostSelectedLevel}
        levelFromGrid={forge.levelFromGrid}
        isInTimerRange={forge.isInTimerRange}
        isInCostRange={forge.isInCostRange}
      />

      <div className="card-grid">
        <UpgradeRangeCard
          forgeCurrentLevel={forge.forgeCurrentLevel}
          setForgeCurrentLevel={forge.setForgeCurrentLevel}
          forgeTargetLevel={forge.forgeTargetLevel}
          setForgeTargetLevel={forge.setForgeTargetLevel}
          forgeCost={forge.forgeCost}
          forgeTimeTotalSec={forge.forgeTimeTotalSec}
          forgeStepsInRange={forge.forgeStepsInRange}
        />
        <HammerCard
          currentGold={forge.currentGold}
          setCurrentGold={forge.setCurrentGold}
          hammerTargetLevel={forge.hammerTargetLevel}
          setHammerTargetLevel={forge.setHammerTargetLevel}
          gearSellTier={forge.gearSellTier}
          setGearSellTier={forge.setGearSellTier}
          goldPerHammer={forge.goldPerHammer}
          hammerResult={forge.hammerResult}
        />
      </div>
    </section>
  )
}
