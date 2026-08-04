import type { IFinance_Category } from './category.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationFinanceCategory = () => {
  const mCategory_Create = useMutationPost<
    void,
    Omit<IFinance_Category, 'id' | 'created_at'>,
    'financial-category/create'
  >({
    endPoint: 'financial-category/create',
    queryKey: ['getFinancialCategoryCount'],
  })

  const mCategory_Update = useMutationPost<
    void,
    Partial<Omit<IFinance_Category, 'id' | 'created_at'>>,
    'financial-category/update/:id',
    { id: string }
  >({
    endPoint: 'financial-category/update/:id',
    queryKey: ['getFinancialCategoryCount'],
  })

  const mCategory_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-category/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-category/delete/:id',
    queryKey: ['getFinancialCategoryCount'],
  })

  return {
    mCategory_Create,
    mCategory_Update,
    mCategory_Delete,
  }
}
