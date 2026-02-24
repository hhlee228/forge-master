import { useMemo, useState } from 'react'
import { safeNumber } from '../utils'

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
  /** 1회 사용 시 타격 횟수(입력 피해량 × N). 없으면 1 */
  hitsPerCast?: number
  description: string
}

/** 모든 스킬 첫 쿨 고정 4.2초. 다음 쿨부터 풀쿨에 재사용대기시간 감소 적용 */
const FIRST_COOLDOWN_SEC = 4.2

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
    hitsPerCast: 5,
    description: '데미지 스킬 1회 시 5타 (쿨타임 9.2초)',
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
  lifestealPercentInput: string

  doubleChancePercentInput: string
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

const MATCH_DURATION_SEC = 60
const BASE_ATTACK_INTERVAL_SEC = 1.7

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
  myHpAfter60: number
  enemyHpAfter60: number
  /** 60초 동안 내가 상대 체력에서 깎은 비율 (0~100) */
  myRemovedPercent: number
  /** 60초 동안 상대가 내 체력에서 깎은 비율 (0~100) */
  enemyRemovedPercent: number
}

export type LeagueBatchResult = {
  meWins: number
  enemyWins: number
  draws: number
  totalRuns: number
  avgMyHpAfter60: number
  avgEnemyHpAfter60: number
  avgMyRemovedPercent: number
  avgEnemyRemovedPercent: number
}

const initialSideState: LeagueSideState = {
  totalDamageInput: '',
  totalHPInput: '',

  weaponType: 'melee',

  critChancePercentInput: '',
  critDamagePercentInput: '',
  blockChancePercentInput: '',

  regenPercentInput: '',
  lifestealPercentInput: '',

  doubleChancePercentInput: '',
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

function getAttackStartDelay(
  attackerWeapon: LeagueSideState['weaponType'],
  defenderWeapon: LeagueSideState['weaponType'],
): number {
  if (attackerWeapon === 'range' && defenderWeapon === 'range') {
    return 4
  }
  if (attackerWeapon === 'range' && defenderWeapon === 'melee') {
    return 4
  }
  if (attackerWeapon === 'melee' && defenderWeapon === 'range') {
    return 7
  }
  // melee vs melee
  return 5.5
}

/** 스킬 재사용 대기시간 감소 % (게임에 -6.18% 로 뜨면 6.18 또는 -6.18 입력 가능). 첫 쿨은 적용 안 받음. */
function getEffectiveCooldownAfterFirst(baseCooldownSec: number, cooldownReductionPercent: number): number {
  const reduction = Math.abs(cooldownReductionPercent)
  const mult = Math.max(0.01, 1 - reduction / 100)
  return baseCooldownSec * mult
}

/** 이벤트 기반 시뮬: 다음 이벤트(평타/스킬) 시점으로만 진행. 최소 진행 간격(수치 안정성) */
const MIN_DT = 0.001

type TickSideParams = {
  baseMaxHP: number
  baseDamage: number
  weaponType: LeagueSideState['weaponType']
  attackSpeedMult: number
  critChance: number
  critDamageMult: number
  doubleChance: number
  blockChance: number
  regenPercent: number
  lifestealPercent: number
  skillDamageMult: number
  effectiveCd: (baseCd: number) => number
  skills: { def: LeagueSkillDef; power: number; buffDmg: number; buffHp: number }[]
}

function getTickSideParams(side: LeagueSideState): TickSideParams {
  const baseHP = safeNumber(side.totalHPInput)
  const totalDamage = safeNumber(side.totalDamageInput)
  const attackSpeedPercent = safeNumber(side.attackSpeedPercentInput)
  const critChancePercent = safeNumber(side.critChancePercentInput)
  const critDamagePercent = safeNumber(side.critDamagePercentInput)
  const doubleChancePercent = safeNumber(side.doubleChancePercentInput)
  const blockChancePercent = safeNumber(side.blockChancePercentInput)
  const regenPercent = safeNumber(side.regenPercentInput)
  const lifestealPercent = safeNumber(side.lifestealPercentInput)
  const skillDamagePercent = safeNumber(side.skillDamagePercentInput)
  const skillCooldownPercent = safeNumber(side.skillCooldownPercentInput)
  const meleePercent = safeNumber(side.meleeDamagePercentInput)
  const rangePercent = safeNumber(side.rangeDamagePercentInput)
  const weaponMult = 1 + (side.weaponType === 'melee' ? meleePercent : rangePercent) / 100

  const skills = side.skills
    .filter((s) => s.skillId && SKILL_MAP[s.skillId])
    .map((s) => ({
      def: SKILL_MAP[s.skillId as LeagueSkillId],
      power: safeNumber(s.powerInput),
      buffDmg: safeNumber(s.buffDamageFlatInput),
      buffHp: safeNumber(s.buffHpFlatInput),
    }))

  return {
    baseMaxHP: baseHP,
    baseDamage: totalDamage * weaponMult,
    weaponType: side.weaponType,
    attackSpeedMult: 1 + attackSpeedPercent / 100,
    critChance: clamp01(critChancePercent / 100),
    critDamageMult: 1 + critDamagePercent / 100,
    doubleChance: clamp01(doubleChancePercent / 100),
    blockChance: clamp01(blockChancePercent / 100),
    regenPercent,
    lifestealPercent,
    skillDamageMult: 1 + skillDamagePercent / 100,
    effectiveCd: (baseCd: number) => getEffectiveCooldownAfterFirst(baseCd, skillCooldownPercent),
    skills,
  }
}

type TickRunResult = {
  myHpAfter60: number
  enemyHpAfter60: number
  myRemovedPercent: number
  enemyRemovedPercent: number
  winner: 'me' | 'enemy' | 'draw' | 'none'
}

/**
 * 시간 단위(틱) 시뮬레이션: 60초 동안 평타/스킬/회복 타이밍을 반영해 승패 판정.
 * - 첫 평타: 무기 조합에 따른 시작 지연 후
 * - 첫 스킬: 풀 쿨 후 사용, 이후부터 쿨감 적용
 * - deterministic이면 매 타격 기대값 사용, 아니면 치명/블록/더블 랜덤
 */
function runTickBasedSimulation(
  meState: LeagueSideState,
  enemyState: LeagueSideState,
  options: { deterministic?: boolean } = {},
): TickRunResult {
  const deterministic = options.deterministic ?? true
  const meP = getTickSideParams(meState)
  const enemyP = getTickSideParams(enemyState)

  const myStartDelay = getAttackStartDelay(meState.weaponType, enemyState.weaponType)
  const enemyStartDelay = getAttackStartDelay(enemyState.weaponType, meState.weaponType)
  const myAttackInterval = BASE_ATTACK_INTERVAL_SEC / meP.attackSpeedMult
  const enemyAttackInterval = BASE_ATTACK_INTERVAL_SEC / enemyP.attackSpeedMult

  let meHP = meP.baseMaxHP
  let enemyHP = enemyP.baseMaxHP
  let meMaxHP = meP.baseMaxHP
  let enemyMaxHP = enemyP.baseMaxHP

  let meNextBasic = myStartDelay
  let enemyNextBasic = enemyStartDelay
  // 스킬: 모든 스킬 첫 쿨 3.3초 고정. 다음 쿨부터 풀쿨에 재사용대기시간 감소 적용
  const meSkillNext: number[] = meP.skills.map(() => FIRST_COOLDOWN_SEC)
  const enemySkillNext: number[] = enemyP.skills.map(() => FIRST_COOLDOWN_SEC)
  let meBuffEnd = 0
  let enemyBuffEnd = 0
  let meBuffDmg = 0
  let enemyBuffDmg = 0
  let meBuffHp = 0
  let enemyBuffHp = 0
  let meHotRate = 0
  let meHotEnd = 0
  let enemyHotRate = 0
  let enemyHotEnd = 0
  let meSkillUseCount = new Array(meP.skills.length).fill(0)
  let enemySkillUseCount = new Array(enemyP.skills.length).fill(0)

  function rollBlock(blockChance: number): boolean {
    if (deterministic) return false
    return Math.random() < blockChance
  }
  function rollCrit(critChance: number): boolean {
    if (deterministic) return false
    return Math.random() < critChance
  }
  function rollDouble(doubleChance: number): boolean {
    if (deterministic) return false
    return Math.random() < doubleChance
  }
  function dealBasicDamage(attacker: TickSideParams, defenderBlock: number): number {
    let dmg = attacker.baseDamage
    if (attacker === meP) dmg += meBuffDmg
    else dmg += enemyBuffDmg
    if (rollBlock(defenderBlock)) return 0
    if (rollCrit(attacker.critChance)) dmg *= attacker.critDamageMult
    if (rollDouble(attacker.doubleChance)) dmg *= 2
    if (deterministic) {
      dmg *= 1 - defenderBlock
      dmg *= 1 + attacker.critChance * (attacker.critDamageMult - 1)
      dmg *= 1 + attacker.doubleChance
    }
    return Math.max(0, dmg)
  }
  function dealSkillDamage(power: number, hits: number, skillMult: number, buffDmg: number, defenderBlock: number): number {
    let dmg = (power * hits * skillMult) + buffDmg
    if (rollBlock(defenderBlock)) return 0
    if (deterministic) dmg *= 1 - defenderBlock
    return Math.max(0, dmg)
  }

  // 이벤트 기반(빨리감기): 다음 평타/스킬 시점으로만 진행
  let t = 0
  while (t < MATCH_DURATION_SEC) {
    const eventTimes: number[] = [
      meNextBasic,
      enemyNextBasic,
      ...meSkillNext,
      ...enemySkillNext,
    ].filter((x) => x > t)
    const nextT = Math.min(
      MATCH_DURATION_SEC,
      eventTimes.length > 0 ? Math.min(...eventTimes) : MATCH_DURATION_SEC,
    )
    const dt = Math.max(MIN_DT, nextT - t)

    if (t >= meBuffEnd) {
      meBuffDmg = 0
      meBuffHp = 0
    }
    if (t >= enemyBuffEnd) {
      enemyBuffDmg = 0
      enemyBuffHp = 0
    }
    meMaxHP = meP.baseMaxHP + meBuffHp
    enemyMaxHP = enemyP.baseMaxHP + enemyBuffHp

    // 체력 재생 %: 버프로 체력 오르면 회복력도 올라가고, 버프 해제되면 다시 기본 기준으로
    meHP = Math.min(meMaxHP, meHP + (meP.regenPercent / 100) * meMaxHP * dt)
    if (t < meHotEnd) meHP = Math.min(meMaxHP, meHP + meHotRate * dt)
    enemyHP = Math.min(enemyMaxHP, enemyHP + (enemyP.regenPercent / 100) * enemyMaxHP * dt)
    if (t < enemyHotEnd) enemyHP = Math.min(enemyMaxHP, enemyHP + enemyHotRate * dt)

    t = nextT
    if (t >= MATCH_DURATION_SEC) break

    if (t >= meBuffEnd) {
      meBuffDmg = 0
      meBuffHp = 0
    }
    if (t >= enemyBuffEnd) {
      enemyBuffDmg = 0
      enemyBuffHp = 0
    }
    meMaxHP = meP.baseMaxHP + meBuffHp
    enemyMaxHP = enemyP.baseMaxHP + enemyBuffHp

    let myDmgToEnemy = 0
    let enemyDmgToMe = 0

    if (meNextBasic <= t && t < MATCH_DURATION_SEC) {
      myDmgToEnemy += dealBasicDamage(meP, enemyP.blockChance)
      meNextBasic += myAttackInterval
    }
    meP.skills.forEach((sk, i) => {
      if (meSkillNext[i] > t || t >= MATCH_DURATION_SEC) return
      const def = sk.def
      if (def.kind === 'damage') {
        myDmgToEnemy += dealSkillDamage(sk.power, def.hitsPerCast ?? 1, meP.skillDamageMult, meBuffDmg, enemyP.blockChance)
      } else if (def.kind === 'heal') {
        meHotRate = sk.power / (def.durationSec ?? 10)
        meHotEnd = t + (def.durationSec ?? 10)
      } else if (def.kind === 'buff' && def.durationSec) {
        meBuffDmg = sk.buffDmg
        meBuffHp = sk.buffHp
        meBuffEnd = t + def.durationSec
      }
      meSkillUseCount[i]++
      meSkillNext[i] = t + meP.effectiveCd(def.cooldownSec) // 첫 사용 다음 쿨부터 대기시간 감소 적용
    })

    if (enemyNextBasic <= t && t < MATCH_DURATION_SEC) {
      enemyDmgToMe += dealBasicDamage(enemyP, meP.blockChance)
      enemyNextBasic += enemyAttackInterval
    }
    enemyP.skills.forEach((sk, i) => {
      if (enemySkillNext[i] > t || t >= MATCH_DURATION_SEC) return
      const def = sk.def
      if (def.kind === 'damage') {
        enemyDmgToMe += dealSkillDamage(sk.power, def.hitsPerCast ?? 1, enemyP.skillDamageMult, enemyBuffDmg, meP.blockChance)
      } else if (def.kind === 'heal') {
        enemyHotRate = sk.power / (def.durationSec ?? 10)
        enemyHotEnd = t + (def.durationSec ?? 10)
      } else if (def.kind === 'buff' && def.durationSec) {
        enemyBuffDmg = sk.buffDmg
        enemyBuffHp = sk.buffHp
        enemyBuffEnd = t + def.durationSec
      }
      enemySkillUseCount[i]++
      enemySkillNext[i] = t + enemyP.effectiveCd(def.cooldownSec) // 첫 사용 다음 쿨부터 대기시간 감소 적용
    })

    enemyHP = Math.max(0, enemyHP - myDmgToEnemy)
    meHP = Math.max(0, meHP - enemyDmgToMe)
    if (myDmgToEnemy > 0) meHP = Math.min(meMaxHP, meHP + (meP.lifestealPercent / 100) * myDmgToEnemy)
    if (enemyDmgToMe > 0) enemyHP = Math.min(enemyMaxHP, enemyHP + (enemyP.lifestealPercent / 100) * enemyDmgToMe)
  }

  const meBaseMax = meP.baseMaxHP
  const enemyBaseMax = enemyP.baseMaxHP
  // 60초 끝날 때 버프 적용 중이면 버프 적용된 최대체력으로 승패, 아니면 기본 최대체력으로
  const meRefMax = meBaseMax + (meBuffEnd > MATCH_DURATION_SEC ? meBuffHp : 0)
  const enemyRefMax = enemyBaseMax + (enemyBuffEnd > MATCH_DURATION_SEC ? enemyBuffHp : 0)
  const enemyHpCapped = Math.min(enemyRefMax, enemyHP)
  const meHpCapped = Math.min(meRefMax, meHP)
  const myRemovedPercent = enemyRefMax > 0 ? ((enemyRefMax - enemyHpCapped) / enemyRefMax) * 100 : 0
  const enemyRemovedPercent = meRefMax > 0 ? ((meRefMax - meHpCapped) / meRefMax) * 100 : 0
  const percentDiff = myRemovedPercent - enemyRemovedPercent
  let winner: TickRunResult['winner'] = 'none'
  if (meRefMax > 0 && enemyRefMax > 0) {
    if (Math.abs(percentDiff) < 0.01) winner = 'draw'
    else winner = percentDiff > 0 ? 'me' : 'enemy'
  }

  return {
    myHpAfter60: meHP,
    enemyHpAfter60: enemyHP,
    myRemovedPercent,
    enemyRemovedPercent,
    winner,
  }
}

function computeSide(side: LeagueSideState): LeagueSideComputed {
  const totalDamage = safeNumber(side.totalDamageInput)
  const baseHP = safeNumber(side.totalHPInput)

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

  // 스킬 재사용 대기시간 감소 % (양수 = 쿨 감소). 첫 쿨은 적용 안 받고, 이후부터 적용.
  const effectiveCdForBuff = (baseCd: number) =>
    getEffectiveCooldownAfterFirst(baseCd, skillCooldownPercent)

  for (const s of skills) {
    if (!s.skillId) continue
    const def = SKILL_MAP[s.skillId]
    if (!def) continue

    if (def.kind === 'heal') {
      const power = safeNumber(s.powerInput)
      if (power <= 0) continue
      // 60초 기준 캐스트 횟수는 getSkillDamageAndHealOver60에서 계산. 여기선 DPS는 결과 표시용 대략값
      const effectiveCd = effectiveCdForBuff(def.cooldownSec)
      if (effectiveCd > 0) skillHps += power / effectiveCd
    } else if (def.kind === 'damage') {
      const power = safeNumber(s.powerInput)
      if (power <= 0) continue
      const effectiveCd = effectiveCdForBuff(def.cooldownSec)
      if (effectiveCd > 0) {
        const skillDamageMult = 1 + skillDamagePercent / 100
        const hits = def.hitsPerCast ?? 1
        skillDamageDps += (power * hits * skillDamageMult) / effectiveCd
      }
    } else if (def.kind === 'buff') {
      const duration = def.durationSec ?? 0
      if (duration > 0) {
        const effectiveCd = effectiveCdForBuff(def.cooldownSec)
        if (effectiveCd > 0) {
          const uptime = Math.min(1, duration / effectiveCd)
          const buffDamageFlat = safeNumber(s.buffDamageFlatInput)
          const buffHpFlat = safeNumber(s.buffHpFlatInput)
          if (buffDamageFlat === 0 && buffHpFlat === 0) continue
          buffDamageFlatTotal += buffDamageFlat * uptime
          buffHpFlatTotal += buffHpFlat * uptime
        }
      }
    }
  }

  // 무기 타입에 따른 근접/원거리 피해만 적용 (피해%는 총피해에 이미 반영됨)
  const meleeDamagePercent = safeNumber(side.meleeDamagePercentInput)
  const rangeDamagePercent = safeNumber(side.rangeDamagePercentInput)

  let weaponDamagePercent = 0
  if (side.weaponType === 'melee') {
    weaponDamagePercent = meleeDamagePercent
  } else if (side.weaponType === 'range') {
    weaponDamagePercent = rangeDamagePercent
  }

  // 기본 공격 DPS 추정
  // - 기본 공격 간격: 1.7초 (공속 추가 옵션이 0%일 때)
  // - 공격 속도 % 만큼 공격 횟수 증가
  const attackSpeedMult = 1 + attackSpeedPercent / 100
  const attacksPerSecond = (1 / BASE_ATTACK_INTERVAL_SEC) * attackSpeedMult

  let baseDps = totalDamage + buffDamageFlatTotal
  baseDps *= 1 + weaponDamagePercent / 100
  baseDps *= attacksPerSecond

  const critChance = clamp01(critChancePercent / 100)
  const critDamageMult = 1 + critDamagePercent / 100
  const critMult = 1 + critChance * (critDamageMult - 1)
  baseDps *= critMult

  baseDps *= 1 + doubleChancePercent / 100

  const totalDpsWithoutBlock = baseDps + skillDamageDps

  const maxHP = baseHP + buffHpFlatTotal

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

    // 시간(틱) 단위 시뮬레이션으로 60초 결과 계산 (평타/스킬/회복 타이밍 반영)
    const tickResult = runTickBasedSimulation(me, enemy, { deterministic: true })

    const myHpAfter60 = tickResult.myHpAfter60
    const enemyHpAfter60 = tickResult.enemyHpAfter60
    const myRemovedPercent = tickResult.myRemovedPercent
    const enemyRemovedPercent = tickResult.enemyRemovedPercent
    const winner = tickResult.winner

    const myActiveDuration = Math.max(
      0,
      MATCH_DURATION_SEC - getAttackStartDelay(me.weaponType, enemy.weaponType),
    )
    const enemyActiveDuration = Math.max(
      0,
      MATCH_DURATION_SEC - getAttackStartDelay(enemy.weaponType, me.weaponType),
    )

    let winnerLabel = '입력 값을 더 채워주세요.'
    if (meComputed.maxHP <= 0 || enemyComputed.maxHP <= 0) {
      winnerLabel = '총 피해·총 체력을 입력해 주세요.'
    } else if (winner === 'draw') {
      winnerLabel = `무승부 (내가 깎은 비율 ${myRemovedPercent.toFixed(2)}%, 상대가 깎은 비율 ${enemyRemovedPercent.toFixed(2)}%)`
    } else if (winner === 'me') {
      winnerLabel = `내 승리 — 내가 상대 체력의 ${myRemovedPercent.toFixed(2)}% 감소, 상대가 내 체력의 ${enemyRemovedPercent.toFixed(2)}% 감소`
    } else if (winner === 'enemy') {
      winnerLabel = `상대 승리 — 상대가 내 체력의 ${enemyRemovedPercent.toFixed(2)}% 감소, 내가 상대 체력의 ${myRemovedPercent.toFixed(2)}% 감소`
    }

    const summary = [
      `60초 후 내 남은 체력: ${Math.round(myHpAfter60).toLocaleString('ko-KR')}`,
      `60초 후 상대 남은 체력: ${Math.round(enemyHpAfter60).toLocaleString('ko-KR')}`,
      `내가 깎은 비율: ${myRemovedPercent.toFixed(2)}% · 상대가 깎은 비율: ${enemyRemovedPercent.toFixed(2)}%`,
    ].join(' · ')

    const enemyHpRemoved = enemyComputed.maxHP - enemyHpAfter60
    const myHpRemoved = meComputed.maxHP - myHpAfter60
    const myNetDpsOnEnemy =
      myActiveDuration > 0 ? enemyHpRemoved / myActiveDuration : 0
    const enemyNetDpsOnMe =
      enemyActiveDuration > 0 ? myHpRemoved / enemyActiveDuration : 0

    return {
      me: meComputed,
      enemy: enemyComputed,
      myEffectiveDpsOnEnemy: meComputed.totalDpsWithoutBlock * (1 - enemyComputed.blockChance),
      enemyEffectiveDpsOnMe: enemyComputed.totalDpsWithoutBlock * (1 - meComputed.blockChance),
      myNetDpsOnEnemy,
      enemyNetDpsOnMe,
      timeToKillEnemySec:
        myNetDpsOnEnemy > 0 ? enemyComputed.maxHP / myNetDpsOnEnemy : null,
      timeToKillMeSec:
        enemyNetDpsOnMe > 0 ? meComputed.maxHP / enemyNetDpsOnMe : null,
      winner,
      winnerLabel,
      summary,
      myHpAfter60,
      enemyHpAfter60,
      myRemovedPercent,
      enemyRemovedPercent,
    }
  }, [me, enemy])

  const [batchResult, setBatchResult] = useState<LeagueBatchResult | null>(null)
  const [isBatchRunning, setIsBatchRunning] = useState(false)

  function runBatchSimulation(runCount: number = 1000) {
    if (isBatchRunning) return
    setIsBatchRunning(true)
    const meSnapshot = me
    const enemySnapshot = enemy
    setTimeout(() => {
      let meWins = 0
      let enemyWins = 0
      let draws = 0
      let sumMyHp = 0
      let sumEnemyHp = 0
      let sumMyRemoved = 0
      let sumEnemyRemoved = 0
      for (let i = 0; i < runCount; i++) {
        const r = runTickBasedSimulation(meSnapshot, enemySnapshot, {
          deterministic: false,
        })
        if (r.winner === 'me') meWins++
        else if (r.winner === 'enemy') enemyWins++
        else draws++
        sumMyHp += r.myHpAfter60
        sumEnemyHp += r.enemyHpAfter60
        sumMyRemoved += r.myRemovedPercent
        sumEnemyRemoved += r.enemyRemovedPercent
      }
      setBatchResult({
        meWins,
        enemyWins,
        draws,
        totalRuns: runCount,
        avgMyHpAfter60: sumMyHp / runCount,
        avgEnemyHpAfter60: sumEnemyHp / runCount,
        avgMyRemovedPercent: sumMyRemoved / runCount,
        avgEnemyRemovedPercent: sumEnemyRemoved / runCount,
      })
      setIsBatchRunning(false)
    }, 0)
  }

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
    batchResult,
    runBatchSimulation,
    isBatchRunning,
  }
}

