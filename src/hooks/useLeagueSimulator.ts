import { useMemo, useState } from 'react'
import { formatTimeDuration, safeNumber } from '../utils'

type SideId = 'me' | 'enemy'

type SkillKind = 'damage' | 'heal' | 'buff'

type LeagueSkillId =
  | 'normal-shout'
  | 'normal-arrow'
  | 'normal-meat'
  | 'rare-shuriken'
  | 'rare-bombard'
  | 'rare-berserker'
  | 'epic-thorn'
  | 'epic-arrow-rain'
  | 'epic-buff'
  | 'legend-meteor'
  | 'legend-bomb'
  | 'legend-morale'
  | 'ultimate-rush'
  | 'ultimate-bugs'
  | 'ultimate-lightning'
  | 'mythic-gatling'
  | 'mythic-drone'
  | 'mythic-high-morale'

type LeagueSkillDef = {
  id: LeagueSkillId
  grade: '일반' | '희귀' | '서사시' | '전설' | '궁극' | '신화'
  name: string
  kind: SkillKind
  cooldownSec: number
  durationSec?: number
  description: string
}

export const LEAGUE_SKILLS: LeagueSkillDef[] = [
  {
    id: 'normal-shout',
    grade: '일반',
    name: '외침',
    kind: 'damage',
    cooldownSec: 6.1,
    description: '데미지 스킬 (쿨타임 6.1초)',
  },
  {
    id: 'normal-arrow',
    grade: '일반',
    name: '화살',
    kind: 'damage',
    cooldownSec: 10.1,
    description: '데미지 스킬 (쿨타임 10.1초)',
  },
  {
    id: 'normal-meat',
    grade: '일반',
    name: '고기',
    kind: 'heal',
    cooldownSec: 10.1,
    durationSec: 10,
    description: '회복 스킬 (10초 동안 회복, 쿨타임 10.1초)',
  },
  {
    id: 'rare-shuriken',
    grade: '희귀',
    name: '수리검',
    kind: 'damage',
    cooldownSec: 4.2,
    description: '데미지 스킬 (쿨타임 4.2초)',
  },
  {
    id: 'rare-bombard',
    grade: '희귀',
    name: '포격',
    kind: 'damage',
    cooldownSec: 5.2,
    description: '데미지 스킬 (쿨타임 5.2초)',
  },
  {
    id: 'rare-berserker',
    grade: '희귀',
    name: '광전사',
    kind: 'buff',
    cooldownSec: 10.2,
    durationSec: 10,
    description: '버프 10초 적용 후 쿨타임 10.2초',
  },
  {
    id: 'epic-thorn',
    grade: '서사시',
    name: '가시',
    kind: 'damage',
    cooldownSec: 5.2,
    description: '데미지 스킬 (쿨타임 5.2초)',
  },
  {
    id: 'epic-arrow-rain',
    grade: '서사시',
    name: '화살비',
    kind: 'damage',
    cooldownSec: 10.2,
    description: '데미지 스킬 (쿨타임 10.2초)',
  },
  {
    id: 'epic-buff',
    grade: '서사시',
    name: '버프',
    kind: 'buff',
    cooldownSec: 8.1,
    durationSec: 10,
    description: '버프 10초 적용, 쿨타임 8.1초',
  },
  {
    id: 'legend-meteor',
    grade: '전설',
    name: '운석',
    kind: 'damage',
    cooldownSec: 9.2,
    description: '데미지 스킬 (쿨타임 9.2초)',
  },
  {
    id: 'legend-bomb',
    grade: '전설',
    name: '폭탄',
    kind: 'damage',
    cooldownSec: 6.2,
    description: '데미지 스킬 (쿨타임 6.2초)',
  },
  {
    id: 'legend-morale',
    grade: '전설',
    name: '사기',
    kind: 'buff',
    cooldownSec: 8.1,
    durationSec: 10,
    description: '버프 10초 적용, 쿨타임 8.1초',
  },
  {
    id: 'ultimate-rush',
    grade: '궁극',
    name: '쇄도',
    kind: 'damage',
    cooldownSec: 20.2,
    description: '데미지 스킬 (쿨타임 20.2초)',
  },
  {
    id: 'ultimate-bugs',
    grade: '궁극',
    name: '벌레',
    kind: 'damage',
    cooldownSec: 8.2,
    description: '데미지 스킬 (쿨타임 8.2초)',
  },
  {
    id: 'ultimate-lightning',
    grade: '궁극',
    name: '번개',
    kind: 'damage',
    cooldownSec: 3.2,
    description: '데미지 스킬 (쿨타임 3.2초)',
  },
  {
    id: 'mythic-gatling',
    grade: '신화',
    name: '기총소사',
    kind: 'damage',
    cooldownSec: 10.2,
    description: '데미지 스킬 (쿨타임 10.2초)',
  },
  {
    id: 'mythic-drone',
    grade: '신화',
    name: '드론',
    kind: 'damage',
    cooldownSec: 8.1,
    description: '데미지 스킬 (쿨타임 8.1초)',
  },
  {
    id: 'mythic-high-morale',
    grade: '신화',
    name: '높은 사기',
    kind: 'buff',
    cooldownSec: 8.1,
    durationSec: 10,
    description: '버프 10초 적용, 쿨타임 8.1초',
  },
]

const SKILL_MAP: Record<LeagueSkillId, LeagueSkillDef> = LEAGUE_SKILLS.reduce(
  (acc, skill) => {
    acc[skill.id] = skill
    return acc
  },
  {} as Record<LeagueSkillId, LeagueSkillDef>,
)

export type LeagueSkillInput = {
  skillId: LeagueSkillId | ''
  powerInput: string
  buffDamageFlatInput: string
  buffHpFlatInput: string
}

export type LeagueSideState = {
  totalDamageInput: string
  totalHPInput: string

  weaponType: 'melee' | 'range'

  critChancePercentInput: string
  critDamagePercentInput: string
  blockChancePercentInput: string

  regenPercentInput: string
  maxHPPercentInput: string
  lifestealPercentInput: string

  doubleChancePercentInput: string
  damagePercentInput: string
  meleeDamagePercentInput: string
  rangeDamagePercentInput: string
  attackSpeedPercentInput: string
  skillDamagePercentInput: string
  skillCooldownPercentInput: string

  skills: LeagueSkillInput[]
}

type LeagueSideComputed = {
  maxHP: number
  baseDps: number
  skillDamageDps: number
  totalDpsWithoutBlock: number
  regenHps: number
  lifestealHps: number
  skillHps: number
  totalHps: number
  blockChance: number
}

export type LeagueSimulationResult = {
  me: LeagueSideComputed
  enemy: LeagueSideComputed
  myEffectiveDpsOnEnemy: number
  enemyEffectiveDpsOnMe: number
  myNetDpsOnEnemy: number
  enemyNetDpsOnMe: number
  timeToKillEnemySec: number | null
  timeToKillMeSec: number | null
  winner: 'me' | 'enemy' | 'draw' | 'none'
  winnerLabel: string
  summary: string
}

const initialSideState: LeagueSideState = {
  totalDamageInput: '',
  totalHPInput: '',

  weaponType: 'melee',

  critChancePercentInput: '',
  critDamagePercentInput: '',
  blockChancePercentInput: '',

  regenPercentInput: '',
  maxHPPercentInput: '',
  lifestealPercentInput: '',

  doubleChancePercentInput: '',
  damagePercentInput: '',
  meleeDamagePercentInput: '',
  rangeDamagePercentInput: '',
  attackSpeedPercentInput: '',
  skillDamagePercentInput: '',
  skillCooldownPercentInput: '',

  skills: [
    { skillId: '', powerInput: '', buffDamageFlatInput: '', buffHpFlatInput: '' },
    { skillId: '', powerInput: '', buffDamageFlatInput: '', buffHpFlatInput: '' },
    { skillId: '', powerInput: '', buffDamageFlatInput: '', buffHpFlatInput: '' },
  ],
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

function computeSide(side: LeagueSideState): LeagueSideComputed {
  const totalDamage = safeNumber(side.totalDamageInput)
  const baseHP = safeNumber(side.totalHPInput)

  const baseHpPercent = safeNumber(side.maxHPPercentInput)
  const attackSpeedPercent = safeNumber(side.attackSpeedPercentInput)
  const critChancePercent = safeNumber(side.critChancePercentInput)
  const critDamagePercent = safeNumber(side.critDamagePercentInput)
  const doubleChancePercent = safeNumber(side.doubleChancePercentInput)
  const lifestealPercent = safeNumber(side.lifestealPercentInput)
  const regenPercent = safeNumber(side.regenPercentInput)
  const skillDamagePercent = safeNumber(side.skillDamagePercentInput)
  const skillCooldownPercent = safeNumber(side.skillCooldownPercentInput)
  const blockChancePercent = safeNumber(side.blockChancePercentInput)

  const blockChance = clamp01(blockChancePercent / 100)

  const skills = side.skills
  let skillDamageDps = 0
  let skillHps = 0
  let buffDamageFlatTotal = 0
  let buffHpFlatTotal = 0

  for (const s of skills) {
    if (!s.skillId) continue
    const def = SKILL_MAP[s.skillId]
    if (!def) continue

    const cdMult = 1 + skillCooldownPercent / 100
    const effectiveCd = def.cooldownSec / (cdMult > 0 ? cdMult : 1)

    if (effectiveCd <= 0) continue

    if (def.kind === 'heal') {
      const power = safeNumber(s.powerInput)
      if (power <= 0) continue
      // 1회 발동 시 총 회복량을 입력받았다고 가정하고, 평균 초당 회복량으로 환산
      skillHps += power / effectiveCd
    } else if (def.kind === 'damage') {
      const power = safeNumber(s.powerInput)
      if (power <= 0) continue
      const skillDamageMult = 1 + skillDamagePercent / 100
      skillDamageDps += (power * skillDamageMult) / effectiveCd
    } else if (def.kind === 'buff') {
      const duration = def.durationSec ?? 0
      if (duration > 0) {
        const uptime = Math.min(1, duration / effectiveCd)
        const buffDamageFlat = safeNumber(s.buffDamageFlatInput)
        const buffHpFlat = safeNumber(s.buffHpFlatInput)
        if (buffDamageFlat === 0 && buffHpFlat === 0) continue
        buffDamageFlatTotal += buffDamageFlat * uptime
        buffHpFlatTotal += buffHpFlat * uptime
      }
    }
  }

  // 무기 타입에 따른 근접/원거리 피해 적용
  const baseDamagePercent = safeNumber(side.damagePercentInput)
  const meleeDamagePercent = safeNumber(side.meleeDamagePercentInput)
  const rangeDamagePercent = safeNumber(side.rangeDamagePercentInput)

  let weaponDamagePercent = 0
  if (side.weaponType === 'melee') {
    weaponDamagePercent += meleeDamagePercent
  } else if (side.weaponType === 'range') {
    weaponDamagePercent += rangeDamagePercent
  }

  const totalDamagePercent = baseDamagePercent + weaponDamagePercent

  // 기본 공격 DPS 추정 (표시 공격력 기준, 1초당 1회 공격 가정)
  let baseDps = totalDamage + buffDamageFlatTotal
  baseDps *= 1 + totalDamagePercent / 100
  baseDps *= 1 + attackSpeedPercent / 100

  const critChance = clamp01(critChancePercent / 100)
  const critDamageMult = 1 + critDamagePercent / 100
  const critMult = 1 + critChance * (critDamageMult - 1)
  baseDps *= critMult

  baseDps *= 1 + doubleChancePercent / 100

  const totalDpsWithoutBlock = baseDps + skillDamageDps

  const maxHP =
    (baseHP + buffHpFlatTotal) * (1 + baseHpPercent / 100)

  const regenHps = (regenPercent / 100) * maxHP

  const lifestealHps = (totalDpsWithoutBlock * lifestealPercent) / 100
  const totalHps = regenHps + lifestealHps + skillHps

  return {
    maxHP,
    baseDps,
    skillDamageDps,
    totalDpsWithoutBlock,
    regenHps,
    lifestealHps,
    skillHps,
    totalHps,
    blockChance,
  }
}

export function useLeagueSimulator() {
  const [me, setMe] = useState<LeagueSideState>(initialSideState)
  const [enemy, setEnemy] = useState<LeagueSideState>(initialSideState)

  const result: LeagueSimulationResult = useMemo(() => {
    const meComputed = computeSide(me)
    const enemyComputed = computeSide(enemy)

    const myEffectiveDpsOnEnemy =
      meComputed.totalDpsWithoutBlock * (1 - enemyComputed.blockChance)
    const enemyEffectiveDpsOnMe =
      enemyComputed.totalDpsWithoutBlock * (1 - meComputed.blockChance)

    const myNetDpsOnEnemy = myEffectiveDpsOnEnemy - enemyComputed.totalHps
    const enemyNetDpsOnMe = enemyEffectiveDpsOnMe - meComputed.totalHps

    const timeToKillEnemySec =
      myNetDpsOnEnemy > 0 ? enemyComputed.maxHP / myNetDpsOnEnemy : null
    let timeToKillMeSec =
      enemyNetDpsOnMe > 0 ? meComputed.maxHP / enemyNetDpsOnMe : null

    // 내가 원거리, 상대가 근거리인 경우: 상대가 접근하는 데 1.5초가 걸린다고 가정
    // → 상대가 나를 실제로 때리기 시작하기까지 1.5초의 여유가 있으므로,
    //   상대가 나를 잡는 시간에 1.5초를 추가로 더해 준다.
    if (
      me.weaponType === 'range' &&
      enemy.weaponType === 'melee' &&
      timeToKillMeSec != null
    ) {
      timeToKillMeSec += 1.5
    }

    let winner: LeagueSimulationResult['winner'] = 'none'
    let winnerLabel = '입력 값을 더 채워주세요.'

    if (timeToKillEnemySec == null && timeToKillMeSec == null) {
      winner = 'draw'
      winnerLabel = '서로를 잡지 못하는 조합입니다.'
    } else if (timeToKillEnemySec == null && timeToKillMeSec != null) {
      winner = 'enemy'
      winnerLabel = '상대가 유리한 조합입니다.'
    } else if (timeToKillEnemySec != null && timeToKillMeSec == null) {
      winner = 'me'
      winnerLabel = '내 조합이 유리합니다.'
    } else if (timeToKillEnemySec != null && timeToKillMeSec != null) {
      if (Math.abs(timeToKillEnemySec - timeToKillMeSec) < 0.5) {
        winner = 'draw'
        winnerLabel = '거의 비슷한 승부입니다.'
      } else if (timeToKillEnemySec < timeToKillMeSec) {
        winner = 'me'
        winnerLabel = '내 조합이 더 빨리 상대를 잡습니다.'
      } else {
        winner = 'enemy'
        winnerLabel = '상대 조합이 더 빨리 나를 잡습니다.'
      }
    }

    const parts: string[] = []
    if (timeToKillEnemySec != null) {
      parts.push(
        `내가 상대를 잡는 데 걸리는 시간: ${formatTimeDuration(
          timeToKillEnemySec,
        )}`,
      )
    }
    if (timeToKillMeSec != null) {
      parts.push(
        `상대가 나를 잡는 데 걸리는 시간: ${formatTimeDuration(
          timeToKillMeSec,
        )}`,
      )
    }

    const summary = parts.join(' · ')

    return {
      me: meComputed,
      enemy: enemyComputed,
      myEffectiveDpsOnEnemy,
      enemyEffectiveDpsOnMe,
      myNetDpsOnEnemy,
      enemyNetDpsOnMe,
      timeToKillEnemySec,
      timeToKillMeSec,
      winner,
      winnerLabel,
      summary,
    }
  }, [me, enemy])

  const updateField = (sideId: SideId, field: keyof LeagueSideState, value: string) => {
    if (sideId === 'me') {
      setMe((prev) => ({ ...prev, [field]: value }))
    } else {
      setEnemy((prev) => ({ ...prev, [field]: value }))
    }
  }

  const updateSkill = (
    sideId: SideId,
    index: number,
    patch: Partial<LeagueSkillInput>,
  ) => {
    if (index < 0 || index >= 3) return
    if (sideId === 'me') {
      setMe((prev) => ({
        ...prev,
        skills: prev.skills.map((s, i) =>
          i === index ? { ...s, ...patch } : s,
        ),
      }))
    } else {
      setEnemy((prev) => ({
        ...prev,
        skills: prev.skills.map((s, i) =>
          i === index ? { ...s, ...patch } : s,
        ),
      }))
    }
  }

  return {
    me,
    enemy,
    result,
    updateField,
    updateSkill,
    skills: LEAGUE_SKILLS,
  }
}

