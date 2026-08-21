import { transactionKeys } from './transaction.keys'
import type { IFinance_Transaction } from './transaction.type'
import type { IFinance_TransactionItem } from './transaction-item/transaction-item.type'
import type { Dayjs } from 'dayjs'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export type UpsertFinanceTransactionItemDto = Pick<
  IFinance_TransactionItem,
  'description' | 'amount'
> & {
  categoryId?: number | null
}

export type UpsertFinanceTransactionDto = Pick<
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
    financialTransactionItems?: Array<UpsertFinanceTransactionItemDto>
    date: Dayjs
    toWalletId?: number | null
    transferFee?: number
  }

export const useMutationTransaction = () => {
  const mTransaction_Create = useMutationPost<
    void,
    UpsertFinanceTransactionDto,
    'financial-transaction/create'
  >({
    endPoint: 'financial-transaction/create',
    queryKey: [transactionKeys.list(), transactionKeys.date()],
  })

  const mTransaction_Update = useMutationPost<
    void,
    UpsertFinanceTransactionDto,
    'financial-transaction/update/:id',
    { id: string }
  >({
    endPoint: 'financial-transaction/update/:id',
    queryKey: [
      transactionKeys.list(),
      transactionKeys.date(),
      transactionKeys.details(),
    ],
  })

  const mTransaction_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-transaction/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-transaction/delete/:id',
    queryKey: [
      transactionKeys.list(),
      transactionKeys.date(),
      transactionKeys.details(),
    ],
  })

  return {
    mTransaction_Create,
    mTransaction_Update,
    mTransaction_Delete,
  }
}
