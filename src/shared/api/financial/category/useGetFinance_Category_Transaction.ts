import { categoryKeys } from './category.keys'
import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Category } from './category.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_TransactionItem } from '../transaction/transaction-item/transaction-item.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface FinancialCategory_GetTransactionCategory_Response {
  parent: Omit<IFinance_Category, 'children' | 'transactionItems'>
  children: Array<IFinance_Category>
  transactionItems: Array<
    Omit<IFinance_TransactionItem, 'category'> & {
      category: Partial<IFinance_Category>
    }
  >
}

export interface GetFinance_Category_Transaction_Params {
  pathParams: {
    categoryId: number
  }
  queryParams: {
    amountMonth?: dayjs.Dayjs | string | Date
  }
  options?: Omit<
    UseQueryOptions<
      ApiBaseResponse<FinancialCategory_GetTransactionCategory_Response>
    >,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Category_Transaction = (
  props: GetFinance_Category_Transaction_Params,
) =>
  useQueryGet<
    ApiBaseResponse<FinancialCategory_GetTransactionCategory_Response>,
    '/financial-category/transaction/:categoryId'
  >({
    endPoint: `/financial-category/transaction/:categoryId`,
    queryKey: categoryKeys.transaction(props.pathParams.categoryId),
    options: {
      enabled:
        !!props.pathParams.categoryId || props.pathParams.categoryId === 0,
      ...props.options,
    },
    ...props,
  })
