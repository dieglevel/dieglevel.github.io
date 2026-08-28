export interface ApiBaseResponse<T> {
  code: number
  message: string
  timestamp: string
  path: string
  data: T
}

export interface ApiBaseResponseWithPagination<T> {
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: T
}
