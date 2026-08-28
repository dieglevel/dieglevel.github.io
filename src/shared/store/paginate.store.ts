import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ApiBasePaginationRequest } from '../types/base-request'

interface PaginateState {
  paginationMap: Record<string, ApiBasePaginationRequest>

  getPaginate: (key: string) => ApiBasePaginationRequest

  setPaginate: (
    key: string,
    paginate: Partial<ApiBasePaginationRequest>,
  ) => void

  resetPaginate: (key: string) => void

  clearPaginate: (key: string) => void

  clearAllPaginate: () => void
}

const DEFAULT_PAGINATION: ApiBasePaginationRequest = {
  page: 1,
  limit: 20,
}

export const usePaginateStore = create<PaginateState>()(
  devtools(
    persist(
      (set, get) => ({
        paginationMap: {},

        getPaginate: (key) => {
          return get().paginationMap[key] ?? DEFAULT_PAGINATION
        },

        setPaginate: (key, paginate) =>
          set((state) => ({
            paginationMap: {
              ...state.paginationMap,
              [key]: {
                ...DEFAULT_PAGINATION,
                ...state.paginationMap[key],
                ...paginate,
              },
            },
          })),

        resetPaginate: (key) =>
          set((state) => ({
            paginationMap: {
              ...state.paginationMap,
              [key]: DEFAULT_PAGINATION,
            },
          })),

        clearPaginate: (key) =>
          set((state) => {
            const paginationMap = { ...state.paginationMap }

            delete paginationMap[key]

            return {
              paginationMap,
            }
          }),

        clearAllPaginate: () =>
          set({
            paginationMap: {},
          }),
      }),
      {
        name: 'pagination-storage',
      },
    ),
  ),
)
