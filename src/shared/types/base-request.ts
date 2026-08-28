export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ApiBasePaginationRequest<
  TFilter = Record<string, unknown>,
  TSortBy = string,
> {
  page: number
  limit: number
  search?: string
  filter?: TFilter
  sortBy?: TSortBy
  sortOrder?: SortOrder
}
