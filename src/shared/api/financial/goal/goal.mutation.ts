import type { IFinance_Goal } from './goal.type'
import { goalKeys } from './goal.keys'
import {
  useMutationDelete,
  useMutationPatch,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

/**
 * Hook chứa tất cả mutations liên quan đến Financial Goal
 * - Create: Tạo mục tiêu mới
 * - Update: Cập nhật mục tiêu
 * - Delete: Xóa mục tiêu
 */
export const useMutationGoal = () => {
  // Tạo mục tiêu mới
  const mGoal_Create = useMutationPost<
    IFinance_Goal, // Response type
    Omit<IFinance_Goal, 'id' | 'created_at' | 'updated_at' | 'accountId'>, // Request body type
    'financial-goal/create'
  >({
    endPoint: 'financial-goal/create',
    queryKey: [goalKeys.list()],
  })

  // Cập nhật mục tiêu hiện tại
  const mGoal_Update = useMutationPost<
    IFinance_Goal, // Response type
    Partial<
      Omit<IFinance_Goal, 'id' | 'created_at' | 'updated_at' | 'accountId'>
    >, // Request body type
    'financial-goal/update/:id',
    { id: string | number } // Path params type
  >({
    endPoint: 'financial-goal/update/:id',
    queryKey: [goalKeys.list(), goalKeys.details()],
  })

  // Xóa mục tiêu
  const mGoal_Delete = useMutationDelete<
    void, // Response type
    void, // Request body type (DELETE không cần body)
    'financial-goal/delete/:id',
    { id: string | number } // Path params type
  >({
    endPoint: 'financial-goal/delete/:id',
    queryKey: [goalKeys.list(), goalKeys.details()],
  })

  const mGoal_Cancel = useMutationPatch<
    IFinance_Goal,
    void,
    'financial-goal/:id/cancel',
    { id: string | number }
  >({
    endPoint: 'financial-goal/:id/cancel',
    queryKey: [[goalKeys.list()], [goalKeys.details()]],
  })

  return {
    mGoal_Create,
    mGoal_Update,
    mGoal_Delete,
    mGoal_Cancel,
  }
}
