import React from 'react'
import { Tooltip } from 'antd'

export interface Segment {
  key: string | number
  label: string
  value: number
  color: string
  /** Text hiển thị trong tooltip, vd "1.200.000 đ · 35%" */
  detail?: string
}

interface SegmentedBarProps {
  segments: Array<Segment>
  /** Đang hover mục nào (đồng bộ với danh sách bên dưới) */
  activeKey?: string | number | null
  onHover?: (key: string | number | null) => void
  height?: number
  ariaLabel: string
}

/**
 * Thanh tỉ trọng mảnh (part-to-whole), không in chữ trên thanh — danh sách
 * bên cạnh đã có tên + số tiền. Khe 2px giữa các đoạn, bo 4px ở hai đầu.
 */
export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  segments,
  activeKey = null,
  onHover,
  height = 10,
  ariaLabel,
}) => {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0)
  if (total <= 0) return null

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{ display: 'flex', gap: 2, height, width: '100%' }}
      onMouseLeave={() => onHover?.(null)}
    >
      {segments
        .filter((s) => s.value > 0)
        .map((s, i, arr) => (
          <Tooltip
            key={s.key}
            title={s.detail ? `${s.label}: ${s.detail}` : s.label}
          >
            <div
              onMouseEnter={() => onHover?.(s.key)}
              style={{
                flexGrow: s.value / total,
                flexBasis: 0,
                minWidth: 4,
                background: s.color,
                opacity: activeKey === null || activeKey === s.key ? 1 : 0.35,
                borderTopLeftRadius: i === 0 ? 4 : 0,
                borderBottomLeftRadius: i === 0 ? 4 : 0,
                borderTopRightRadius: i === arr.length - 1 ? 4 : 0,
                borderBottomRightRadius: i === arr.length - 1 ? 4 : 0,
                transition: 'opacity 0.15s ease',
                cursor: 'default',
              }}
            />
          </Tooltip>
        ))}
    </div>
  )
}
