import { useState, useEffect } from 'react'
import { safeNumber, formatWithUnit, formatTimeDuration } from '../../utils'
import {
  type ClanWarInnerTabId,
  type CalcMode,
  FORGE_PROBABILITIES,
  FORGE_TIER_DISPLAY,
  FORGE_EXP_VALUES,
  calcForgePointsPerHammer,
  MOUNT_WAR_POINTS,
  MOUNT_TIER_DISPLAY,
  MOUNT_SUMMON_RATES,
  normalizeIntInput,
} from './config'

function calcMountPointsPerSummon(level: number): number {
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

const SKILL_WAR_POINTS: Record<string, number> = {
  common: 50,
  rare: 75,
  epic: 100,
  legendary: 125,
  ultimate: 150,
  mythic: 175,
}

const SKILL_TIER_DISPLAY: Record<string, string> = {
  common: '일반',
  rare: '희귀',
  epic: '서사시',
  legendary: '전설',
  ultimate: '궁극',
  mythic: '신화',
}

type SkillUpgradeKey =
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

type SkillUpgradeConfig = {
  key: SkillUpgradeKey
  label: string
  rarity: keyof typeof SKILL_WAR_POINTS
}

const SKILL_UPGRADE_CONFIGS: SkillUpgradeConfig[] = [
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

function getSkillUpgradeCostForNextLevel(currentLevel: number): number {
  // 현재 레벨 → 다음 레벨로 올리기 위해 필요한 개수
  // 1레벨 2개, 2렙 3개, 3렙 3개, ..., 18렙 12개, 이후 고정 12개
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

// Ghost Town 던전 레벨 1~100 희귀도 비율 (백분율)
const SKILL_RATES_DATA: Record<number, [number, number, number, number, number, number]> = {
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

function getSkillRates(level: number) {
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

function calcSkillPointsPerItem(level: number): number {
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

export function ClanWarSection() {
  const [activeTab, setActiveTab] = useState<ClanWarInnerTabId>('summary')
  const [summary, setSummary] = useState({
    forge: 0,
    mounts: 0,
    skills: 0,
    petHatch: 0,
    petMerge: 0,
  })

  return (
    <section id="clanwar" className="section" role="tabpanel">
      <header className="section-header">
        <h2>클랜전 점수 계산기</h2>
        <p>
          클랜전에서 획득 가능한 점수를 계산합니다.
          <br />
          종합 계산기, 망치 / 탈것 / 스킬 / 펫 점수 계산기를 한 곳에서 확인해 보세요.
        </p>
      </header>

      <nav className="nav nav-tabs" aria-label="클랜전 점수 계산기 탭">
        <button
          type="button"
          className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          종합 계산기
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'forge' ? 'active' : ''}`}
          onClick={() => setActiveTab('forge')}
        >
          망치 점수 계산기
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'mounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('mounts')}
        >
          탈것 점수 계산기
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          스킬 점수 계산기
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => setActiveTab('pets')}
        >
          펫 점수 계산기
        </button>
      </nav>

      {activeTab === 'summary' && (
        <ClanWarSummaryTab
          forgePoints={summary.forge}
          mountPoints={summary.mounts}
          skillPoints={summary.skills}
          petHatchPoints={summary.petHatch}
          petMergePoints={summary.petMerge}
        />
      )}
      {activeTab === 'forge' && (
        <ForgePointsTab
          onSummaryChange={(points) =>
            setSummary((prev) => ({ ...prev, forge: points }))
          }
        />
      )}
      {activeTab === 'mounts' && (
        <MountPointsTab
          onSummaryChange={(points) =>
            setSummary((prev) => ({ ...prev, mounts: points }))
          }
        />
      )}
      {activeTab === 'skills' && (
        <SkillPointsTab
          onSummaryChange={(points) =>
            setSummary((prev) => ({ ...prev, skills: points }))
          }
        />
      )}
      {activeTab === 'pets' && (
        <PetPointsTab
          onSummaryChange={(hatch, merge) =>
            setSummary((prev) => ({ ...prev, petHatch: hatch, petMerge: merge }))
          }
        />
      )}
    </section>
  )
}

function SkillUpgradeSection() {
  const [levels, setLevels] = useState<Record<SkillUpgradeKey, string>>(
    Object.fromEntries(SKILL_UPGRADE_CONFIGS.map((c) => [c.key, ''])) as Record<
      SkillUpgradeKey,
      string
    >,
  )
  const [counts, setCounts] = useState<Record<SkillUpgradeKey, string>>(
    Object.fromEntries(SKILL_UPGRADE_CONFIGS.map((c) => [c.key, ''])) as Record<
      SkillUpgradeKey,
      string
    >,
  )

  const results = SKILL_UPGRADE_CONFIGS.map((cfg) => {
    const level = safeNumber(levels[cfg.key])
    const copies = safeNumber(counts[cfg.key])
    let curLevel = Math.max(0, level)
    let remaining = copies
    let gained = 0
    const perUpgrade = SKILL_WAR_POINTS[cfg.rarity]

    while (remaining > 0) {
      const cost = getSkillUpgradeCostForNextLevel(curLevel)
      if (cost <= 0 || remaining < cost) break
      remaining -= cost
      curLevel += 1
      gained += perUpgrade
    }

    return {
      key: cfg.key,
      rarity: cfg.rarity,
      label: cfg.label,
      level,
      copies,
      gained,
    }
  })

  const totalByRarity: Record<string, number> = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    ultimate: 0,
    mythic: 0,
  }
  results.forEach((r) => {
    totalByRarity[r.rarity] += r.gained
  })
  const total = Object.values(totalByRarity).reduce((s, v) => s + v, 0)

  const groups: Array<{ title: string; rarity: keyof typeof SKILL_WAR_POINTS; keys: SkillUpgradeKey[] }> =
    [
      {
        title: '일반 스킬 (외침 / 화살 / 고기)',
        rarity: 'common',
        keys: ['common_shout', 'common_arrow', 'common_meat'],
      },
      {
        title: '희귀 스킬 (수리검 / 포격 / 광전사)',
        rarity: 'rare',
        keys: ['rare_shuriken', 'rare_cannon', 'rare_berserker'],
      },
      {
        title: '서사시 스킬 (가시 / 화살비 / 버프)',
        rarity: 'epic',
        keys: ['epic_thorn', 'epic_arrowRain', 'epic_buff'],
      },
      {
        title: '전설 스킬 (운석 / 폭탄 / 사기)',
        rarity: 'legendary',
        keys: ['legend_meteor', 'legend_bomb', 'legend_morale'],
      },
      {
        title: '궁극 스킬 (쇄도 / 벌레 / 번개)',
        rarity: 'ultimate',
        keys: ['ultimate_rush', 'ultimate_bug', 'ultimate_lightning'],
      },
      {
        title: '신화 스킬 (기총 소사 / 드론 / 높은 사기)',
        rarity: 'mythic',
        keys: ['mythic_minigun', 'mythic_drone', 'mythic_highMorale'],
      },
    ]

  return (
    <>
      <p className="card-description">
        각 스킬의 현재 레벨과 보유 개수를 입력하면, 가능한 만큼 레벨업했을 때 얻는{' '}
        <strong>총 전쟁 점수</strong>를 계산합니다.
        <br />
        레벨업당 필요 개수는 1레벨 2개, 2렙 3개, …, 18렙 이상은 12개로 고정입니다.
      </p>

      <div className="field-grid">
        {groups.map((group) => (
          <div key={group.title} className="field">
            <label>{group.title}</label>
            <div className="result-history">
              <ul className="result-history-list">
                {group.keys.map((key) => {
                  const cfg = SKILL_UPGRADE_CONFIGS.find((c) => c.key === key)!
                  const res = results.find((r) => r.key === key)!
                  return (
                    <li key={key}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ minWidth: '4rem' }}>{cfg.label}</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="레벨"
                          value={levels[key]}
                          onChange={(e) =>
                            setLevels((prev) => ({
                              ...prev,
                              [key]: normalizeIntInput(e.target.value),
                            }))
                          }
                          style={{ width: '4.5rem' }}
                        />
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="보유 개수"
                          value={counts[key]}
                          onChange={(e) =>
                            setCounts((prev) => ({
                              ...prev,
                              [key]: normalizeIntInput(e.target.value),
                            }))
                          }
                          style={{ width: '6rem' }}
                        />
                        <span className="result-unit">
                          {' '}
                          → 예상 점수 {formatWithUnit(res.gained)}점
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="result-history">
        <p className="result-history-title">희귀도별 업그레이드 점수 합계</p>
        <ul className="result-history-list">
          <li>
            일반: <strong>{formatWithUnit(totalByRarity.common)}</strong>점
          </li>
          <li>
            희귀: <strong>{formatWithUnit(totalByRarity.rare)}</strong>점
          </li>
          <li>
            서사시: <strong>{formatWithUnit(totalByRarity.epic)}</strong>점
          </li>
          <li>
            전설: <strong>{formatWithUnit(totalByRarity.legendary)}</strong>점
          </li>
          <li>
            궁극: <strong>{formatWithUnit(totalByRarity.ultimate)}</strong>점
          </li>
          <li>
            신화: <strong>{formatWithUnit(totalByRarity.mythic)}</strong>점
          </li>
        </ul>
      </div>

      <div className="result-block">
        <p className="result-label">스킬 업그레이드로 얻는 총 전쟁 점수</p>
        <p className="result-value">
          📈 {formatWithUnit(total)}
          <span className="result-unit"> 점</span>
        </p>
      </div>
      <p className="result-note">
        ※ 스킬 업그레이드는 합치기가 아니라 레벨업으로만 전쟁 점수가 증가합니다.
      </p>
    </>
  )
}

type ClanWarSummaryProps = {
  forgePoints: number
  mountPoints: number
  skillPoints: number
  petHatchPoints: number
  petMergePoints: number
}

function ClanWarSummaryTab({
  forgePoints,
  mountPoints,
  skillPoints,
  petHatchPoints,
  petMergePoints,
}: ClanWarSummaryProps) {
  const total = forgePoints + mountPoints + skillPoints + petHatchPoints

  return (
    <div className="card">
      <h3>종합 클랜전 점수 계산기</h3>
      <p className="card-description">
        각 탭에서 계산한 예상 점수를 합산해, 총 예상 클랜전 점수를 보여줍니다.
      </p>

      <div className="league-vs-grid">
        <div>
          <h4>개별 점수 요약</h4>
          <ul className="league-metrics">
            <li>
              <span>망치 점수 (망치 수 기준)</span>
              <strong>{formatWithUnit(forgePoints)}</strong>
            </li>
            <li>
              <span>탈것 점수 (태엽 수 기준)</span>
              <strong>{formatWithUnit(mountPoints)}</strong>
            </li>
            <li>
              <span>스킬 점수 (티켓 수 기준)</span>
              <strong>{formatWithUnit(skillPoints)}</strong>
            </li>
            <li>
              <span>펫 점수 (부화 기준)</span>
              <strong>{formatWithUnit(petHatchPoints)}</strong>
              {petMergePoints > 0 && (
                <span className="result-unit">
                  {' '}
                  (합치기 시 {formatWithUnit(petMergePoints)}점)
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="result-block">
        <p className="result-label">총 예상 클랜전 점수</p>
        <p className="result-value">
          ⚔️ {formatWithUnit(total)}
          <span className="result-unit"> 점</span>
        </p>
      </div>
      <p className="result-note">
        ※ 실제 게임 점수 공식과 100% 일치하지 않을 수 있습니다.
      </p>
    </div>
  )
}

type SimpleSummaryCallback = (points: number) => void

function ForgePointsTab({ onSummaryChange }: { onSummaryChange?: SimpleSummaryCallback }) {
  const [mode, setMode] = useState<CalcMode>('calculate')
  const [level, setLevel] = useState(1)
  const [freePercent, setFreePercent] = useState('0')
  const [hammerCount, setHammerCount] = useState('0')
  const [targetPoints, setTargetPoints] = useState('0')

  const safeFreePercent = Math.max(0, Math.min(99.9, Number(freePercent) || 0))
  const freeMultiplier = 1 / (1 - safeFreePercent / 100)
  const pointsPerHammer = calcForgePointsPerHammer(level)

  let expectedPoints = 0
  let recommendedHammers = 0
  let expectedWithRecommended = 0
  let attemptsForBreakdown = 0

  if (pointsPerHammer > 0) {
    if (mode === 'calculate') {
      const hammers = safeNumber(hammerCount)
      const effectiveHammers = hammers * freeMultiplier
      attemptsForBreakdown = effectiveHammers
      expectedPoints = pointsPerHammer * effectiveHammers
    } else {
      const target = safeNumber(targetPoints)
      const neededEffectiveHammers = target / pointsPerHammer
      const actualHammers = Math.ceil(neededEffectiveHammers / freeMultiplier)
      recommendedHammers = actualHammers
      expectedWithRecommended = pointsPerHammer * neededEffectiveHammers
      attemptsForBreakdown = neededEffectiveHammers
    }
  }

  const forgeProbs =
    FORGE_PROBABILITIES[level] != null
      ? (Object.entries(FORGE_PROBABILITIES[level]) as Array<[string, number]>)
      : []

  useEffect(() => {
    if (!onSummaryChange) return
    const value = mode === 'calculate' ? expectedPoints : 0
    onSummaryChange(value)
  }, [onSummaryChange, mode, expectedPoints])
  const sortedForgeProbs = forgeProbs.sort((a, b) => b[1] - a[1])

  return (
    <div className="card">
      <h3>망치 점수 계산기</h3>
      <p className="card-description">
        포지 레벨, 무료 강화 확률, 망치 개수를 기준으로{' '}
        <strong>예상 전쟁 점수</strong>를 계산합니다.
      </p>

      <div className="nav" style={{ marginBottom: '0.75rem' }}>
        <button
          type="button"
          className={`nav-link ${mode === 'calculate' ? 'active' : ''}`}
          onClick={() => setMode('calculate')}
        >
          망치 수 기준 계산
        </button>
        <button
          type="button"
          className={`nav-link ${mode === 'target' ? 'active' : ''}`}
          onClick={() => setMode('target')}
        >
          목표 점수 기준 계산
        </button>
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="forge-level">대장간 레벨</label>
          <select
            id="forge-level"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value) || 1)}
          >
            {Array.from({ length: 35 }, (_, i) => i + 1).map((lv) => (
              <option key={lv} value={lv}>
                레벨 {lv}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="forge-free-percent">무료 장비 획득 확률 (%)</label>
          <input
            id="forge-free-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 10"
            value={freePercent}
            onChange={(e) => setFreePercent(e.target.value)}
          />
        </div>
        {mode === 'calculate' ? (
          <div className="field">
            <label htmlFor="forge-hammers">사용할 망치 수</label>
            <input
              id="forge-hammers"
              type="text"
              inputMode="decimal"
              placeholder="예: 100"
              value={hammerCount}
              onChange={(e) => setHammerCount(e.target.value)}
            />
          </div>
        ) : (
          <div className="field">
            <label htmlFor="forge-target-points">목표 전쟁 점수</label>
            <input
              id="forge-target-points"
              type="text"
              inputMode="decimal"
              placeholder="예: 50000"
              value={targetPoints}
              onChange={(e) => setTargetPoints(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="result-block">
        <p className="result-label">망치 1개당 예상 점수</p>
        <p className="result-value">
          🔨 {pointsPerHammer.toFixed(4)}
          <span className="result-unit"> 점</span>
        </p>
      </div>

      {mode === 'calculate' ? (
        <div className="result-block">
          <p className="result-label">예상 전쟁 점수</p>
          <p className="result-value">
            ⚔️ {formatWithUnit(expectedPoints)}
            <span className="result-unit"> 점</span>
          </p>
        </div>
      ) : (
        <div className="result-block">
          <p className="result-label">필요 망치 수 / 예상 점수</p>
          <p className="result-value">
            🔨 {formatWithUnit(recommendedHammers)}개 필요
            <span className="result-unit">
              {' '}
              · 예상 점수 {formatWithUnit(expectedWithRecommended)} 점
            </span>
          </p>
        </div>
      )}
      {sortedForgeProbs.length > 0 && (
        <div className="result-history">
          <p className="result-history-title">티어별 기대 결과 (어떤 장비를 얼마나 뽑는지)</p>
          <ul className="result-history-list">
            {sortedForgeProbs.map(([tierKey, prob]) => {
              const tierName = FORGE_TIER_DISPLAY[tierKey] ?? tierKey
              const tierPoint = FORGE_EXP_VALUES[tierKey] ?? 0
              const expectedCount =
                attemptsForBreakdown > 0 ? attemptsForBreakdown * (prob / 100) : 0
              const expectedTierPoints = expectedCount * tierPoint

              return (
                <li key={tierKey}>
                  <strong>
                    {tierName} ({tierPoint}점)
                  </strong>{' '}
                  – 확률 {prob.toFixed(2)}%
                  {attemptsForBreakdown > 0 && (
                    <>
                      {' · '}기대 횟수 ~{formatWithUnit(expectedCount)}
                      {' · '}기대 점수 ~{formatWithUnit(expectedTierPoints)}점
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <p className="result-note">
        ※ 실제 게임 공식과 다를 수 있으며, 평균적인 기대값 기준입니다.
      </p>
    </div>
  )
}

function MountPointsTab({ onSummaryChange }: { onSummaryChange?: SimpleSummaryCallback }) {
  const [mode, setMode] = useState<CalcMode>('calculate')
  const [level, setLevel] = useState(1)
  const [freePercent, setFreePercent] = useState('0')
  const [winders, setWinders] = useState('0')
  const [costPerMount, setCostPerMount] = useState('50')
  const [targetPoints, setTargetPoints] = useState('0')

  const safeFreePercent = Math.max(0, Math.min(99.9, Number(freePercent) || 0))
  const freeMultiplier = 1 / (1 - safeFreePercent / 100)
  const pointsPerMount = calcMountPointsPerSummon(level)
  const cost = safeNumber(costPerMount) || 50

  let expectedPoints = 0
  let expectedMounts = 0
  let mountsNeeded = 0
  let windersNeeded = 0
   let attemptsForBreakdown = 0

  if (pointsPerMount > 0 && cost > 0) {
    if (mode === 'calculate') {
      const windersValue = safeNumber(winders)
      const effectiveWinders = windersValue * freeMultiplier
      expectedMounts = Math.floor(effectiveWinders / cost)
      expectedPoints = expectedMounts * pointsPerMount
    } else {
      const target = safeNumber(targetPoints)
      mountsNeeded = Math.ceil(target / pointsPerMount)
      const totalWinders = mountsNeeded * cost
      windersNeeded = Math.ceil(totalWinders / freeMultiplier)
    }
  }

  attemptsForBreakdown = mode === 'calculate' ? expectedMounts : mountsNeeded

  const ratesForUi = MOUNT_SUMMON_RATES[level]
  const mountTiersForUi: Array<keyof typeof MOUNT_WAR_POINTS> = [
    'common',
    'rare',
    'epic',
    'legendary',
    'ultimate',
    'mythic',
  ]
  const sortedMountRates =
    ratesForUi != null
      ? mountTiersForUi
          .map((tier) => {
            const prob = ratesForUi[tier as keyof typeof ratesForUi]
            return [tier, typeof prob === 'number' ? prob : 0] as const
          })
          .filter(([, prob]) => prob > 0)
      : []

  useEffect(() => {
    if (!onSummaryChange) return
    const value = mode === 'calculate' ? expectedPoints : 0
    onSummaryChange(value)
  }, [onSummaryChange, mode, expectedPoints])

  return (
    <div className="card">
      <h3>탈것 점수 계산기</h3>
      <p className="card-description">
        탈것 레벨, 무료 소환 확률, 태엽 수를 기준으로{' '}
        <strong>예상 전쟁 점수</strong>를 계산합니다.
      </p>

      <div className="nav" style={{ marginBottom: '0.75rem' }}>
        <button
          type="button"
          className={`nav-link ${mode === 'calculate' ? 'active' : ''}`}
          onClick={() => setMode('calculate')}
        >
          태엽 수 기준 계산
        </button>
        <button
          type="button"
          className={`nav-link ${mode === 'target' ? 'active' : ''}`}
          onClick={() => setMode('target')}
        >
          목표 점수 기준 계산
        </button>
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="mount-level">탈것 레벨 (1~50)</label>
          <select
            id="mount-level"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value) || 1)}
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map((lv) => (
              <option key={lv} value={lv}>
                레벨 {lv}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mount-free-percent">무료 소환 확률 (%)</label>
          <input
            id="mount-free-percent"
            type="text"
            inputMode="decimal"
            placeholder="예: 10"
            value={freePercent}
            onChange={(e) => setFreePercent(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="mount-cost-per">탈것 1회 소환 비용 (태엽)</label>
          <input
            id="mount-cost-per"
            type="text"
            inputMode="decimal"
            placeholder="기본값: 50"
            value={costPerMount}
            onChange={(e) => setCostPerMount(e.target.value)}
          />
        </div>
        {mode === 'calculate' ? (
          <div className="field">
            <label htmlFor="mount-winders">보유 태엽 수</label>
            <input
              id="mount-winders"
              type="text"
              inputMode="decimal"
              placeholder="예: 500"
              value={winders}
              onChange={(e) => setWinders(e.target.value)}
            />
          </div>
        ) : (
          <div className="field">
            <label htmlFor="mount-target-points">목표 전쟁 점수</label>
            <input
              id="mount-target-points"
              type="text"
              inputMode="decimal"
              placeholder="예: 30000"
              value={targetPoints}
              onChange={(e) => setTargetPoints(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="result-block">
        <p className="result-label">탈것 1회 소환당 예상 점수</p>
        <p className="result-value">
          🐴 {pointsPerMount.toFixed(2)}
          <span className="result-unit"> 점</span>
        </p>
      </div>

      {mode === 'calculate' ? (
        <>
          <div className="result-block">
            <p className="result-label">예상 소환 횟수</p>
            <p className="result-value">
              🎲 {formatWithUnit(expectedMounts)}
              <span className="result-unit"> 회</span>
            </p>
          </div>
          <div className="result-block">
            <p className="result-label">예상 전쟁 점수</p>
            <p className="result-value">
              ⚔️ {formatWithUnit(expectedPoints)}
              <span className="result-unit">
                {' '}
                점 (업그레이드 시 {formatWithUnit(expectedPoints * 2)}점)
              </span>
            </p>
          </div>
        </>
      ) : (
        <div className="result-block">
          <p className="result-label">필요 소환 횟수 / 태엽 수</p>
          <p className="result-value">
            🎲 {formatWithUnit(mountsNeeded)}회 필요
            <span className="result-unit">
              {' '}
              · 태엽 {formatWithUnit(windersNeeded)}개 필요
            </span>
          </p>
        </div>
      )}
      {sortedMountRates.length > 0 && (
        <div className="result-history">
          <p className="result-history-title">
            희귀도별 기대 결과 (어떤 탈것을 얼마나 뽑는지)
          </p>
          <ul className="result-history-list">
            {sortedMountRates.map(([tier, prob]) => {
              const tierName = MOUNT_TIER_DISPLAY[tier] ?? tier
              const tierPoint = MOUNT_WAR_POINTS[tier]
              const expectedCount =
                attemptsForBreakdown > 0 ? attemptsForBreakdown * prob : 0
              const expectedTierPoints = expectedCount * tierPoint

              return (
                <li key={tier}>
                  <strong>
                    {tierName} ({tierPoint.toLocaleString()}점)
                  </strong>{' '}
                  – 확률 {(prob * 100).toFixed(2)}%
                  {attemptsForBreakdown > 0 && (
                    <>
                      {' · '}기대 횟수 ~{formatWithUnit(expectedCount)}
                      {' · '}기대 점수 ~{formatWithUnit(expectedTierPoints)}점
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function SkillPointsTab({ onSummaryChange }: { onSummaryChange?: SimpleSummaryCallback }) {
  const [mode, setMode] = useState<CalcMode>('calculate')
  const [level, setLevel] = useState(1)
  const [freePercent, setFreePercent] = useState('0')
  const [ticketCount, setTicketCount] = useState('0')
  const [costPerSummon, setCostPerSummon] = useState('200')
  const [targetPoints, setTargetPoints] = useState('0')

  const safeFreePercent = Math.max(0, Math.min(99.9, Number(freePercent) || 0))
  const freeMultiplier = 1 / (1 - safeFreePercent / 100)
  // 스킬 소환 1회당 아이템 5개
  const pointsPerSummon = calcSkillPointsPerItem(level) * 5
  const cost = safeNumber(costPerSummon) || 200
  const baseRates = getSkillRates(level)

  let expectedPoints = 0
  let expectedSummons = 0
  let summonsNeeded = 0
  let ticketsNeeded = 0
  let attemptsForBreakdown = 0

  if (pointsPerSummon > 0 && cost > 0 && mode !== 'upgrade') {
    if (mode === 'calculate') {
      const tickets = safeNumber(ticketCount)
      const effectiveTickets = tickets * freeMultiplier
      expectedSummons = Math.floor(effectiveTickets / cost)
      expectedPoints = expectedSummons * pointsPerSummon
    } else if (mode === 'target') {
      const target = safeNumber(targetPoints)
      summonsNeeded = Math.ceil(target / pointsPerSummon)
      const totalTickets = summonsNeeded * cost
      ticketsNeeded = Math.ceil(totalTickets / freeMultiplier)
    }
  }

  // 아이템 단위 기준 (소환 1회당 5개)
  attemptsForBreakdown =
    mode === 'calculate' ? expectedSummons * 5 : mode === 'target' ? summonsNeeded * 5 : 0

  const skillTiersForUi: Array<keyof typeof SKILL_WAR_POINTS> = [
    'common',
    'rare',
    'epic',
    'legendary',
    'ultimate',
    'mythic',
  ]

  const sortedSkillRates = skillTiersForUi
    .map((tier) => {
      const prob = baseRates[tier as keyof typeof baseRates]
      return [tier, prob] as const
    })
    .filter(([, prob]) => prob > 0.0001)

  useEffect(() => {
    if (!onSummaryChange) return
    const value = mode === 'calculate' ? expectedPoints : 0
    onSummaryChange(value)
  }, [onSummaryChange, mode, expectedPoints])

  return (
    <div className="card">
      <h3>스킬 점수 계산기</h3>
      <p className="card-description">
        아래 탭에서 스킬 소환 점수(티켓 기준)와 스킬 업그레이드 점수(레벨업 기준)를 각각 계산할 수 있습니다.
      </p>

      <div className="nav" style={{ marginBottom: '0.75rem' }}>
        <button
          type="button"
          className={`nav-link ${mode === 'calculate' ? 'active' : ''}`}
          onClick={() => setMode('calculate')}
        >
          티켓 수 기준 계산
        </button>
        <button
          type="button"
          className={`nav-link ${mode === 'target' ? 'active' : ''}`}
          onClick={() => setMode('target')}
        >
          목표 점수 기준 계산
        </button>
        <button
          type="button"
          className={`nav-link ${mode === 'upgrade' ? 'active' : ''}`}
          onClick={() => setMode('upgrade')}
        >
          스킬 업그레이드 계산
        </button>
      </div>

      {mode !== 'upgrade' && (
        <>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="skill-level">고스트 타운 레벨 (1~100)</label>
              <select
                id="skill-level"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value) || 1)}
              >
                {Array.from({ length: 100 }, (_, i) => i + 1).map((lv) => {
                  const world = Math.floor((lv - 1) / 10) + 1
                  const stage = ((lv - 1) % 10) + 1
                  return (
                    <option key={lv} value={lv}>
                      {world}-{stage}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="field">
              <label htmlFor="skill-free-percent">무료 소환 확률 (%)</label>
              <input
                id="skill-free-percent"
                type="text"
                inputMode="decimal"
                placeholder="예: 10"
                value={freePercent}
                onChange={(e) => setFreePercent(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="skill-cost-per">소환 1회당 티켓 수</label>
              <input
                id="skill-cost-per"
                type="text"
                inputMode="decimal"
                placeholder="기본값: 200"
                value={costPerSummon}
                onChange={(e) => setCostPerSummon(e.target.value)}
              />
            </div>
            {mode === 'calculate' ? (
              <div className="field">
                <label htmlFor="skill-tickets">보유 티켓 수</label>
                <input
                  id="skill-tickets"
                  type="text"
                  inputMode="decimal"
                  placeholder="예: 1000"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(e.target.value)}
                />
              </div>
            ) : (
              <div className="field">
                <label htmlFor="skill-target-points">목표 전쟁 점수</label>
                <input
                  id="skill-target-points"
                  type="text"
                  inputMode="decimal"
                  placeholder="예: 20000"
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="result-block">
            <p className="result-label">소환 1회당 예상 점수 (아이템 5개 기준)</p>
            <p className="result-value">
              📜 {pointsPerSummon.toFixed(2)}
              <span className="result-unit"> 점</span>
            </p>
          </div>

          {mode === 'calculate' ? (
            <>
              <div className="result-block">
                <p className="result-label">예상 소환 횟수</p>
                <p className="result-value">
                  🎲 {formatWithUnit(expectedSummons)}
                  <span className="result-unit"> 회</span>
                </p>
              </div>
              <div className="result-block">
                <p className="result-label">예상 전쟁 점수</p>
                <p className="result-value">
                  ⚔️ {formatWithUnit(expectedPoints)}
                  <span className="result-unit"> 점</span>
                </p>
              </div>
            </>
          ) : (
            <div className="result-block">
              <p className="result-label">필요 소환 횟수 / 티켓 수</p>
              <p className="result-value">
                🎲 {formatWithUnit(summonsNeeded)}회 필요
                <span className="result-unit">
                  {' '}
                  · 티켓 {formatWithUnit(ticketsNeeded)}개 필요
                </span>
              </p>
            </div>
          )}
        </>
      )}

      {mode === 'upgrade' ? (
        <SkillUpgradeSection />
      ) : (
        <>
          {sortedSkillRates.length > 0 && (
            <div className="result-history">
              <p className="result-history-title">
                희귀도별 기대 결과 (어떤 스킬을 얼마나 뽑는지)
              </p>
              <ul className="result-history-list">
                {sortedSkillRates.map(([tier, prob]) => {
                  const tierName = SKILL_TIER_DISPLAY[tier] ?? tier
                  const tierPoint = SKILL_WAR_POINTS[tier]
                  const expectedCount =
                    attemptsForBreakdown > 0 ? attemptsForBreakdown * prob : 0
                  const expectedTierPoints = expectedCount * tierPoint

                  return (
                    <li key={tier}>
                      <strong>
                        {tierName} ({tierPoint.toLocaleString()}점)
                      </strong>{' '}
                      – 확률 {(prob * 100).toFixed(2)}%
                      {attemptsForBreakdown > 0 && (
                        <>
                          {' · '}기대 개수 ~{formatWithUnit(expectedCount)}
                          {' · '}기대 점수 ~{formatWithUnit(expectedTierPoints)}점
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <p className="result-note">
            ※ 이 탭은 소환으로 얻는 전쟁 점수만 계산합니다. 스킬 레벨업에 따른 점수는
            &quot;스킬 업그레이드 계산&quot; 탭을 사용해 주세요.
          </p>
        </>
      )}
    </div>
  )
}

type EggRarityKey = 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate' | 'mythic'

const EGG_RARITIES: EggRarityKey[] = [
  'common',
  'rare',
  'epic',
  'legendary',
  'ultimate',
  'mythic',
]

const EGG_CONFIGS: Record<
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

function PetPointsTab({
  onSummaryChange,
}: {
  onSummaryChange?: (hatchPoints: number, mergePoints: number) => void
}) {
  const [overallSpeedPercent, setOverallSpeedPercent] = useState('0')
  const [eggCounts, setEggCounts] = useState<Record<EggRarityKey, string>>({
    common: '',
    rare: '',
    epic: '',
    legendary: '',
    ultimate: '',
    mythic: '',
  })
  const [eggSpeedPercents, setEggSpeedPercents] = useState<
    Record<EggRarityKey, string>
  >({
    common: '0',
    rare: '0',
    epic: '0',
    legendary: '0',
    ultimate: '0',
    mythic: '0',
  })

  const handleOverallSpeedChange = (value: string) => {
    const cleaned = normalizeIntInput(value)
    setOverallSpeedPercent(cleaned)
    setEggSpeedPercents({
      common: cleaned,
      rare: cleaned,
      epic: cleaned,
      legendary: cleaned,
      ultimate: cleaned,
      mythic: cleaned,
    })
  }

  const results = EGG_RARITIES.map((rarity) => {
    const cfg = EGG_CONFIGS[rarity]
    const count = safeNumber(eggCounts[rarity])
    const speedPercent = Math.max(
      0,
      Number(eggSpeedPercents[rarity].trim() || '0'),
    )
    const speedFactor = 1 + speedPercent / 100
    const effectiveSeconds = cfg.baseSeconds / speedFactor
    const totalSeconds = effectiveSeconds * count

    const hatchPoints = count * cfg.hatchScore
    const mergePoints = count * cfg.mergeScore

    return {
      rarity,
      label: cfg.label,
      count,
      totalSeconds,
      hatchPoints,
      mergePoints,
    }
  })

  const totalHatchPoints = results.reduce(
    (sum, r) => sum + r.hatchPoints,
    0,
  )
  const totalMergePoints = results.reduce(
    (sum, r) => sum + r.mergePoints,
    0,
  )

  useEffect(() => {
    if (!onSummaryChange) return
    onSummaryChange(totalHatchPoints, totalMergePoints)
  }, [onSummaryChange, totalHatchPoints, totalMergePoints])

  return (
    <div className="card">
      <h3>펫 점수 계산기</h3>
      <p className="card-description">
        희귀도별 펫 알 개수와 부화 속도(시간 감소 %)를 입력하면,
        <br />
        부화 점수와 합치기 점수를 기준으로 총 펫 전쟁 점수를 계산합니다.
      </p>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="egg-overall-speed">종합 시간 감소 (%)</label>
          <input
            id="egg-overall-speed"
            type="text"
            inputMode="decimal"
            placeholder="예: 20 (전 희귀도 공통 적용)"
            value={overallSpeedPercent}
            onChange={(e) => handleOverallSpeedChange(e.target.value)}
          />
        </div>
      </div>

      <div className="field-grid">
        {EGG_RARITIES.map((rarity) => {
          const cfg = EGG_CONFIGS[rarity]
          return (
            <div key={`${rarity}-inputs`} className="field">
              <label>{cfg.label} 개수 / 시간 감소 (%)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="개수 예: 10"
                  value={eggCounts[rarity]}
                  onChange={(e) =>
                    setEggCounts((prev) => {
                      const cleaned = normalizeIntInput(e.target.value)
                      return {
                        ...prev,
                        [rarity]: cleaned,
                      }
                    })
                  }
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="시간 감소 % 예: 20"
                  value={eggSpeedPercents[rarity]}
                  onChange={(e) =>
                    setEggSpeedPercents((prev) => {
                      const cleaned = normalizeIntInput(e.target.value)
                      return {
                        ...prev,
                        [rarity]: cleaned,
                      }
                    })
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="result-history">
        <p className="result-history-title">희귀도별 펫 알 결과</p>
        <ul className="result-history-list">
          {results
            .filter((r) => r.count > 0)
            .map((r) => (
              <li key={r.rarity}>
                <strong>{r.label}</strong> – 알 {r.count}개,
                {' 총 부화 시간 (순차 기준) '}
                {formatTimeDuration(r.totalSeconds)}
                {' · 부화 점수 '}
                <strong>{formatWithUnit(r.hatchPoints)}</strong>점
                {' · 합치기 시 점수 '}
                <strong>{formatWithUnit(r.mergePoints)}</strong>점
              </li>
            ))}
        </ul>
      </div>

      <div className="result-block">
        <p className="result-label">펫에서 얻는 총 점수</p>
        <p className="result-value">
          🐾 {formatWithUnit(totalHatchPoints)}
          <span className="result-unit">
            {' '}
            점 (합치기 시 {formatWithUnit(totalMergePoints)}점)
          </span>
        </p>
      </div>
      <div className="result-block">
        <p className="result-label">총 부화 시간 (모든 알 순차 부화 기준)</p>
        <p className="result-value">
          ⏱ {formatTimeDuration(
            results.reduce((sum, r) => sum + r.totalSeconds, 0),
          )}
        </p>
      </div>
      <p className="result-note">
        ※ 부화 시간은 기본 시간 ÷ (1 + 속도%) 공식으로 계산되며,
        속도 보너스는 부화 속도를 올려 시간을 간접적으로 단축합니다.
      </p>
    </div>
  )
}
