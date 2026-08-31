import type {
  QueryClient,
  QueryKey,
  UseMutationOptions,
} from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

export type ExtractPathParams<T extends string> = string extends T
  ? Record<string, string | number>
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractPathParams<Rest>]: string | number }
    : T extends `${infer _Start}:${infer Param}`
      ? { [K in Param]: string | number }
      : never

export type HasPathParams<T extends string> =
  ExtractPathParams<T> extends never ? false : true

export function buildUrl<T extends string>(
  url: T,
  pathParams?: Record<string, string | number>,
) {
  if (!pathParams) return url

  let finalUrl = url as string

  Object.entries(pathParams).forEach(([key, value]) => {
    finalUrl = finalUrl.replace(`:${key}`, String(value))
  })

  return finalUrl
}

export const invalidate = (
  queryClient: QueryClient,
  queryKey?: QueryKey | Array<QueryKey>,
) => {
  if (!queryKey) return

  // Kiểm tra nếu queryKey là mảng các QueryKey (Mảng 2 chiều)
  const isMultipleKeys = Array.isArray(queryKey) && Array.isArray(queryKey[0])

  if (isMultipleKeys) {
    ;(queryKey as Array<QueryKey>).forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key })
    })
  } else {
    queryClient.invalidateQueries({ queryKey: queryKey as QueryKey })
  }
}

export type MutatePayload<TBody, TEndPoint extends string, TQueryParams> = {
  body?: TBody
} & (HasPathParams<TEndPoint> extends true
  ? { pathParams: ExtractPathParams<TEndPoint> }
  : { pathParams?: never }) & {
    queryParams?: TQueryParams
  }

export type BaseMutationProps<
  TResponse,
  TBody,
  TEndPoint extends string,
  TQueryParams extends Record<string, unknown>,
> = {
  endPoint: TEndPoint
  queryKey?: QueryKey | Array<QueryKey>
  pathParams?: HasPathParams<TEndPoint> extends true
    ? ExtractPathParams<TEndPoint>
    : never
  queryParams?: TQueryParams
  options?: UseMutationOptions<
    TResponse,
    unknown,
    MutatePayload<TBody, TEndPoint, TQueryParams>
  >
  apiConfig?: AxiosRequestConfig
}
