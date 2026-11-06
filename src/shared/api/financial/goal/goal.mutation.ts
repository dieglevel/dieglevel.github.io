import { walletKeys } from '../wallet/wallet.keys'
import { dashboardKeys } from '../dashboard/dashboard.keys'
import { goalKeys } from './goal.keys'
import { goalHistoryKeys } from './goalHistory.keys'
import type { IFinance_Goal, UpsertFinanceGoalDto } from './goal.type'
import {
  useMutationDelete,
  useMutationPatch,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

/**
 * Mọi thao tác mục tiêu: làm mới danh sách/chi tiết/dự phóng, lịch sử,
 * số dư ví (góp/rút có thể đụng ví) và widget dashboard.
 */
export const GOAL_INVALIDATE_KEYS = [
  goalKeys.all,
  goalHistoryKeys.all,
  walletKeys.list(),
  dashboardKeys.all,
]

export interface CancelGoalDto {
  /** Hoàn toàn bộ số đã tích lũy vào ví này (bị chặn khi mục tiêu đang khóa) */
  refundWalletId?: number
}

type IdParams = { id: string | number }

/**
 * Mutations của Financial Goal:
 * create / update / delete (owner-scoped ở BE), cancel (+hoàn tiền), pause, resume.
 */
export const useMutationGoal = () => {
  const mGoal_Create = useMutationPost<
    IFinance_Goal,
    UpsertFinanceGoalDto,
    'financial-goal/create'
  >({
    endPoint: 'financial-goal/create',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoal_Update = useMutationPost<
    IFinance_Goal,
    Partial<UpsertFinanceGoalDto>,
    'financial-goal/update/:id',
    IdParams
  >({
    endPoint: 'financial-goal/update/:id',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoal_Delete = useMutationDelete<
    void,
    void,
    'financial-goal/delete/:id',
    IdParams
  >({
    endPoint: 'financial-goal/delete/:id',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoal_Cancel = useMutationPatch<
    IFinance_Goal,
    CancelGoalDto,
    'financial-goal/:id/cancel',
    IdParams
  >({
    endPoint: 'financial-goal/:id/cancel',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoal_Pause = useMutationPatch<
    IFinance_Goal,
    void,
    'financial-goal/:id/pause',
    IdParams
  >({
    endPoint: 'financial-goal/:id/pause',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  const mGoal_Resume = useMutationPatch<
    IFinance_Goal,
    void,
    'financial-goal/:id/resume',
    IdParams
  >({
    endPoint: 'financial-goal/:id/resume',
    queryKey: GOAL_INVALIDATE_KEYS,
  })

  return {
    mGoal_Create,
    mGoal_Update,
    mGoal_Delete,
    mGoal_Cancel,
    mGoal_Pause,
    mGoal_Resume,
  }
}
