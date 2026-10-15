export const profileKeys = {
  me: () => ['profile'] as const,
  meUpdate: () => [...profileKeys.me(), 'update'] as const,
}
