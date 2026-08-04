import type { IBaseEntity } from '@/shared/types/base-entity'
import type {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from './transaction.enum'
import type { IFinance_Wallet } from '../wallet/wallet.type'
import type { IFinance_AdvanceTransaction } from './advance-transaction/advance-transaction.type'
import type { User } from '@/shared/auth/auth.type'

export interface IFinance_Transaction extends IBaseEntity {
  description: string | null
  merchant: string | null
  location: string | null
  tags: Array<string> | null
  receiptImageUrl: string | null
  amount: number
  type: FINANCIAL_TRANSACTION_TYPE
  status: FINANCIAL_TRANSACTION_STATUS

  wallet?: IFinance_Wallet
  originalTransaction?: IFinance_Transaction
  account: User
  financialAdvanceTransactions?: Array<IFinance_AdvanceTransaction>
}
