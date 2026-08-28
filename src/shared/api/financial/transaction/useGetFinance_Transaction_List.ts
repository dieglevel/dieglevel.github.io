import { keepPreviousData } from '@tanstack/react-query'
import { transactionKeys } from './transaction.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type dayjs from 'dayjs'
import type { IFinance_Transaction } from './transaction.type'
import type {
  ApiBaseResponse,
  ApiBaseResponseWithPagination,
} from '@/shared/types/base-response'
import type {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from './transaction.enum'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Định nghĩa Enum Sort (Nếu chưa có ở Frontend)
export enum FinancialTransactionSortBy {
  CREATED_AT = 'createdAt',
  AMOUNT = 'amount',
  TYPE = 'type',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Khai báo Interface cho Query Params gửi lên API
export interface GetFinance_Transaction_QueryParams {
  page?: number
  limit?: number
  search?: string
  type?: FINANCIAL_TRANSACTION_TYPE
  status?: FINANCIAL_TRANSACTION_STATUS
  walletId?: number
  minAmount?: number
  maxAmount?: number
  fromDate?: string | Date | dayjs.Dayjs
  toDate?: string | Date | dayjs.Dayjs
  sortBy?: FinancialTransactionSortBy | string
  sortOrder?: SortOrder | 'ASC' | 'DESC'
}

// Params cho Custom Hook
export interface GetFinance_Transaction_List_Params {
  queryParams?: GetFinance_Transaction_QueryParams

  options?: Omit<
    UseQueryOptions<
      ApiBaseResponse<
        ApiBaseResponseWithPagination<Array<IFinance_Transaction>> & {
          totalExpense: number
          totalIncome: number
        }
      >
    >,
    'queryKey' | 'queryFn'
  >
}

// Custom Hook
export const useGetFinance_Transaction_List = (
  props: GetFinance_Transaction_List_Params = {},
) => {
  const { queryParams, options } = props

  return useQueryGet<
    ApiBaseResponse<
      ApiBaseResponseWithPagination<Array<IFinance_Transaction>> & {
        totalExpense: number
        totalIncome: number
      }
    >,
    '/financial-transaction/get'
  >({
    endPoint: `/financial-transaction/get`,
    queryKey: transactionKeys.list(queryParams),
    queryParams,
    options: {
      placeholderData: keepPreviousData,
      ...options,
    },
  })
}
