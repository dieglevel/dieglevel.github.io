import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_WalletTransfer } from './wallet-transfer.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetWallet_WalletTransfer_Date_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_WalletTransfer>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_WalletTransfer_Date = (
  props: GetWallet_WalletTransfer_Date_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_WalletTransfer>>,
    '/financial-wallet-transfer'
  >({
    endPoint: `/financial-wallet-transfer`,
    queryKey: ['getFinancialWalletList', 'getFinancialWalletTransferList'],
    ...props,
  })
