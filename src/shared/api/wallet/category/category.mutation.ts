import type { IWallet_Category } from './category.type'
import {
  useMutationDelete,
  useMutationPatch,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationCategory = () => {
  const mCategory_Create = useMutationPost<
    void,
    Omit<IWallet_Category, 'id' | 'created_at'>,
    'rest/v1/financial_category'
  >({
    endPoint: 'rest/v1/financial_category',
    queryKey: ['getFinancialCategoryList'],
  })

  const mCategory_Update = useMutationPatch<
    void,
    Partial<Omit<IWallet_Category, 'id' | 'created_at'>>,
    'rest/v1/financial_category',
    { id: string }
  >({
    endPoint: 'rest/v1/financial_category',
    queryKey: ['getFinancialCategoryList'],
  })

  const mCategory_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'rest/v1/financial_category',
    { id: string }
  >({
    endPoint: 'rest/v1/financial_category',
    queryKey: ['getFinancialCategoryList'],
  })

  return {
    mCategory_Create,
    mCategory_Update,
    mCategory_Delete,
  }
}
