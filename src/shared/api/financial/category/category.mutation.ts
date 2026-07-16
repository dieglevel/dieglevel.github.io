import type { IWallet_Category } from './category.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationCategory = () => {
  const mCategory_Create = useMutationPost<
    void,
    Omit<IWallet_Category, 'id' | 'created_at'>,
    'financial-category/create'
  >({
    endPoint: 'financial-category/create',
    queryKey: ['getFinancialCategoryList'],
  })

  const mCategory_Update = useMutationPost<
    void,
    Partial<Omit<IWallet_Category, 'id' | 'created_at'>>,
    'financial-category/update/:id',
    { id: string }
  >({
    endPoint: 'financial-category/update/:id',
    queryKey: ['getFinancialCategoryList'],
  })

  const mCategory_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-category/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-category/delete/:id',
    queryKey: ['getFinancialCategoryList'],
  })

  return {
    mCategory_Create,
    mCategory_Update,
    mCategory_Delete,
  }
}
