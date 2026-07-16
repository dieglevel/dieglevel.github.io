import type { IBaseEntity } from '@/shared/types/base-entity'

export interface IWallet_Category extends IBaseEntity {
  name: string
  icon: string | null
  color: string | null
  monthlyBudget: number
  archived: boolean

  totalAmount?: number
}
