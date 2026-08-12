export const goalKeys = {
  all: ['financial', 'goal'] as const,
  list: () => [...goalKeys.all, 'list'] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...goalKeys.details(), id] as const,
  projections: () => [...goalKeys.all, 'projection'] as const,
  projection: (id: string | number) => [...goalKeys.projections(), id] as const,
}