export const walletTransferKeys = {
  all: ['financial', 'wallet-transfer'] as const,
  date: () => [...walletTransferKeys.all, 'date'] as const,
}
