import type { GetFinance_Transaction_QueryParams } from './useGetFinance_Transaction_List'

export const transactionKeys = {
  all: ['financial', 'transaction'] as const,
  view: () => [...transactionKeys.all, 'view'] as const,
  list: (queryParams?: GetFinance_Transaction_QueryParams) =>
    [...transactionKeys.all, 'list', queryParams] as const,
  date: () => [...transactionKeys.all, 'date'] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...transactionKeys.details(), id] as const,
}
