import type { IBaseEntity } from '@/shared/types/base-entity'
import type { IFinance_Transaction } from '../transaction.type'
import type { IFinance_Category } from '../../category/category.type'

export interface IFinance_AdvanceTransaction extends IBaseEntity {
  description: string
  amount: number
  transaction: IFinance_Transaction
  category: IFinance_Category | null
  categoryId: number | null
}
