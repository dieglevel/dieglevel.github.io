import type { IBaseEntity } from '@/shared/types/base-entity'
import type { IFinance_Wallet } from '../wallet.type'

export interface IFinance_WalletTransfer extends IBaseEntity {
  fromWallet: IFinance_Wallet
  toWallet: IFinance_Wallet
  amount: number
  transferFee: number
}
