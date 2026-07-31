import type { IWallet_Wallet } from './wallet.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationWallet = () => {
  const mWallet_Create = useMutationPost<
    void,
    Partial<Omit<IWallet_Wallet, 'id' | 'created_at'>>,
    'financial-wallet/create'
  >({
    endPoint: 'financial-wallet/create',
    queryKey: ['getFinancialWalletList'],
  })

  const mWallet_Update = useMutationPost<
    void,
    Partial<Omit<IWallet_Wallet, 'id' | 'created_at'>>,
    'financial-wallet/update/:id',
    { id: string }
  >({
    endPoint: 'financial-wallet/update/:id',
    queryKey: ['getFinancialWalletList'],
  })

  const mWallet_Delete = useMutationDelete<
    void,
    void, // DELETE không cần body
    'financial-wallet/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-wallet/delete/:id',
    queryKey: ['getFinancialWalletList'],
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
    queryKey: ['getFinancialWalletList'],
  })

  return {
    mWallet_Create,
    mWallet_Update,
    mWallet_Delete,
    mWallet_Transfer,
  }
}
