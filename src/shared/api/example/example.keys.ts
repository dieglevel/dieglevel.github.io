export const exampleKeys = {
  all: ['example'] as const,
  lists: () => [...exampleKeys.all, 'list'] as const,
  details: () => [...exampleKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...exampleKeys.details(), id] as const,
}
