export const feedbackKeys = {
  all: ['feedback'] as const,
  list: (params?: Record<string, unknown>) =>
    [...feedbackKeys.all, 'list', params] as const,
  details: () => [...feedbackKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...feedbackKeys.details(), id] as const,
}
