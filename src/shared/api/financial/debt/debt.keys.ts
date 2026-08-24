export const debtKeys = {
  all: ['financial', 'debt'] as const,
  list: () => [...debtKeys.all, 'list'] as const,
  detail: (id: string | number) => [...debtKeys.all, 'detail', id] as const,
  histories: () => [...debtKeys.all, 'histories'] as const,
}
