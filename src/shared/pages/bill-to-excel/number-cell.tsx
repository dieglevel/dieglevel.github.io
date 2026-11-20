import { useState } from 'react'
import { Input, Tooltip } from 'antd'
import { evaluateExpression } from './bill.utils'

interface Props {
  value: number
  onChange: (value: number) => void
  format: (value: number) => string
  suffix?: string
  disabled?: boolean
}

/**
 * Ô số sửa trực tiếp. Khi không focus hiển thị dạng đã định dạng;
 * khi gõ nhận biểu thức ("145000/3") hoặc toán tử áp lên giá trị hiện tại ("/2").
 * Enter / blur để áp dụng, Esc để huỷ.
 */
export function NumberCell({
  value,
  onChange,
  format,
  suffix,
  disabled,
}: Props) {
  const [draft, setDraft] = useState<string | null>(null)
  const editing = draft !== null
  const result = editing ? evaluateExpression(draft, value) : value
  const invalid = editing && draft.trim() !== '' && result === null

  const commit = () => {
    if (draft !== null && result !== null && result !== value) onChange(result)
    setDraft(null)
  }

  return (
    <Tooltip
      open={editing && draft.trim() !== '' && draft !== String(value)}
      title={invalid ? 'Biểu thức không hợp lệ' : `= ${format(result ?? 0)}`}
      placement="top"
    >
      <Input
        size="small"
        variant={editing ? 'outlined' : 'borderless'}
        status={invalid ? 'error' : undefined}
        disabled={disabled}
        value={editing ? draft : format(value)}
        suffix={suffix && !editing ? suffix : undefined}
        styles={{ input: { textAlign: 'right' } }}
        onFocus={(e) => {
          setDraft(String(Number(value.toFixed(3))))
          const input = e.target
          requestAnimationFrame(() => input.select())
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') {
            setDraft(null)
            e.currentTarget.blur()
          }
        }}
      />
    </Tooltip>
  )
}
