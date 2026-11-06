import type { ThemeMode } from '@/shared/common/design-token'

/**
 * Màu biểu đồ dashboard — đã chạy qua bộ kiểm tra palette (dataviz skill):
 * lightness band, chroma, tách màu cho người mù màu (CVD), tương phản trên nền card.
 *
 * Thu/Chi dùng cặp xanh dương ↔ cam (ấm/lạnh). Cặp xanh lá ↔ đỏ cũ
 * (#16a34a/#dc2626) TRƯỢT kiểm tra CVD (ΔE 5.0 với deutan) nên không dùng cho biểu đồ.
 */
const FLOW = {
  light: { income: '#2a78d6', expense: '#eb6834' },
  dark: { income: '#3987e5', expense: '#d95926' },
} as const

/** Thứ tự cố định — không xoay vòng. Quá 5 mục thì gộp vào "Khác". */
const CATEGORICAL = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'],
} as const

const OTHER = { light: '#a3a3a3', dark: '#737373' } as const

/** Màu đơn sắc cho meter / tiến độ (một hue, không đổi màu theo mức) */
const METER = {
  light: { fill: '#2a78d6', track: '#e8eef7' },
  dark: { fill: '#3987e5', track: '#2b3340' },
} as const

export const MAX_CATEGORY_SLOTS = CATEGORICAL.light.length

export const getVizColors = (mode: ThemeMode) => ({
  ...FLOW[mode],
  categorical: CATEGORICAL[mode],
  other: OTHER[mode],
  meter: METER[mode],
  /** Lưới/trục: hairline liền, nhạt hơn nền một bậc */
  grid: mode === 'dark' ? '#3a2a22' : '#efe7e1',
  axis: mode === 'dark' ? '#b8a396' : '#735a4c',
})

/** 1.250.000 → "1,3M"; 45.000 → "45k" — cho trục/nhãn gọn */
export const formatCompact = (value: number) => {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${Math.round(value / 1_000)}k`
  return `${Math.round(value)}`
}
