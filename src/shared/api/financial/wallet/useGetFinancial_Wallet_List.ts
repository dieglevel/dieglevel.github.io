import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IWallet_Wallet } from './wallet.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetWallet_Wallet_List_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IWallet_Wallet>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_Wallet_List = (props: GetWallet_Wallet_List_Params) =>
  useQueryGet<
    ApiBaseResponse<Array<IWallet_Wallet>>,
    '/financial-wallet/with-transaction-count'
  >({
    endPoint: `/financial-wallet/with-transaction-count`,
    queryKey: ['getFinancialWalletList'],
    ...props,
  })
