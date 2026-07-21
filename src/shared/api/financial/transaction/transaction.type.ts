import type { IBaseEntity } from '@/shared/types/base-entity'
import type {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from './transaction.enum'
import type { IWallet_Wallet } from '../wallet/wallet.type'
import type { IWallet_Category } from '../category/category.type'

export interface IWallet_Transaction extends IBaseEntity {
  description: string
  amount: number
  type: FINANCIAL_TRANSACTION_TYPE
  status: FINANCIAL_TRANSACTION_STATUS

  wallet?: IWallet_Wallet
  category?: IWallet_Category
}
