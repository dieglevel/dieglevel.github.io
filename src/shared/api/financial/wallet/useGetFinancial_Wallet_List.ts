import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Wallet } from './wallet.type'
import { walletKeys } from './wallet.keys'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetFinance_Wallet_List_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Wallet>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Wallet_List = (
  props: GetFinance_Wallet_List_Params,
) =>
  useQueryGet<ApiBaseResponse<Array<IFinance_Wallet>>, '/financial-wallet/all'>(
    {
      endPoint: `/financial-wallet/all`,
      queryKey: walletKeys.list(),
      ...props,
    },
  )
