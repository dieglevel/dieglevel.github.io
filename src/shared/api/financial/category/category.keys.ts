export const categoryKeys = {
  all: ['financial', 'category'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
  count: () => [...categoryKeys.all, 'count'] as const,
}
