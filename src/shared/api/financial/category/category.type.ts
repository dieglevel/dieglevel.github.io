import type { IBaseEntity } from '@/shared/types/base-entity'
import type {
  FINANCIAL_CATEGORY_SPENDING_NATURE,
  FINANCIAL_CATEGORY_TYPE,
} from './category.enum'
import type { IFinance_AdvanceTransaction } from '../transaction/advance-transaction/advance-transaction.type'
import type { User } from '@/shared/auth/auth.type'

export interface IFinance_Category extends IBaseEntity {
  name: string
  icon: string
  color: string
  type: FINANCIAL_CATEGORY_TYPE
  monthlyBudget: number | null
  archived: boolean
  spendingNature: FINANCIAL_CATEGORY_SPENDING_NATURE | null
  parent?: IFinance_Category | null
  parentId?: number | null
  children?: Array<IFinance_Category>
  advanceTransactions?: Array<IFinance_AdvanceTransaction>
  account?: User

  totalAmount?: number
}
