import type { IWallet_Goal } from './goal.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationGoal = () => {
  const mGoal_Create = useMutationPost<
    void,
    Omit<IWallet_Goal, 'id' | 'created_at'>,
    'financial-goal/create'
  >({
    endPoint: 'financial-goal/create',
    queryKey: ['getFinancialGoalList'],
  })

  const mGoal_Update = useMutationPost<
    void,
    Partial<Omit<IWallet_Goal, 'id' | 'created_at'>>,
    'financial-goal/update/:id',
    { id: string }
  >({
    endPoint: 'financial-goal/update/:id',
    queryKey: ['getFinancialGoalList'],
  })

  const mGoal_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-goal/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-goal/delete/:id',
    queryKey: ['getFinancialGoalList'],
  })

  return {
    mGoal_Create,
    mGoal_Update,
    mGoal_Delete,
  }
}
