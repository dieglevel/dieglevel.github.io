import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export interface FinanceAdvanceTransaction_Item {
  description: string
  amount: number
  categoryId?: number
}

export interface FinanceAdvanceTransaction_Create_Request {
  data: Array<FinanceAdvanceTransaction_Item>
  type: string
  description: string
  categoryId?: number
  walletId: number
  status: string
  date: string
  merchant?: string
  location?: string
  tags?: Array<string>
  receiptImageUrl?: string
  originalTransactionId?: number
}

export const useMutationAdvanceTransaction = () => {
  const mAdvanceTransaction_Create = useMutationPost<
    void,
    FinanceAdvanceTransaction_Create_Request,
    'financial-advance-transactions/create'
  >({
    endPoint: 'financial-advance-transactions/create',
    queryKey: ['getFinanceTransactionList'],
  })

  return {
    mAdvanceTransaction_Create,
  }
}
