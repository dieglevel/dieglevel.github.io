import React from 'react'

interface SparklineProps {
  values: Array<number>
  color: string
  height?: number
  /** Nhãn cho trình đọc màn hình; sparkline chỉ minh họa xu hướng, con số nằm ở tile */
  ariaLabel: string
}

/** Đường xu hướng mảnh 2px cho stat tile — không trục, không tooltip */
export const Sparkline: React.FC<SparklineProps> = ({
  values,
  color,
  height = 36,
  ariaLabel,
}) => {
  if (values.length < 2) return <div style={{ height }} />

  const W = 120
  const pad = 3
  const max = Math.max(...values)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const x = (i: number) => (i / (values.length - 1)) * W
  const y = (v: number) => pad + (1 - (v - min) / range) * (height - pad * 2)

  const line = values
    .map(
      (v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`,
    )
    .join(' ')
  const area = `${line} L${W},${height} L0,${height} Z`

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d={area} fill={color} opacity={0.12} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
