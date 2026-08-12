export const goalHistoryKeys = {
  all: ['financial', 'goal-history'] as const,
  list: (goalId: string | number) =>
    [...goalHistoryKeys.all, 'list', goalId] as const,
  details: () => [...goalHistoryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...goalHistoryKeys.details(), id] as const,
}
