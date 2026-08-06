import type {
  FINANCIAL_GOAL_HISTORY_SOURCE,
  FINANCIAL_GOAL_HISTORY_STATUS,
} from './goal-history.enum'
import type { IFinance_GoalHistory } from './goal-history.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export interface CreateGoalHistoryDto {
  goalId: number
  period: string
  plannedAmount?: number
  amount: number
  source?: FINANCIAL_GOAL_HISTORY_SOURCE
  status?: FINANCIAL_GOAL_HISTORY_STATUS
  note?: string
  completedAt?: string | Date
}
/**
 * Hook chứa tất cả mutations liên quan đến Financial Goal History
 * - Create: Tạo lịch sử/giao dịch tích lũy mới
 * - Update: Cập nhật thông tin lịch sử
 * - Delete: Xóa lịch sử
 */
export const useMutationGoalHistory = () => {
  // Tạo bản ghi lịch sử mục tiêu mới (Tích lũy / Nạp / Rút)
  const mGoalHistory_Create = useMutationPost<
    IFinance_GoalHistory,
    CreateGoalHistoryDto,
    'financial-goal-history/create'
  >({
    endPoint: 'financial-goal-history/create',
    queryKey: ['getFinanceGoalHistoryList', 'getFinanceGoalList'],
  })

  // Cập nhật bản ghi lịch sử mục tiêu
  const mGoalHistory_Update = useMutationPost<
    IFinance_GoalHistory,
    Partial<CreateGoalHistoryDto>,
    'financial-goal-history/update/:id',
    { id: string | number }
  >({
    endPoint: 'financial-goal-history/update/:id',
    queryKey: ['getFinanceGoalHistoryList', 'getFinanceGoalList'],
  })

  // Xóa bản ghi lịch sử mục tiêu
  const mGoalHistory_Delete = useMutationDelete<
    void,
    void,
    'financial-goal-history/delete/:id',
    { id: string | number }
  >({
    endPoint: 'financial-goal-history/delete/:id',
    queryKey: ['getFinanceGoalHistoryList', 'getFinanceGoalList'],
  })

  return {
    mGoalHistory_Create,
    mGoalHistory_Update,
    mGoalHistory_Delete,
  }
}
