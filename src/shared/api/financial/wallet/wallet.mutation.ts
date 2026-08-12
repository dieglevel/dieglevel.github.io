import type { IFinance_Wallet } from './wallet.type'
import { walletKeys } from './wallet.keys'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationWallet = () => {
  const mWallet_Create = useMutationPost<
    void,
    Partial<Omit<IFinance_Wallet, 'id' | 'created_at'>>,
    'financial-wallet/create'
  >({
    endPoint: 'financial-wallet/create',
    queryKey: [walletKeys.list(), walletKeys.date()],
  })

  const mWallet_Update = useMutationPost<
    void,
    Partial<Omit<IFinance_Wallet, 'id' | 'created_at'>>,
    'financial-wallet/update/:id',
    { id: string }
  >({
    endPoint: 'financial-wallet/update/:id',
    queryKey: [walletKeys.list(), walletKeys.date()],
  })

  const mWallet_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-wallet/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-wallet/delete/:id',
    queryKey: [walletKeys.list(), walletKeys.date()],
  })

  const mWallet_Transfer = useMutationPost<
    { message: string },
    {
      fromWalletId: number
      toWalletId: number
      amount: number
      transferFee: number
    },
    'financial-wallet/transfer'
  >({
    endPoint: 'financial-wallet/transfer',
    queryKey: [walletKeys.list(), walletKeys.date()],
  })

  return {
    mWallet_Create,
    mWallet_Update,
    mWallet_Delete,
    mWallet_Transfer,
  }
}
