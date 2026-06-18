import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PaginateState {
  current: number
  pageSize: number
  total: number

  setPaginate: (paginate: {
    current: number
    pageSize: number
    total: number
  }) => void
  clearPaginate: () => void
}

export const usePaginateStore = create<PaginateState>()(
  devtools((set) => ({
    current: 1,
    pageSize: 10,
    total: 0,

    setPaginate: ({ current, pageSize, total }) =>
      set({ current, pageSize, total }),

    clearPaginate: () =>
      set({
        current: 1,
        pageSize: 10,
        total: 0,
      }),
  })),
)
