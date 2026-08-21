import type { IBaseEntity } from '@/shared/types/base-entity'
import type { User } from '@/shared/auth/auth.type'
import type {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_HISTORY_TYPE_ENUM,
  FINANCIAL_DEBT_STATUS_ENUM,
  FINANCIAL_DEBT_TYPE_ENUM,
} from './debt.enum'

export interface IFinance_Debt extends IBaseEntity {
  name: string
  namePerson: string
  type: FINANCIAL_DEBT_TYPE_ENUM
  originalAmount: number
  outstandingAmount: number
  direction: FINANCIAL_DEBT_DIRECTION_ENUM
  status: FINANCIAL_DEBT_STATUS_ENUM
  dueDate?: string | Date | null
  note?: string | null
  accountId: number
  account?: User
  startDate: string | Date
}

export interface IFinance_DebtHistory extends IBaseEntity {
  debtId: number
  type: FINANCIAL_DEBT_HISTORY_TYPE_ENUM
  amount: number
  previousOutstandingAmount: number
  outstandingAmount: number
  note?: string | null
}

export interface IFinance_DebtPayment_Request {
  walletId: number
  amount: number
  note?: string
}

export interface IFinance_DebtAdjust_Request {
  outstandingAmount: number
  note?: string
}

export interface IFinance_DebtAction_Request {
  note?: string
}
