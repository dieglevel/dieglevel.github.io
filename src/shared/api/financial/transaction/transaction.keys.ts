export const transactionKeys = {
  all: ['financial', 'transaction'] as const,
  list: () => [...transactionKeys.all, 'list'] as const,
  date: () => [...transactionKeys.all, 'date'] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...transactionKeys.details(), id] as const,
}
