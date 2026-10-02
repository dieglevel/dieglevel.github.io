import { useMemo } from 'react'
import type { ThemeMode } from '@/shared/common/design-token'
import { getTokens } from '@/shared/common/design-token'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'

/* ============ Helpers thuần (không phụ thuộc React) ============ */

type RGB = [number, number, number]

/* Hỗ trợ #rgb, #rgba, #rrggbb, #rrggbbaa. Tên màu (red...) hoặc giá trị lỗi → null */
export const parseColor = (input?: string | null): RGB | null => {
  if (!input) return null
  let h = input.trim().replace('#', '')
  if (!/^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(h))
    return null
  if (h.length <= 4)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  const n = parseInt(h.slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const toHex = (rgb: RGB) =>
  '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

const luminance = ([r, g, b]: RGB) => {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const mix = (a: RGB, b: RGB, t: number): RGB =>
  a.map((v, i) => v + (b[i] - v) * t) as RGB

/* rgba() dùng được cả cho canvas / Chart.js (color-mix thì không) */
export const toRgba = (color: string, alpha: number) => {
  const rgb = parseColor(color)
  return rgb ? `rgba(${rgb.join(', ')}, ${alpha})` : color
}

/* Màu dự phòng nếu dữ liệu rỗng hoặc sai định dạng */
export const resolveColor = (
  color: string | undefined | null,
  mode: ThemeMode,
) => {
  const rgb = parseColor(color)
  return rgb ? toHex(rgb) : getTokens(mode).colors.neutral[400]
}

/* Chữ đặt trên nền `bg`: chọn trắng hoặc nâu đậm, cái nào tương phản hơn */
export const getReadableText = (bg: string) => {
  const rgb = parseColor(bg)
  if (!rgb) return '#FFFFFF'
  const light: RGB = [255, 255, 255]
  const dark = parseColor(getTokens('light').text.primary)!
  return contrast(rgb, light) >= contrast(rgb, dark) ? '#FFFFFF' : toHex(dark)
}

/* Chỉnh màu để đủ tương phản với nền của theme hiện tại.
 * Dark: pha dần với trắng; Light: pha dần với đen. min = 3 phù hợp cho icon/viền/chữ lớn. */
export const ensureContrast = (color: string, mode: ThemeMode, min = 3) => {
  const rgb = parseColor(color)
  const bg = parseColor(getTokens(mode).background.base)
  if (!rgb || !bg) return color
  const target: RGB = mode === 'dark' ? [255, 255, 255] : [0, 0, 0]
  for (let t = 0; t <= 1; t += 0.05) {
    const next = mix(rgb, target, t)
    if (contrast(next, bg) >= min) return toHex(next)
  }
  return toHex(target)
}

/* ============ Màu từ dữ liệu ============ */

/* Hàm thuần: gọi được ở mọi nơi (render của cột bảng, callback, cấu hình biểu đồ...) */
export const getEntityColors = (
  color: string | undefined | null,
  mode: ThemeMode,
) => {
  const fill = resolveColor(color, mode)
  return {
    fill, // màu gốc làm nền đặc (badge, thanh biểu đồ)
    onFill: getReadableText(fill), // chữ / icon đặt trên `fill`
    accent: ensureContrast(fill, mode), // chữ / icon / viền trên nền theme
    soft: toRgba(fill, mode === 'dark' ? 0.25 : 0.15), // nền nhạt kiểu tag
  }
}

/* Hook mỏng cho component bình thường: tự lấy mode từ theme */
export const useEntityColor = (color?: string | null) => {
  const { mode } = useThemeMode()
  return useMemo(() => getEntityColors(color, mode), [color, mode])
}

/* ============ Ví dụ ============

// Trong component:
const { fill, onFill, accent, soft } = useEntityColor(data?.color)

// Trong render của cột bảng / callback (không dùng được hook):
const { mode } = useThemeMode()           // 1 lần ở đầu component
...
render: (w) => { const { fill, onFill } = getEntityColors(w?.color, mode); ... }
*/
