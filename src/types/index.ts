export type TechRatios = {
  원시: number
  중세: number
  근대초기: number
  현대: number
  우주: number
  항성: number
  다중우주: number
  양자: number
  지하세계: number
  신성: number
}

export type ForgeUpgradeRow = {
  from: number
  to: number
  baseCost: number
  baseTimeSec: number
  tech: TechRatios
}

export type ForgeStepWithReduction = ForgeUpgradeRow & {
  cost: number
  timeSec: number
}

export type TabId = 'forge' | 'heal' | 'league'

export type RegenHistoryEntry = {
  regenPercent: number
  totalHP: number
  result: number
}

export type LifestealHistoryEntry = {
  lifestealPercent: number
  actualDamage: number
  attackSpeedPercent: number
  result: number
  totalHP: number
}

export type CombinedHistoryEntry = {
  regenPercent: number
  totalHP: number
  lifestealPercent: number
  actualDamage: number
  attackSpeedPercent: number
  result: number
}
