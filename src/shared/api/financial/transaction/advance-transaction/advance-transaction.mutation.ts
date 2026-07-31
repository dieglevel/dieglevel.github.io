import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export interface FinancialAdvanceTransaction_Create_Request {
  data: Array<{
    description: string
    amount: number
  }>
  type: string
  description: string
  categoryId?: number
  walletId: number
  status: string
  date: string
}

export const useMutationAdvanceTransaction = () => {
  const mAdvanceTransaction_Create = useMutationPost<
    void,
    FinancialAdvanceTransaction_Create_Request,
    'financial-advance-transactions/create'
  >({
    endPoint: 'financial-advance-transactions/create',
    queryKey: ['getFinancialTransactionList'],
  })

  return {
    mAdvanceTransaction_Create,
  }
}
