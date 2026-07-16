import type { IBaseEntity } from '@/shared/types/base-entity'
import type { FINANCIAL_WALLET_TYPE } from './wallet.enum'

export interface IWallet_Wallet extends IBaseEntity {
  name: string
  type: FINANCIAL_WALLET_TYPE
  icon: string
  color: string
  balance: number

  totalAmount?: number
}
