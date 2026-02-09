import { useMemo, useState } from 'react'
import { safeNumber } from '../utils'
import type {
  RegenHistoryEntry,
  LifestealHistoryEntry,
  CombinedHistoryEntry,
} from '../types'

export function useHealCalculator() {
  const [regenPercent, setRegenPercent] = useState('')
  const [totalHPInput, setTotalHPInput] = useState('')
  const [regenHistory, setRegenHistory] = useState<RegenHistoryEntry[]>([])

  const [lifestealPercent, setLifestealPercent] = useState('')
  const [actualDamageInput, setActualDamageInput] = useState('')
  const [attackSpeedPercent, setAttackSpeedPercent] = useState('')
  const [lifestealTotalHPInput, setLifestealTotalHPInput] = useState('')
  const [lifestealHistory, setLifestealHistory] = useState<LifestealHistoryEntry[]>([])

  const [combinedRegenPercent, setCombinedRegenPercent] = useState('')
  const [combinedTotalHPInput, setCombinedTotalHPInput] = useState('')
  const [combinedLifestealPercent, setCombinedLifestealPercent] = useState('')
  const [combinedActualDamageInput, setCombinedActualDamageInput] = useState('')
  const [combinedAttackSpeedPercent, setCombinedAttackSpeedPercent] = useState('')
  const [combinedHistory, setCombinedHistory] = useState<CombinedHistoryEntry[]>([])

  const regenResult = useMemo(() => {
    const regen = safeNumber(regenPercent)
    const totalHP = safeNumber(totalHPInput)
    if (regen === 0 || totalHP === 0) return 0
    return Math.round((regen * totalHP / 100) * 100) / 100
  }, [regenPercent, totalHPInput])

  const lifestealResult = useMemo(() => {
    const ls = safeNumber(lifestealPercent)
    const dmg = safeNumber(actualDamageInput)
    const asp = safeNumber(attackSpeedPercent)
    if (ls === 0 || dmg === 0) return 0
    const v = (1.7 * ls * dmg * (100 + asp)) / 5500
    return Math.round(v * 100) / 100
  }, [lifestealPercent, actualDamageInput, attackSpeedPercent])

  const regenRecoveryPercent = useMemo(() => {
    const totalHP = safeNumber(totalHPInput)
    if (totalHP <= 0 || regenResult <= 0) return null
    return Math.round((regenResult / totalHP) * 10000) / 100
  }, [regenResult, totalHPInput])

  const lifestealRecoveryPercent = useMemo(() => {
    const totalHP = safeNumber(lifestealTotalHPInput)
    if (totalHP <= 0 || lifestealResult <= 0) return null
    return Math.round((lifestealResult / totalHP) * 10000) / 100
  }, [lifestealResult, lifestealTotalHPInput])

  const combinedResult = useMemo(() => {
    const regen = safeNumber(combinedRegenPercent)
    const totalHP = safeNumber(combinedTotalHPInput)
    const ls = safeNumber(combinedLifestealPercent)
    const dmg = safeNumber(combinedActualDamageInput)
    const asp = safeNumber(combinedAttackSpeedPercent)
    const regenPart = (regen * totalHP) / 100
    const lifestealPart =
      ls === 0 || dmg === 0 ? 0 : (1.7 * ls * dmg * (100 + asp)) / 5500
    return Math.round((regenPart + lifestealPart) * 100) / 100
  }, [
    combinedRegenPercent,
    combinedTotalHPInput,
    combinedLifestealPercent,
    combinedActualDamageInput,
    combinedAttackSpeedPercent,
  ])

  const combinedRecoveryPercent = useMemo(() => {
    const totalHP = safeNumber(combinedTotalHPInput)
    if (totalHP <= 0 || combinedResult <= 0) return null
    return Math.round((combinedResult / totalHP) * 10000) / 100
  }, [combinedResult, combinedTotalHPInput])

  const saveRegen = () => {
    if (regenResult > 0) {
      setRegenHistory((prev) =>
        [
          {
            regenPercent: safeNumber(regenPercent),
            totalHP: safeNumber(totalHPInput),
            result: regenResult,
          },
          ...prev,
        ].slice(0, 5),
      )
    }
  }

  const saveLifesteal = () => {
    if (lifestealResult > 0) {
      setLifestealHistory((prev) =>
        [
          {
            lifestealPercent: safeNumber(lifestealPercent),
            actualDamage: safeNumber(actualDamageInput),
            attackSpeedPercent: safeNumber(attackSpeedPercent),
            result: lifestealResult,
            totalHP: safeNumber(lifestealTotalHPInput),
          },
          ...prev,
        ].slice(0, 5),
      )
    }
  }

  const saveCombined = () => {
    if (combinedResult > 0) {
      setCombinedHistory((prev) =>
        [
          {
            regenPercent: safeNumber(combinedRegenPercent),
            totalHP: safeNumber(combinedTotalHPInput),
            lifestealPercent: safeNumber(combinedLifestealPercent),
            actualDamage: safeNumber(combinedActualDamageInput),
            attackSpeedPercent: safeNumber(combinedAttackSpeedPercent),
            result: combinedResult,
          },
          ...prev,
        ].slice(0, 5),
      )
    }
  }

  return {
    regen: {
      regenPercent,
      setRegenPercent,
      totalHPInput,
      setTotalHPInput,
      regenResult,
      regenRecoveryPercent,
      regenHistory,
      saveRegen,
    },
    lifesteal: {
      lifestealPercent,
      setLifestealPercent,
      actualDamageInput,
      setActualDamageInput,
      attackSpeedPercent,
      setAttackSpeedPercent,
      lifestealTotalHPInput,
      setLifestealTotalHPInput,
      lifestealResult,
      lifestealRecoveryPercent,
      lifestealHistory,
      saveLifesteal,
    },
    combined: {
      combinedRegenPercent,
      setCombinedRegenPercent,
      combinedTotalHPInput,
      setCombinedTotalHPInput,
      combinedLifestealPercent,
      setCombinedLifestealPercent,
      combinedActualDamageInput,
      setCombinedActualDamageInput,
      combinedAttackSpeedPercent,
      setCombinedAttackSpeedPercent,
      combinedResult,
      combinedRecoveryPercent,
      combinedHistory,
      saveCombined,
    },
  }
}
