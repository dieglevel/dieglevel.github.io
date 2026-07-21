import type { IWallet_Transaction } from './transaction.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationTransaction = () => {
  const mTransaction_Create = useMutationPost<
    void,
    Omit<IWallet_Transaction, 'id' | 'created_at'>,
    'financial-transaction/create'
  >({
    endPoint: 'financial-transaction/create',
    queryKey: ['getFinancialTransactionList'],
  })

  const mTransaction_Update = useMutationPost<
    void,
    Partial<Omit<IWallet_Transaction, 'id' | 'created_at'>>,
    'financial-transaction/update/:id',
    { id: string }
  >({
    endPoint: 'financial-transaction/update/:id',
    queryKey: ['getFinancialTransactionList'],
  })

  const mTransaction_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-transaction/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-transaction/delete/:id',
    queryKey: ['getFinancialTransactionList'],
  })

  return {
    mTransaction_Create,
    mTransaction_Update,
    mTransaction_Delete,
  }
}
