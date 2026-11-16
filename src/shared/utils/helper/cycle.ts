import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

/**
 * Spending cycle helpers (mirror of BE `financial-setting/cycle.helper.ts`).
 * A cycle is identified by the month it starts in: with cycleStartDate = 10,
 * month "2026-11" covers 2026-11-10 .. 2026-12-09.
 */

export function normalizeCycleStartDate(value?: number | null): number {
  return Math.max(1, Math.min(31, Math.trunc(Number(value || 1))))
}

/** Day the cycle starts on in the given month (31 → 28/29 in February). */
function cycleDayIn(date: Dayjs, cycleStartDate: number): number {
  return Math.min(normalizeCycleStartDate(cycleStartDate), date.daysInMonth())
}

/** Start month of the cycle that contains `date` (defaults to today). */
export function getCycleMonth(
  cycleStartDate: number,
  date: Dayjs = dayjs(),
): Dayjs {
  const base =
    date.date() < cycleDayIn(date, cycleStartDate)
      ? date.subtract(1, 'month')
      : date
  return base.startOf('month')
}

/** Date-only range (YYYY-MM-DD) of the cycle starting in `month`. */
export function getCycleRange(
  month: Dayjs,
  cycleStartDate: number,
): { startDate: string; endDate: string } {
  const base = month.startOf('month')
  const next = base.add(1, 'month')
  const start = base.date(cycleDayIn(base, cycleStartDate))
  const nextStart = next.date(cycleDayIn(next, cycleStartDate))
  return {
    startDate: start.format('YYYY-MM-DD'),
    endDate: nextStart.subtract(1, 'day').format('YYYY-MM-DD'),
  }
}
