import { K, M, B } from '../../constants'
import { safeNumber, formatWithUnit } from '../../utils'

type UnitInputProps = {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  showKmb?: boolean
}

export function UnitInput({
  id,
  label,
  placeholder = '예: 20120 또는 20.12',
  value,
  onChange,
  showKmb = true,
}: UnitInputProps) {
  const multipliers = showKmb
    ? [
        { label: 'k 단위 변경', mult: K },
        { label: 'm 단위 변경', mult: M },
        { label: 'b 단위 변경', mult: B },
      ]
    : []

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-buttons">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {multipliers.map(({ label: btnLabel, mult }) => (
          <button
            key={btnLabel}
            type="button"
            className="unit-btn"
            onClick={() => {
              const n = safeNumber(value) * mult
              onChange(n >= 1 ? String(n) : value)
            }}
          >
            {btnLabel}
          </button>
        ))}
      </div>
      {value.trim() && Number.isFinite(safeNumber(value)) && (
        <span className="field-hint">
          게임 표기: {formatWithUnit(safeNumber(value))}
        </span>
      )}
    </div>
  )
}
