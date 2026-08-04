import type { IBaseEntity } from '@/shared/types/base-entity'
import type { FINANCIAL_WALLET_TYPE } from './wallet.enum'
import type { IFinance_Transaction } from '../transaction/transaction.type'
import type { User } from '@/shared/auth/auth.type'

export interface IFinance_Wallet extends IBaseEntity {
  name: string
  type: FINANCIAL_WALLET_TYPE
  icon: string
  color: string
  balance: number

  institutionName: null | string
  accountNumberMasked: null | string
  creditLimit: null | number
  currentDebt: null | number
  statementDay: null | number
  dueDay: null | number
  isLockedForDailySpending: boolean

  transactions?: Array<IFinance_Transaction>
  account?: User

  totalAmount?: number
}
