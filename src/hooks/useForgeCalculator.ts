import { useMemo, useState } from 'react'
import {
  FORGE_UPGRADE_ROWS,
  COST_REDUCTION_PER_STEP,
  TIME_REDUCTION_PER_STEP,
  MAX_FORGE_LEVEL,
  MIN_FORGE_LEVEL,
  STAGES_PER_TECH,
} from '../constants'
import type { ForgeStepWithReduction } from '../types'

export function useForgeCalculator() {
  const [forgeCurrentLevel, setForgeCurrentLevel] = useState(1)
  const [forgeTargetLevel, setForgeTargetLevel] = useState(10)
  const [timerSelectedLevel, setTimerSelectedLevel] = useState(5)
  const [costSelectedLevel, setCostSelectedLevel] = useState(10)
  const [currentGold, setCurrentGold] = useState('')
  const [hammerTargetLevel, setHammerTargetLevel] = useState(10)
  const [gearSellTier, setGearSellTier] = useState(1)

  const forgeStepsWithReduction = useMemo((): ForgeStepWithReduction[] => {
    const timerFactor = Math.pow(TIME_REDUCTION_PER_STEP, timerSelectedLevel)
    const costFactor = Math.pow(COST_REDUCTION_PER_STEP, costSelectedLevel)
    return FORGE_UPGRADE_ROWS.map((row) => ({
      ...row,
      cost: row.baseCost * costFactor,
      timeSec: row.baseTimeSec * timerFactor,
    }))
  }, [timerSelectedLevel, costSelectedLevel])

  const forgeCost = useMemo(() => {
    if (forgeTargetLevel <= forgeCurrentLevel) return 0
    return forgeStepsWithReduction
      .filter((step) => step.from >= forgeCurrentLevel && step.to <= forgeTargetLevel)
      .reduce((sum, step) => sum + step.cost, 0)
  }, [forgeCurrentLevel, forgeTargetLevel, forgeStepsWithReduction])

  const forgeStepsInRange = useMemo(
    () =>
      forgeStepsWithReduction.filter(
        (step) => step.from >= forgeCurrentLevel && step.to <= forgeTargetLevel,
      ),
    [forgeCurrentLevel, forgeTargetLevel, forgeStepsWithReduction],
  )

  const forgeTimeTotalSec = useMemo(
    () => forgeStepsInRange.reduce((sum, step) => sum + step.timeSec, 0),
    [forgeStepsInRange],
  )

  const timerTotalTimeSec = useMemo(() => {
    return forgeStepsWithReduction
      .filter((step) => step.to <= timerSelectedLevel)
      .reduce((sum, step) => sum + step.timeSec, 0)
  }, [timerSelectedLevel, forgeStepsWithReduction])

  const costTotalGold = useMemo(() => {
    return forgeStepsWithReduction
      .filter((step) => step.to <= costSelectedLevel)
      .reduce((sum, step) => sum + step.cost, 0)
  }, [costSelectedLevel, forgeStepsWithReduction])

  function levelFromGrid(techIndex: number, stageNum: number): number {
    return techIndex * STAGES_PER_TECH + stageNum
  }

  function isInTimerRange(techIndex: number, stageNum: number): boolean {
    return levelFromGrid(techIndex, stageNum) <= timerSelectedLevel
  }

  function isInCostRange(techIndex: number, stageNum: number): boolean {
    return levelFromGrid(techIndex, stageNum) <= costSelectedLevel
  }

  const costForHammer = useMemo(() => {
    if (hammerTargetLevel <= forgeCurrentLevel) return 0
    const step = forgeStepsWithReduction.find((s) => s.to === hammerTargetLevel)
    return step ? step.cost : 0
  }, [forgeCurrentLevel, hammerTargetLevel, forgeStepsWithReduction])

  const goldPerHammer = useMemo(
    () => 50 * (1 + 0.02 * Math.max(gearSellTier, 1)),
    [gearSellTier],
  )

  const hammerResult = useMemo(() => {
    const safeGold = (v: string) => {
      if (!v.trim()) return 0
      const n = Number(v.replace(/,/g, ''))
      return Number.isFinite(n) ? n : 0
    }
    const neededGold = Math.max(costForHammer - safeGold(currentGold), 0)
    if (neededGold <= 0 || goldPerHammer <= 0) return { neededGold, hammers: 0 }
    return { neededGold, hammers: Math.ceil(neededGold / goldPerHammer) }
  }, [costForHammer, currentGold, goldPerHammer])

  return {
    // state
    forgeCurrentLevel,
    setForgeCurrentLevel,
    forgeTargetLevel,
    setForgeTargetLevel,
    timerSelectedLevel,
    setTimerSelectedLevel,
    costSelectedLevel,
    setCostSelectedLevel,
    currentGold,
    setCurrentGold,
    hammerTargetLevel,
    setHammerTargetLevel,
    gearSellTier,
    setGearSellTier,
    // computed
    forgeStepsWithReduction,
    forgeCost,
    forgeStepsInRange,
    forgeTimeTotalSec,
    timerTotalTimeSec,
    costTotalGold,
    levelFromGrid,
    isInTimerRange,
    isInCostRange,
    costForHammer,
    goldPerHammer,
    hammerResult,
    // constants
    MIN_FORGE_LEVEL,
    MAX_FORGE_LEVEL,
  }
}
