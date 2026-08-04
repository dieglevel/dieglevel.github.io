import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export interface FinancialAdvanceTransaction_Item {
  description: string
  amount: number
  categoryId?: number
}

export interface FinancialAdvanceTransaction_Create_Request {
  data: Array<FinancialAdvanceTransaction_Item>
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
