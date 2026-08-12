import type { IFinance_GoalHistory } from './goal-history.type'
import { goalHistoryKeys } from '../goalHistory.keys'
import { goalKeys } from '../goal.keys'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export interface ManualContributionResponse {
  history: IFinance_GoalHistory
  currentAmount: number
  isCompleted: boolean
}

export interface CreateGoalHistoryDto {
  amount: number
  note?: string
  period?: string
}

export interface CompleteGoalHistoryDto {
  amount: number
  note?: string
}
/**
 * Backend hiện tại chỉ hỗ trợ ghi nhận contribution trực tiếp lên goal.
 */
export const useMutationGoalHistory = () => {
  const mGoalHistory_ManualContribution = useMutationPost<
    ManualContributionResponse,
    CreateGoalHistoryDto,
    'financial-goal/:id/manual-contribution',
    { id: string | number }
  >({
    endPoint: 'financial-goal/:id/manual-contribution',
    queryKey: [goalKeys.list(), goalKeys.details(), goalHistoryKeys.all],
  })

  const mGoalHistory_Complete = useMutationPost<
    {
      history: IFinance_GoalHistory
      currentAmount: number
      status: string
    },
    CompleteGoalHistoryDto,
    'financial-goal/history/:historyId/complete',
    { historyId: string | number }
  >({
    endPoint: 'financial-goal/history/:historyId/complete',
    queryKey: [
      [goalKeys.details()],
      [goalKeys.list()],
      [goalHistoryKeys.details()],
    ],
  })

  const mGoalHistory_Skip = useMutationPost<
    IFinance_GoalHistory,
    void,
    'financial-goal/history/:historyId/skip',
    { historyId: string | number }
  >({
    endPoint: 'financial-goal/history/:historyId/skip',
    queryKey: [
      [goalKeys.details()],
      [goalKeys.list()],
      [goalHistoryKeys.details()],
    ],
  })

  return {
    mGoalHistory_ManualContribution,
    mGoalHistory_Complete,
    mGoalHistory_Skip,
  }
}
