const TASK_FILTER_DB = 'task-filter-db'
const TASK_FILTER_STORE = 'filters'
const TASK_KEYWORD_KEY = 'task-keyword'
const TASK_DATA_KEY = 'task-data'
const TASK_STATUS_FILTER_KEY = 'task-status-filter'
const TASK_PERCENT_RANGE_KEY = 'task-percent-range'
const TASK_COMPLETED_IDS_KEY = 'task-completed-ids'
const TASK_EXPANDED_INPUT_SETS_KEY = 'task-expanded-input-sets'
const TASK_EXPANDED_NOTES_KEY = 'task-expanded-notes'
const TASK_EXPANDED_IMAGES_KEY = 'task-expanded-images'

export interface ExpandedInputSet {
  mng: string
  be: string
  homepage: string
}

type ExpandedInputSets = Record<string, Array<ExpandedInputSet>>
type ExpandedNotes = Record<string, string>
type ExpandedImages = Record<string, Array<string>>

const openTaskFilterDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment'))
      return
    }

    const request = indexedDB.open(TASK_FILTER_DB, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(TASK_FILTER_STORE)) {
        db.createObjectStore(TASK_FILTER_STORE)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const readStoreValue = async <T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
): Promise<T> => {
  try {
    const db = await openTaskFilterDB()
    const value = await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(TASK_FILTER_STORE, 'readonly')
      const store = tx.objectStore(TASK_FILTER_STORE)
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        if (isValid) {
          resolve(isValid(result) ? result : fallback)
          return
        }
        resolve((result as T) ?? fallback)
      }

      request.onerror = () => reject(request.error)
    })
    db.close()
    return value
  } catch (error) {
    console.error('Failed to read from IndexedDB:', error)
    return fallback
  }
}

const writeStoreValue = async <T>(key: string, value: T): Promise<void> => {
  try {
    const db = await openTaskFilterDB()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(TASK_FILTER_STORE, 'readwrite')
      const store = tx.objectStore(TASK_FILTER_STORE)
      const request = store.put(value, key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    db.close()
  } catch (error) {
    console.error('Failed to write to IndexedDB:', error)
  }
}

export const getSavedKeyword = (): Promise<string> => {
  return readStoreValue<string>(
    TASK_KEYWORD_KEY,
    '',
    (value): value is string => {
      return typeof value === 'string'
    },
  )
}

export const saveKeyword = (keyword: string): Promise<void> => {
  return writeStoreValue<string>(TASK_KEYWORD_KEY, keyword)
}

export const getSavedData = (): Promise<string> => {
  return readStoreValue<string>(TASK_DATA_KEY, '', (value): value is string => {
    return typeof value === 'string'
  })
}

export const saveData = (data: string): Promise<void> => {
  return writeStoreValue<string>(TASK_DATA_KEY, data)
}

export const getSavedStatusFilter = (): Promise<Array<string>> => {
  return readStoreValue<Array<string>>(
    TASK_STATUS_FILTER_KEY,
    [],
    (value): value is Array<string> => {
      return (
        Array.isArray(value) &&
        value.every((filterValue) => typeof filterValue === 'string')
      )
    },
  )
}

export const saveStatusFilter = (
  statusFilter: Array<string>,
): Promise<void> => {
  return writeStoreValue<Array<string>>(TASK_STATUS_FILTER_KEY, statusFilter)
}

export const getSavedPercentRange = (): Promise<[number, number]> => {
  return readStoreValue<[number, number]>(
    TASK_PERCENT_RANGE_KEY,
    [0, 100],
    (value): value is [number, number] => {
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        value.every((rangeValue) => typeof rangeValue === 'number')
      )
    },
  )
}

export const savePercentRange = (
  percentRange: [number, number],
): Promise<void> => {
  return writeStoreValue<[number, number]>(TASK_PERCENT_RANGE_KEY, percentRange)
}

export const getSavedCompletedIds = (): Promise<Array<string>> => {
  return readStoreValue<Array<string>>(
    TASK_COMPLETED_IDS_KEY,
    [],
    (value): value is Array<string> => {
      return (
        Array.isArray(value) &&
        value.every((completedId) => typeof completedId === 'string')
      )
    },
  )
}

export const saveCompletedIds = (
  completedIds: Array<string>,
): Promise<void> => {
  return writeStoreValue<Array<string>>(TASK_COMPLETED_IDS_KEY, completedIds)
}

const isExpandedInputSet = (value: unknown): value is ExpandedInputSet => {
  if (typeof value !== 'object' || value === null) return false

  const inputSet = value as ExpandedInputSet

  return (
    typeof inputSet.mng === 'string' &&
    typeof inputSet.be === 'string' &&
    typeof inputSet.homepage === 'string'
  )
}

const isExpandedInputSets = (value: unknown): value is ExpandedInputSets => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every((rowInputSets) => {
    return Array.isArray(rowInputSets) && rowInputSets.every(isExpandedInputSet)
  })
}

const isExpandedNotes = (value: unknown): value is ExpandedNotes => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every(
    (noteValue) => typeof noteValue === 'string',
  )
}

const isExpandedImages = (value: unknown): value is ExpandedImages => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every((imageList) => {
    return (
      Array.isArray(imageList) &&
      imageList.every((imageValue) => typeof imageValue === 'string')
    )
  })
}

export const getSavedExpandedInputSets = (): Promise<ExpandedInputSets> => {
  return readStoreValue<ExpandedInputSets>(
    TASK_EXPANDED_INPUT_SETS_KEY,
    {},
    isExpandedInputSets,
  )
}

export const saveExpandedInputSets = (
  expandedInputSets: ExpandedInputSets,
): Promise<void> => {
  return writeStoreValue<ExpandedInputSets>(
    TASK_EXPANDED_INPUT_SETS_KEY,
    expandedInputSets,
  )
}

export const getSavedExpandedNotes = (): Promise<ExpandedNotes> => {
  return readStoreValue<ExpandedNotes>(
    TASK_EXPANDED_NOTES_KEY,
    {},
    isExpandedNotes,
  )
}

export const saveExpandedNotes = (
  expandedNotes: ExpandedNotes,
): Promise<void> => {
  return writeStoreValue<ExpandedNotes>(TASK_EXPANDED_NOTES_KEY, expandedNotes)
}

export const getSavedExpandedImages = (): Promise<ExpandedImages> => {
  return readStoreValue<ExpandedImages>(
    TASK_EXPANDED_IMAGES_KEY,
    {},
    isExpandedImages,
  )
}

export const saveExpandedImages = (
  expandedImages: ExpandedImages,
): Promise<void> => {
  return writeStoreValue<ExpandedImages>(
    TASK_EXPANDED_IMAGES_KEY,
    expandedImages,
  )
}
