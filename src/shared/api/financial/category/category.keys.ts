export const categoryKeys = {
  all: ['financial', 'category'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
  transaction: (categoryId: number) =>
    [...categoryKeys.all, 'transaction', categoryId] as const,
}
