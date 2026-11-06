import dayjs from 'dayjs'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_STATUS,
} from '@/shared/api/financial/goal/goal.enum'

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

/** Số tiền / % — cùng công thức với FinancialGoalService (BE) */
export const goalAmounts = (goal: IFinance_Goal) => {
  const target = Number(goal.targetAmount || 0)
  const current = Number(goal.currentAmount || 0)
  const remaining = Math.max(0, round2(target - current))
  const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0
  return { target, current, remaining, percent }
}

/**
 * Số tháng ước tính để đủ tiền — chỉ tính với AUTO (giống BE getProjection
 * khi không truyền monthlySavingRate). MANUAL → null.
 */
export const estimateMonths = (goal: IFinance_Goal): number | null => {
  const { remaining } = goalAmounts(goal)
  if (remaining === 0) return 0
  const monthly =
    goal.savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO
      ? Number(goal.autoContributionAmount || 0)
      : 0
  return monthly > 0 ? Math.ceil(remaining / monthly) : null
}

/** Số ngày tới hạn (âm = quá hạn), null nếu không có hạn */
export const daysToDeadline = (goal: IFinance_Goal): number | null =>
  goal.deadline
    ? dayjs(goal.deadline).startOf('day').diff(dayjs().startOf('day'), 'day')
    : null

/** Góp được khi đang thực hiện và còn thiếu tiền */
export const canContribute = (goal: IFinance_Goal) =>
  goal.status === FINANCIAL_GOAL_STATUS.ACTIVE &&
  goalAmounts(goal).remaining > 0

/** Rút được khi chưa hủy và còn tiền (khóa rút tiền kiểm tra riêng) */
export const canWithdraw = (goal: IFinance_Goal) =>
  goal.status !== FINANCIAL_GOAL_STATUS.CANCELLED &&
  Number(goal.currentAmount) > 0

export const canCancel = (goal: IFinance_Goal) =>
  goal.status === FINANCIAL_GOAL_STATUS.ACTIVE ||
  goal.status === FINANCIAL_GOAL_STATUS.INACTIVE
