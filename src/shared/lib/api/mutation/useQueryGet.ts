import { useQuery } from '@tanstack/react-query'
import { customAxios } from '../axios'
import { buildUrl } from './helper'
import type { ExtractPathParams, HasPathParams } from './helper'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

export type UseQueryGetProps<
  TResponse,
  TEndPoint extends string,
  TQueryParams extends Record<string, unknown>,
> = {
  endPoint: TEndPoint
  queryKey: QueryKey
  pathParams?: HasPathParams<TEndPoint> extends true
    ? ExtractPathParams<TEndPoint>
    : never
  queryParams?: TQueryParams
  options?: Omit<UseQueryOptions<TResponse>, 'queryKey' | 'queryFn'>
  apiConfig?: AxiosRequestConfig
}

export function useQueryGet<
  TResponse,
  TEndPoint extends string = string,
  TQueryParams extends Record<string, unknown> = {},
>({
  endPoint,
  queryKey,
  pathParams,
  queryParams,
  options,
  apiConfig,
}: UseQueryGetProps<TResponse, TEndPoint, TQueryParams>) {
  return useQuery({
    queryKey: [...queryKey, pathParams, queryParams],
    queryFn: ({ signal }) => {
      const finalUrl = buildUrl(endPoint, pathParams)

      return customAxios<TResponse>({
        url: finalUrl,
        method: 'GET',
        params: queryParams,
        signal,
        ...apiConfig,
      })
    },
    ...options,
  })
}
