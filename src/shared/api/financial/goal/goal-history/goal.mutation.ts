import { GOAL_INVALIDATE_KEYS } from '../goal.mutation'
import type { FINANCIAL_GOAL_STATUS } from '../goal.enum'
import type { IFinance_GoalHistory } from './goal-history.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export interface ManualContributionResponse {
  history: IFinance_GoalHistory
  currentAmount: number
  isCompleted: boolean
}

export interface GoalMoneyResponse {
  history: IFinance_GoalHistory
  currentAmount: number
  status: FINANCIAL_GOAL_STATUS
}

export interface CreateGoalHistoryDto {
  /** Không vượt quá số còn thiếu của mục tiêu */
  amount: number
  note?: string
  /** "YYYY-MM"; mặc định kỳ hiện tại */
  period?: string
  /** Trừ tiền từ ví này; bỏ trống = chỉ ghi sổ */
  walletId?: number
}

export interface CompleteGoalHistoryDto {
  amount: number
  note?: string
  /** Trừ tiền từ ví này; bỏ trống = chỉ ghi sổ */
  walletId?: number
}

export interface WithdrawGoalDto {
  /** Không vượt quá số đã tích lũy */
  amount: number
  note?: string
  /** Cộng tiền vào ví này; bỏ trống = chỉ ghi sổ */
  walletId?: number
}

/** Góp / rút / xác nhận / bỏ qua khoản góp của mục tiêu */
export const useMutationGoalHistory = () => {
  // customAxios trả về body đã bọc { data } bởi ResponseInterceptor của BE
  const mGoalHistory_ManualContribution = useMutationPost<
    ApiBaseResponse<ManualContributionResponse>,
    CreateGoalHistoryDto,
    'financial-goal/:id/manual-contribution',
    { id: string | number }
  >({
    endPoint: 'financial-goal/:id/manual-contribution',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoalHistory_Withdraw = useMutationPost<
    ApiBaseResponse<GoalMoneyResponse>,
    WithdrawGoalDto,
    'financial-goal/:id/withdraw',
    { id: string | number }
  >({
    endPoint: 'financial-goal/:id/withdraw',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoalHistory_Complete = useMutationPost<
    ApiBaseResponse<GoalMoneyResponse>,
    CompleteGoalHistoryDto,
    'financial-goal/history/:historyId/complete',
    { historyId: string | number }
  >({
    endPoint: 'financial-goal/history/:historyId/complete',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoalHistory_Skip = useMutationPost<
    IFinance_GoalHistory,
    void,
    'financial-goal/history/:historyId/skip',
    { historyId: string | number }
  >({
    endPoint: 'financial-goal/history/:historyId/skip',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  return {
    mGoalHistory_ManualContribution,
    mGoalHistory_Withdraw,
    mGoalHistory_Complete,
    mGoalHistory_Skip,
  }
}
