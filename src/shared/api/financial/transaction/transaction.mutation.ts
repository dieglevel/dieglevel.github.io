import type { IFinance_Transaction } from './transaction.type'
import type { IFinance_TransactionItem } from './transaction-item/transaction-item.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export type CreateFinanceTransactionItemDto = Pick<
  IFinance_TransactionItem,
  'description' | 'amount'
> & {
  categoryId?: number | null
}

// DTO cho Transaction: Lấy các trường từ Entity, biến các trường tùy chọn thành optional (?)
export type CreateFinanceTransactionDto = Pick<
  IFinance_Transaction,
  'amount' | 'type' | 'walletId'
> &
  Partial<
    Pick<
      IFinance_Transaction,
      | 'description'
      | 'merchant'
      | 'location'
      | 'receiptImageUrl'
      | 'status'
      | 'originalTransactionId'
    >
  > & {
    financialTransactionItems?: Array<CreateFinanceTransactionItemDto>
  }

export const useMutationTransaction = () => {
  const mTransaction_Create = useMutationPost<
    void,
    CreateFinanceTransactionDto,
    'financial-transaction/create'
  >({
    endPoint: 'financial-transaction/create',
    queryKey: ['getFinanceTransactionList'],
  })

  const mTransaction_Update = useMutationPost<
    void,
    Partial<Omit<IFinance_Transaction, 'id' | 'created_at'>>,
    'financial-transaction/update/:id',
    { id: string }
  >({
    endPoint: 'financial-transaction/update/:id',
    queryKey: ['getFinanceTransactionList'],
  })

  const mTransaction_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-transaction/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-transaction/delete/:id',
    queryKey: ['getFinanceTransactionList'],
  })

  return {
    mTransaction_Create,
    mTransaction_Update,
    mTransaction_Delete,
  }
}
