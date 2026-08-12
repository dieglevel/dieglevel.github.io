export const uploadKeys = {
  all: ['upload'] as const,
  raw: () => [...uploadKeys.all, 'raw'] as const,
}
