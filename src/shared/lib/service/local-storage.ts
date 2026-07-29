export enum LOCAL_STORAGE_KEY {
  CURRENCY = 'currency',
  THEME = 'theme',
  LANGUAGE = 'language',
  CURRENT_PAGE = 'currentPage',
}

export const LocalStorageService = {
  set<T>(key: LOCAL_STORAGE_KEY, value: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },

  get<T>(key: LOCAL_STORAGE_KEY, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null

    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue ?? null
    }

    try {
      return JSON.parse(item) as T
    } catch {
      return defaultValue ?? null
    }
  },

  remove(key: LOCAL_STORAGE_KEY): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}
