import type { IBaseEntity } from '@/shared/types/base-entity'
import type { IWallet_Wallet } from '../wallet/wallet.type'

export interface IWallet_WalletTransfer extends IBaseEntity {
  fromWallet: IWallet_Wallet
  toWallet: IWallet_Wallet
  amount: number
  transferFee: number
}
