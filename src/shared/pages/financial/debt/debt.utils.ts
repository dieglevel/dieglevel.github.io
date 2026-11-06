import dayjs from 'dayjs'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_STATUS_ENUM,
} from '@/shared/api/financial/debt/debt.enum'

/** Số ngày trước hạn được coi là "sắp đến hạn" (khớp với BE dashboard) */
export const DUE_SOON_DAYS = 7

export const isActiveDebt = (d: IFinance_Debt) =>
  d.status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE

export const isReceivable = (d: IFinance_Debt) =>
  d.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING

/** Số ngày còn lại tới hạn (âm = quá hạn), null nếu không có hạn */
export const daysUntilDue = (
  d: Pick<IFinance_Debt, 'dueDate'>,
): number | null =>
  d.dueDate
    ? dayjs(d.dueDate).startOf('day').diff(dayjs().startOf('day'), 'day')
    : null

export type DueState =
  | { kind: 'none' }
  | { kind: 'overdue'; days: number }
  | { kind: 'today' }
  | { kind: 'soon'; days: number }
  | { kind: 'later'; date: string }

/** Trạng thái hạn trả — chỉ có ý nghĩa với khoản đang nợ */
export const getDueState = (d: Pick<IFinance_Debt, 'dueDate'>): DueState => {
  const days = daysUntilDue(d)
  if (days === null) return { kind: 'none' }
  if (days < 0) return { kind: 'overdue', days: -days }
  if (days === 0) return { kind: 'today' }
  if (days <= DUE_SOON_DAYS) return { kind: 'soon', days }
  return { kind: 'later', date: dayjs(d.dueDate).format('DD/MM/YYYY') }
}

export const isOverdue = (d: IFinance_Debt) =>
  isActiveDebt(d) && getDueState(d).kind === 'overdue'

const duePriority = (d: IFinance_Debt) => {
  const days = daysUntilDue(d)
  if (days === null || days > DUE_SOON_DAYS) return 2
  return days < 0 ? 0 : 1
}

/**
 * Thứ tự khoản đang nợ: quá hạn (lâu nhất trước) → sắp đến hạn (gần nhất trước)
 * → còn lại theo ngày tạo mới nhất. Cùng quy tắc với widget dashboard.
 */
export const compareActiveDebts = (a: IFinance_Debt, b: IFinance_Debt) => {
  const pa = duePriority(a)
  const pb = duePriority(b)
  if (pa !== pb) return pa - pb
  if (pa < 2) return String(a.dueDate).localeCompare(String(b.dueDate))
  return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
}

/** Khoản đã đóng: cập nhật gần nhất trước */
export const compareClosedDebts = (a: IFinance_Debt, b: IFinance_Debt) =>
  dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf()

export const paidInfo = (d: IFinance_Debt) => {
  const original = Number(d.originalAmount || 0)
  const outstanding = Number(d.outstandingAmount || 0)
  const paid = Math.max(0, original - outstanding)
  const percent = original > 0 ? Math.round((paid / original) * 100) : 0
  return { original, outstanding, paid, percent }
}

export const summarizeDebts = (debts: Array<IFinance_Debt>) => {
  const active = debts.filter(isActiveDebt)
  const sumOutstanding = (list: Array<IFinance_Debt>) =>
    list.reduce((s, d) => s + Number(d.outstandingAmount || 0), 0)

  const receivableDebts = active.filter(isReceivable)
  const payableDebts = active.filter((d) => !isReceivable(d))
  const receivable = sumOutstanding(receivableDebts)
  const payable = sumOutstanding(payableDebts)

  // Gốc / đã thu-trả: không tính khoản đã hủy
  const counted = debts.filter(
    (d) => d.status !== FINANCIAL_DEBT_STATUS_ENUM.CANCELLED,
  )
  const original = counted.reduce(
    (s, d) => s + Number(d.originalAmount || 0),
    0,
  )
  const paid = counted.reduce((s, d) => s + paidInfo(d).paid, 0)

  return {
    total: debts.length,
    activeCount: active.length,
    overdueCount: active.filter(isOverdue).length,
    receivable,
    receivableCount: receivableDebts.length,
    payable,
    payableCount: payableDebts.length,
    net: receivable - payable,
    original,
    paid,
    percent: original > 0 ? Math.round((paid / original) * 100) : 0,
  }
}
