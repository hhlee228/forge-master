import { formatTimeDuration } from '../../utils'

export type ClanWarInnerTabId = 'summary' | 'forge' | 'mounts' | 'skills' | 'pets'

export type CalcMode = 'calculate' | 'target' | 'upgrade'

export function normalizeIntInput(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  return cleaned
}

// ===== 망치 점수 계산용 데이터 / 함수 =====

export const FORGE_EXP_VALUES: Record<string, number> = {
  primitive: 1,
  medieval: 1,
  earlyModern: 1,
  modern: 2,
  space: 2,
  interstellar: 2,
  multiverse: 3,
  quantum: 3,
  underworld: 3,
  divine: 3,
}

export const FORGE_TIER_DISPLAY: Record<string, string> = {
  primitive: '원시',
  medieval: '중세',
  earlyModern: '근대초기',
  modern: '현대',
  space: '우주',
  interstellar: '항성',
  multiverse: '다중우주',
  quantum: '양자',
  underworld: '지하세계',
  divine: '신성',
}

export const FORGE_PROBABILITIES: Record<number, Record<string, number>> = {
  1: { primitive: 100.0 },
  2: { primitive: 99.0, medieval: 1.0 },
  3: { primitive: 98.0, medieval: 2.0 },
  4: { primitive: 96.0, medieval: 4.0 },
  5: { primitive: 91.5, medieval: 8.0, earlyModern: 0.5 },
  6: { primitive: 82.0, medieval: 16.0, earlyModern: 2.0 },
  7: { primitive: 64.0, medieval: 32.0, earlyModern: 4.0 },
  8: { primitive: 27.8, medieval: 64.0, earlyModern: 8.0, modern: 0.2 },
  9: { primitive: 13.0, medieval: 70.0, earlyModern: 16.0, modern: 1.0 },
  10: { primitive: 6.0, medieval: 60.0, earlyModern: 32.0, modern: 2.0 },
  11: { medieval: 31.9, earlyModern: 64.0, modern: 4.0, space: 0.1 },
  12: { medieval: 27.5, earlyModern: 64.0, modern: 8.0, space: 0.5 },
  13: { medieval: 8.0, earlyModern: 75.0, modern: 16.0, space: 1.0 },
  14: { earlyModern: 66.0, modern: 32.0, space: 2.0, interstellar: 0.05 },
  15: { earlyModern: 31.7, modern: 64.0, space: 4.0, interstellar: 0.25 },
  16: { earlyModern: 21.5, modern: 70.0, space: 8.0, interstellar: 0.5 },
  17: { modern: 82.9, space: 16.0, interstellar: 1.0, multiverse: 0.05 },
  18: { modern: 65.7, space: 32.0, interstellar: 2.0, multiverse: 0.25 },
  19: { modern: 31.5, space: 64.0, interstellar: 4.0, multiverse: 0.5 },
  20: { space: 91.0, interstellar: 8.0, multiverse: 1.0, quantum: 0.05 },
  21: { space: 81.7, interstellar: 16.0, multiverse: 2.0, quantum: 0.25 },
  22: { space: 63.5, interstellar: 32.0, multiverse: 4.0, quantum: 0.5 },
  23: { space: 27.0, interstellar: 64.0, multiverse: 8.0, quantum: 1.0 },
  24: { interstellar: 82.0, multiverse: 16.0, quantum: 2.0, underworld: 0.01 },
  25: { interstellar: 64.0, multiverse: 32.0, quantum: 4.0, underworld: 0.05 },
  26: { interstellar: 43.8, multiverse: 50.0, quantum: 6.0, underworld: 0.25 },
  27: { interstellar: 31.5, multiverse: 60.0, quantum: 8.0, underworld: 0.5 },
  28: { interstellar: 21.0, multiverse: 65.0, quantum: 13.0, underworld: 1.0 },
  29: { interstellar: 7.0, multiverse: 68.0, quantum: 23.0, underworld: 2.0 },
  30: { multiverse: 60.0, quantum: 36.0, underworld: 4.0, divine: 0.01 },
  31: { multiverse: 50.9, quantum: 43.0, underworld: 6.0, divine: 0.05 },
  32: { multiverse: 41.7, quantum: 50.0, underworld: 8.0, divine: 0.25 },
  33: { multiverse: 28.5, quantum: 58.0, underworld: 13.0, divine: 0.5 },
  34: { multiverse: 12.0, quantum: 64.0, underworld: 23.0, divine: 1.0 },
  35: { quantum: 62.0, underworld: 36.0, divine: 2.0 },
}

export function calcForgePointsPerHammer(level: number): number {
  const probs = FORGE_PROBABILITIES[level]
  if (!probs) return 0
  let expected = 0
  for (const [tier, probability] of Object.entries(probs)) {
    const value = FORGE_EXP_VALUES[tier] ?? 0
    expected += (probability / 100) * value
  }
  return expected
}

// ===== 탈것 점수 계산용 데이터 / 함수 =====

export const MOUNT_WAR_POINTS: Record<string, number> = {
  common: 400,
  rare: 600,
  epic: 900,
  legendary: 1350,
  ultimate: 2000,
  mythic: 3000,
}

export const MOUNT_TIER_DISPLAY: Record<string, string> = {
  common: '일반',
  rare: '희귀',
  epic: '서사시',
  legendary: '전설',
  ultimate: '궁극',
  mythic: '신화',
}

export const MOUNT_SUMMON_RATES: Record<
  number,
  Partial<{
    needed: number | string
    common: number
    rare: number
    epic: number
    legendary: number
    ultimate: number
    mythic: number
  }>
> = {
  1: { needed: 2, common: 1.0 },
  2: { needed: 5, common: 0.995, rare: 0.005 },
  3: { needed: 8, common: 0.9931, rare: 0.0069 },
  4: { needed: 11, common: 0.9905, rare: 0.0095 },
  5: { needed: 14, common: 0.9869, rare: 0.0131 },
  6: { needed: 17, common: 0.9819, rare: 0.0181 },
  7: { needed: 20, common: 0.975, rare: 0.025 },
  8: { needed: 23, common: 0.9655, rare: 0.0345 },
  9: { needed: 26, common: 0.95, rare: 0.05 },
  10: { needed: 29, common: 0.929, rare: 0.07, epic: 0.001 },
  11: { needed: 32, common: 0.9002, rare: 0.098, epic: 0.0018 },
  12: { needed: 35, common: 0.8596, rare: 0.1372, epic: 0.0032 },
  13: { needed: 38, common: 0.8021, rare: 0.1921, epic: 0.0058 },
  14: { needed: 41, common: 0.7206, rare: 0.2689, epic: 0.0105 },
  15: { needed: 44, common: 0.6046, rare: 0.3765, epic: 0.0189 },
  16: { needed: 47, common: 0.4389, rare: 0.5271, epic: 0.034 },
  17: { needed: 50, common: 0.3511, rare: 0.5989, epic: 0.05 },
  18: { needed: 53, common: 0.2809, rare: 0.6481, epic: 0.07, legendary: 0.001 },
  19: { needed: 56, common: 0.2247, rare: 0.6755, epic: 0.098, legendary: 0.0018 },
  20: { needed: 59, common: 0.1798, rare: 0.6798, epic: 0.1372, legendary: 0.0032 },
  21: { needed: 62, common: 0.165, rare: 0.6371, epic: 0.1921, legendary: 0.0058 },
  22: { needed: 65, common: 0.165, rare: 0.5556, epic: 0.2689, legendary: 0.0105 },
  23: { needed: 68, common: 0.165, rare: 0.4396, epic: 0.3765, legendary: 0.0189 },
  24: { needed: 71, common: 0.165, rare: 0.2739, epic: 0.5271, legendary: 0.034 },
  25: { needed: 74, common: 0.165, rare: 0.165, epic: 0.62, legendary: 0.05 },
  26: {
    needed: 77,
    common: 0.165,
    rare: 0.165,
    epic: 0.599,
    legendary: 0.07,
    ultimate: 0.001,
  },
  27: {
    needed: 80,
    common: 0.165,
    rare: 0.165,
    epic: 0.5702,
    legendary: 0.098,
    ultimate: 0.0018,
  },
  28: {
    needed: 83,
    common: 0.165,
    rare: 0.165,
    epic: 0.5296,
    legendary: 0.1372,
    ultimate: 0.0032,
  },
  29: {
    needed: 86,
    common: 0.165,
    rare: 0.165,
    epic: 0.4721,
    legendary: 0.1921,
    ultimate: 0.0058,
  },
  30: {
    needed: 89,
    common: 0.165,
    rare: 0.165,
    epic: 0.3906,
    legendary: 0.2689,
    ultimate: 0.0105,
  },
  31: {
    needed: 92,
    common: 0.165,
    rare: 0.165,
    epic: 0.2746,
    legendary: 0.3765,
    ultimate: 0.0189,
  },
  32: {
    needed: 95,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.471,
    ultimate: 0.034,
  },
  33: {
    needed: 98,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.455,
    ultimate: 0.05,
  },
  34: {
    needed: 132,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.434,
    ultimate: 0.07,
    mythic: 0.001,
  },
  35: {
    needed: 166,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.4052,
    ultimate: 0.098,
    mythic: 0.0018,
  },
  36: {
    needed: 200,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.3646,
    ultimate: 0.1372,
    mythic: 0.0032,
  },
  37: {
    needed: 234,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.3071,
    ultimate: 0.1921,
    mythic: 0.0058,
  },
  38: {
    needed: 268,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.2256,
    ultimate: 0.2689,
    mythic: 0.0105,
  },
  39: {
    needed: 302,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.3211,
    mythic: 0.0189,
  },
  40: {
    needed: 336,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.306,
    mythic: 0.034,
  },
  41: {
    needed: 370,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.29,
    mythic: 0.05,
  },
  42: {
    needed: 404,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.283,
    mythic: 0.057,
  },
  43: {
    needed: 438,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.275,
    mythic: 0.065,
  },
  44: {
    needed: 472,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.2659,
    mythic: 0.0741,
  },
  45: {
    needed: 506,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.2556,
    mythic: 0.0844,
  },
  46: {
    needed: 540,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.2437,
    mythic: 0.0963,
  },
  47: {
    needed: 574,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.2303,
    mythic: 0.1097,
  },
  48: {
    needed: 608,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.2149,
    mythic: 0.1251,
  },
  49: {
    needed: 642,
    common: 0.165,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.1974,
    mythic: 0.1426,
  },
  50: {
    needed: 'MAX',
    common: 0.175,
    rare: 0.165,
    epic: 0.165,
    legendary: 0.165,
    ultimate: 0.165,
    mythic: 0.165,
  },
}

export function calcMountPointsPerSummon(level: number): number {
  const rates = MOUNT_SUMMON_RATES[level]
  if (!rates) return 0
  const tiers: Array<keyof typeof MOUNT_WAR_POINTS> = [
    'common',
    'rare',
    'epic',
    'legendary',
    'ultimate',
    'mythic',
  ]
  let expected = 0
  for (const tier of tiers) {
    const prob = rates[tier as keyof typeof rates]
    if (typeof prob === 'number' && prob > 0) {
      expected += prob * MOUNT_WAR_POINTS[tier]
    }
  }
  return expected
}

// ===== 스킬 점수 계산용 데이터 / 함수 =====

export const SKILL_WAR_POINTS: Record<string, number> = {
  common: 50,
  rare: 75,
  epic: 100,
  legendary: 125,
  ultimate: 150,
  mythic: 175,
}

export const SKILL_TIER_DISPLAY: Record<string, string> = {
  common: '일반',
  rare: '희귀',
  epic: '서사시',
  legendary: '전설',
  ultimate: '궁극',
  mythic: '신화',
}

// Ghost Town 던전 레벨 1~100 희귀도 비율 (백분율)
export const SKILL_RATES_DATA: Record<number, [number, number, number, number, number, number]> = {
  1: [100, 0, 0, 0, 0, 0],
  2: [100, 0, 0, 0, 0, 0],
  3: [100, 0, 0, 0, 0, 0],
  4: [89.95, 10, 0.05, 0, 0, 0],
  5: [88.54, 11.4, 0.06, 0, 0, 0],
  6: [86.93, 13, 0.07, 0, 0, 0],
  7: [85.1, 14.84, 0.08, 0, 0, 0],
  8: [83, 16.89, 0.11, 0, 0, 0],
  9: [80.61, 19.25, 0.14, 0, 0, 0],
  10: [77.88, 21.95, 0.17, 0, 0, 0],
  11: [74.76, 25.03, 0.21, 0, 0, 0],
  12: [71.21, 28.53, 0.26, 0, 0, 0],
  13: [67.14, 32.52, 0.34, 0, 0, 0],
  14: [62.51, 37.07, 0.42, 0, 0, 0],
  15: [57.21, 42.27, 0.52, 0, 0, 0],
  16: [51.17, 48.18, 0.65, 0, 0, 0],
  17: [44.26, 54.92, 0.82, 0, 0, 0],
  18: [36.36, 62.62, 1.02, 0, 0, 0],
  19: [27.34, 71.38, 1.28, 0, 0, 0],
  20: [17.5, 80.9, 1.6, 0, 0, 0],
  21: [17.5, 80.49, 2, 0.01, 0, 0],
  22: [17.5, 80.09, 2.4, 0.01, 0, 0],
  23: [17.5, 79.61, 2.87, 0.02, 0, 0],
  24: [17.5, 79.03, 3.45, 0.02, 0, 0],
  25: [17.5, 78.34, 4.13, 0.03, 0, 0],
  26: [17.5, 77.51, 4.95, 0.04, 0, 0],
  27: [17.5, 76.51, 5.59, 0.04, 0, 0],
  28: [17.5, 75.32, 7.13, 0.05, 0, 0],
  29: [17.5, 73.89, 8.54, 0.07, 0, 0],
  30: [17.5, 72.17, 10.24, 0.09, 0, 0],
  31: [17.5, 70.11, 12.28, 0.11, 0, 0],
  32: [17.5, 67.64, 14.73, 0.13, 0, 0],
  33: [17.5, 64.68, 17.65, 0.17, 0, 0],
  34: [17.5, 61.12, 21.17, 0.21, 0, 0],
  35: [17.5, 56.86, 25.38, 0.26, 0, 0],
  36: [17.5, 51.74, 30.43, 0.33, 0, 0],
  37: [17.5, 45.6, 36.49, 0.41, 0, 0],
  38: [17.5, 38.24, 43.75, 0.51, 0, 0],
  39: [17.5, 29.41, 52.45, 0.64, 0, 0],
  40: [17.5, 18.81, 62.89, 0.8, 0, 0],
  41: [17.5, 16.5, 65, 1.0, 0, 0],
  42: [17.5, 16.5, 64.78, 1.22, 0, 0],
  43: [17.5, 16.5, 64.51, 1.49, 0, 0],
  44: [17.5, 16.5, 64.17, 1.82, 0.01, 0],
  45: [17.5, 16.5, 63.76, 2.22, 0.02, 0],
  46: [17.5, 16.5, 63.27, 2.7, 0.03, 0],
  47: [17.5, 16.5, 62.66, 3.3, 0.04, 0],
  48: [17.5, 16.5, 61.92, 4.03, 0.05, 0],
  49: [17.5, 16.5, 61.02, 4.91, 0.07, 0],
  50: [17.5, 16.5, 59.93, 5.99, 0.08, 0],
  51: [17.5, 16.5, 58.59, 7.3, 0.11, 0],
  52: [17.5, 16.5, 56.95, 8.92, 0.13, 0],
  53: [17.5, 16.5, 54.96, 10.87, 0.17, 0],
  54: [17.5, 16.5, 52.53, 13.26, 0.21, 0],
  55: [17.5, 16.5, 49.56, 16.18, 0.26, 0],
  56: [17.5, 16.5, 45.93, 19.74, 0.33, 0],
  57: [17.5, 16.5, 41.5, 24.09, 0.41, 0],
  58: [17.5, 16.5, 36.1, 29.39, 0.51, 0],
  59: [17.5, 16.5, 29.51, 35.85, 0.64, 0],
  60: [17.5, 16.5, 21.46, 43.74, 0.8, 0],
  61: [17.5, 16.5, 16.5, 48.5, 1, 0],
  62: [17.5, 16.5, 16.5, 48.31, 1.19, 0],
  63: [17.5, 16.5, 16.5, 48.08, 1.42, 0],
  64: [17.5, 16.5, 16.5, 47.8, 1.69, 0.01],
  65: [17.5, 16.5, 16.5, 47.47, 2.01, 0.02],
  66: [17.5, 16.5, 16.5, 47.08, 2.39, 0.03],
  67: [17.5, 16.5, 16.5, 46.62, 2.84, 0.04],
  68: [17.5, 16.5, 16.5, 46.07, 3.38, 0.05],
  69: [17.5, 16.5, 16.5, 45.41, 4.02, 0.07],
  70: [17.5, 16.5, 16.5, 44.63, 4.79, 0.08],
  71: [17.5, 16.5, 16.5, 43.7, 5.69, 0.11],
  72: [17.5, 16.5, 16.5, 42.59, 6.78, 0.13],
  73: [17.5, 16.5, 16.5, 41.27, 8.06, 0.17],
  74: [17.5, 16.5, 16.5, 39.69, 9.6, 0.21],
  75: [17.5, 16.5, 16.5, 37.82, 11.42, 0.26],
  76: [17.5, 16.5, 16.5, 35.58, 13.59, 0.33],
  77: [17.5, 16.5, 16.5, 32.92, 16.17, 0.41],
  78: [17.5, 16.5, 16.5, 29.74, 19.25, 0.51],
  79: [17.5, 16.5, 16.5, 25.96, 22.9, 0.64],
  80: [17.5, 16.5, 16.5, 21.46, 27.25, 0.8],
  81: [17.5, 16.5, 16.5, 16.5, 32, 1],
  82: [17.5, 16.5, 16.5, 16.5, 31.84, 1.16],
  83: [17.5, 16.5, 16.5, 16.5, 31.65, 1.35],
  84: [17.5, 16.5, 16.5, 16.5, 31.44, 1.56],
  85: [17.5, 16.5, 16.5, 16.5, 31.19, 1.81],
  86: [17.5, 16.5, 16.5, 16.5, 30.9, 2.1],
  87: [17.5, 16.5, 16.5, 16.5, 30.56, 2.44],
  88: [17.5, 16.5, 16.5, 16.5, 30.17, 2.83],
  89: [17.5, 16.5, 16.5, 16.5, 29.72, 3.28],
  90: [17.5, 16.5, 16.5, 16.5, 29.2, 3.8],
  91: [17.5, 16.5, 16.5, 16.5, 28.59, 4.41],
  92: [17.5, 16.5, 16.5, 16.5, 27.88, 5.12],
  93: [17.5, 16.5, 16.5, 16.5, 27.06, 5.94],
  94: [17.5, 16.5, 16.5, 16.5, 26.11, 6.89],
  95: [17.5, 16.5, 16.5, 16.5, 25.01, 7.99],
  96: [17.5, 16.5, 16.5, 16.5, 23.73, 9.27],
  97: [17.5, 16.5, 16.5, 16.5, 22.25, 10.75],
  98: [17.5, 16.5, 16.5, 16.5, 20.53, 12.47],
  99: [17.5, 16.5, 16.5, 16.5, 18.54, 14.46],
  100: [17.5, 16.5, 16.5, 16.5, 16.5, 16.5],
}

export function getSkillRates(level: number) {
  const clamped = Math.max(1, Math.min(100, level))
  const rates = SKILL_RATES_DATA[clamped]
  const [c, r, e, l, u, m] = rates
  return {
    common: c / 100,
    rare: r / 100,
    epic: e / 100,
    legendary: l / 100,
    ultimate: u / 100,
    mythic: m / 100,
  }
}

export function calcSkillPointsPerItem(level: number): number {
  const rates = getSkillRates(level)
  const tiers: Array<keyof typeof SKILL_WAR_POINTS> = [
    'common',
    'rare',
    'epic',
    'legendary',
    'ultimate',
    'mythic',
  ]
  let expected = 0
  for (const tier of tiers) {
    const prob = rates[tier as keyof typeof rates]
    if (prob && prob > 0) {
      expected += prob * SKILL_WAR_POINTS[tier]
    }
  }
  return expected
}

// ===== 펫 / 스킬 업그레이드 공통 타입 =====

export type EggRarityKey = 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate' | 'mythic'

export const EGG_RARITIES: EggRarityKey[] = [
  'common',
  'rare',
  'epic',
  'legendary',
  'ultimate',
  'mythic',
]

export const EGG_CONFIGS: Record<
  EggRarityKey,
  { label: string; baseSeconds: number; hatchScore: number; mergeScore: number }
> = {
  common: {
    label: '일반 알',
    baseSeconds: 30 * 60,
    hatchScore: 250,
    mergeScore: 50,
  },
  rare: {
    label: '희귀 알',
    baseSeconds: 2 * 60 * 60,
    hatchScore: 1000,
    mergeScore: 200,
  },
  epic: {
    label: '서사시 알',
    baseSeconds: 4 * 60 * 60,
    hatchScore: 2000,
    mergeScore: 400,
  },
  legendary: {
    label: '전설 알',
    baseSeconds: 8 * 60 * 60,
    hatchScore: 4000,
    mergeScore: 800,
  },
  ultimate: {
    label: '궁극 알',
    baseSeconds: 16 * 60 * 60,
    hatchScore: 8000,
    mergeScore: 1600,
  },
  mythic: {
    label: '신화 알',
    baseSeconds: 32 * 60 * 60,
    hatchScore: 16000,
    mergeScore: 3200,
  },
}

export function formatTotalHatchTime(totalSeconds: number): string {
  return formatTimeDuration(totalSeconds)
}

export type SkillUpgradeKey =
  | 'common_shout'
  | 'common_arrow'
  | 'common_meat'
  | 'rare_shuriken'
  | 'rare_cannon'
  | 'rare_berserker'
  | 'epic_thorn'
  | 'epic_arrowRain'
  | 'epic_buff'
  | 'legend_meteor'
  | 'legend_bomb'
  | 'legend_morale'
  | 'ultimate_rush'
  | 'ultimate_bug'
  | 'ultimate_lightning'
  | 'mythic_minigun'
  | 'mythic_drone'
  | 'mythic_highMorale'

export type SkillUpgradeConfig = {
  key: SkillUpgradeKey
  label: string
  rarity: keyof typeof SKILL_WAR_POINTS
}

export const SKILL_UPGRADE_CONFIGS: SkillUpgradeConfig[] = [
  { key: 'common_shout', label: '외침', rarity: 'common' },
  { key: 'common_arrow', label: '화살', rarity: 'common' },
  { key: 'common_meat', label: '고기', rarity: 'common' },
  { key: 'rare_shuriken', label: '수리검', rarity: 'rare' },
  { key: 'rare_cannon', label: '포격', rarity: 'rare' },
  { key: 'rare_berserker', label: '광전사', rarity: 'rare' },
  { key: 'epic_thorn', label: '가시', rarity: 'epic' },
  { key: 'epic_arrowRain', label: '화살비', rarity: 'epic' },
  { key: 'epic_buff', label: '버프', rarity: 'epic' },
  { key: 'legend_meteor', label: '운석', rarity: 'legendary' },
  { key: 'legend_bomb', label: '폭탄', rarity: 'legendary' },
  { key: 'legend_morale', label: '사기', rarity: 'legendary' },
  { key: 'ultimate_rush', label: '쇄도', rarity: 'ultimate' },
  { key: 'ultimate_bug', label: '벌레', rarity: 'ultimate' },
  { key: 'ultimate_lightning', label: '번개', rarity: 'ultimate' },
  { key: 'mythic_minigun', label: '기총 소사', rarity: 'mythic' },
  { key: 'mythic_drone', label: '드론', rarity: 'mythic' },
  { key: 'mythic_highMorale', label: '높은 사기', rarity: 'mythic' },
]

export function getSkillUpgradeCostForNextLevel(currentLevel: number): number {
  const lvl = currentLevel
  if (lvl <= 0) return 2
  if (lvl === 1) return 2
  if (lvl === 2) return 3
  if (lvl === 3) return 3
  if (lvl === 4) return 4
  if (lvl === 5) return 4
  if (lvl === 6) return 5
  if (lvl === 7) return 5
  if (lvl === 8) return 6
  if (lvl === 9) return 6
  if (lvl === 10) return 7
  if (lvl === 11) return 7
  if (lvl === 12) return 8
  if (lvl === 13) return 8
  if (lvl === 14) return 9
  if (lvl === 15) return 9
  if (lvl === 16) return 10
  if (lvl === 17) return 11
  if (lvl >= 18) return 12
  return 12
}

