import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBasePaginationRequest } from '@/shared/types/base-request'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IWallet_WalletTransfer } from './wallet-transfer.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetWallet_WalletTransfer_List_Params {
  queryParams?: {} & ApiBasePaginationRequest

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IWallet_WalletTransfer>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_WalletTransfer_List = (
  props: GetWallet_WalletTransfer_List_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IWallet_WalletTransfer>>,
    '/financial-wallet-transfer'
  >({
    endPoint: `/financial-wallet-transfer`,
    queryKey: ['getFinancialWalletList', 'getFinancialWalletTransferList'],
    ...props,
  })
