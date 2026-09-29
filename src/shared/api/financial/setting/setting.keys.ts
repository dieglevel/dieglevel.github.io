export const settingKeys = {
  all: ['financial', 'setting'] as const,
  get: () => [...settingKeys.all] as const,
}
