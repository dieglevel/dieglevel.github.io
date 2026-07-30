import type { IBaseEntity } from '@/shared/types/base-entity'

export interface IWallet_Advance_Transaction extends IBaseEntity {
  description: string
  amount: number
}
