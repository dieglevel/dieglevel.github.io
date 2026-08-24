import { walletKeys } from '../wallet/wallet.keys'
import { debtKeys } from './debt.keys'
import type {
  IFinance_Debt,
  IFinance_DebtAction_Request,
  IFinance_DebtAdjust_Request,
  IFinance_DebtPayment_Request,
} from './debt.type'
import {
  useMutationDelete,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationFinanceDebt = () => {
  const mDebt_Create = useMutationPost<
    void,
    Omit<IFinance_Debt, 'id' | 'created_at'>,
    'financial-debt/create'
  >({
    endPoint: 'financial-debt/create',
    queryKey: [debtKeys.list(), walletKeys.list()],
  })

  const mDebt_Update = useMutationPost<
    void,
    Partial<Omit<IFinance_Debt, 'id' | 'created_at'>>,
    'financial-debt/update/:id',
    { id: string }
  >({
    endPoint: 'financial-debt/update/:id',
    queryKey: [debtKeys.list(), walletKeys.list()],
  })

  const mDebt_Delete = useMutationDelete<
    void,
    void,
    'financial-debt/delete/:id',
    { id: string }
  >({
    endPoint: 'financial-debt/delete/:id',
    queryKey: [debtKeys.list(), walletKeys.list()],
  })

  const mDebt_Payment = useMutationPost<
    void,
    IFinance_DebtPayment_Request,
    'financial-debt/:id/payment',
    { id: string }
  >({
    endPoint: 'financial-debt/:id/payment',
    queryKey: [debtKeys.list(), walletKeys.list()],
  })

  const mDebt_Adjust = useMutationPost<
    void,
    IFinance_DebtAdjust_Request,
    'financial-debt/:id/adjust',
    { id: string }
  >({
    endPoint: 'financial-debt/:id/adjust',
    queryKey: [debtKeys.list(), walletKeys.list()],
  })

  const mDebt_Settle = useMutationPost<
    void,
    IFinance_DebtAction_Request,
    'financial-debt/:id/settle',
    { id: string }
  >({
    endPoint: 'financial-debt/:id/settle',
    queryKey: [debtKeys.list()],
  })

  const mDebt_Cancel = useMutationPost<
    void,
    IFinance_DebtAction_Request,
    'financial-debt/:id/cancel',
    { id: string }
  >({
    endPoint: 'financial-debt/:id/cancel',
    queryKey: [debtKeys.list()],
  })

  return {
    mDebt_Create,
    mDebt_Update,
    mDebt_Delete,
    mDebt_Payment,
    mDebt_Adjust,
    mDebt_Settle,
    mDebt_Cancel,
  }
}
