import { categoryKeys } from './category.keys'
import { useMutationPut } from '@/shared/lib/api/mutation/useMutation'

export interface IFinance_Category_Budget {
  categoryId: number
  month: string
  amount: number | null
}

export const useMutationFinance_Category_Budget = () =>
  useMutationPut<
    IFinance_Category_Budget,
    { month: string; amount: number | null },
    'financial-category/budget/:categoryId',
    { categoryId: string }
  >({
    endPoint: 'financial-category/budget/:categoryId',
    queryKey: [categoryKeys.list()],
  })
