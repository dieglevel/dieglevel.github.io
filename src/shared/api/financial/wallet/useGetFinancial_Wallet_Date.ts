import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Wallet } from './wallet.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetFinance_Wallet_Date_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Wallet>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Wallet_Date = (
  props: GetFinance_Wallet_Date_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_Wallet>>,
    '/financial-wallet/with-transaction-count'
  >({
    endPoint: `/financial-wallet/with-transaction-count`,
    queryKey: ['getFinanceWalletDate'],
    ...props,
  })
