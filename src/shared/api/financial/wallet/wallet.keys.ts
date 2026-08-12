export const walletKeys = {
  all: ['financial', 'wallet'] as const,
  list: () => [...walletKeys.all, 'list'] as const,
  date: () => [...walletKeys.all, 'date'] as const,
}