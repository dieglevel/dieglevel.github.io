import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customAxios } from '../axios'
import { buildUrl, invalidate } from './helper'
import type { BaseMutationProps, MutatePayload } from './helper'
import { useLoadingStore } from '@/shared/store/loading.store'

function createMutationHook(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
  return function useCustomMutation<
    TResponse,
    TBody = unknown,
    TEndPoint extends string = string,
    TQueryParams extends Record<string, unknown> = {},
  >({
    endPoint,
    queryKey,
    pathParams,
    queryParams,
    options,
    apiConfig,
  }: BaseMutationProps<TResponse, TBody, TEndPoint, TQueryParams>) {
    const queryClient = useQueryClient()
    const userOnSuccess = options?.onSuccess
    const userOnSettled = options?.onSettled

    const setLoading = useLoadingStore((state) => state.setLoading)

    return useMutation<
      TResponse,
      unknown,
      MutatePayload<TBody, TEndPoint, TQueryParams>
    >({
      ...options,

      onMutate: (variables, context) => {
        setLoading(true)
        if (options?.onMutate) {
          return options.onMutate(variables, context)
        }
      },

      mutationFn: async (payload) => {
        const finalUrl = buildUrl(endPoint, payload.pathParams ?? pathParams)

        return customAxios<TResponse>({
          url: finalUrl,
          method,
          data: payload.body,
          params: {
            ...queryParams,
            ...payload.queryParams,
          },
          ...apiConfig,
        })
      },

      onSuccess: (data, variables, context, mutation) => {
        invalidate(queryClient, queryKey)
        userOnSuccess?.(data, variables, context, mutation)
      },

      // 2. Khi mutation KẾT THÚC (Dù Thành công hay Thất bại) -> Tắt loading
      onSettled(data, error, variables, onMutateResult, context) {
        setLoading(false)
        userOnSettled?.(data, error, variables, onMutateResult, context)
      },
    })
  }
}

export const useMutationPost = createMutationHook('POST')
export const useMutationPut = createMutationHook('PUT')
export const useMutationPatch = createMutationHook('PATCH')
export const useMutationDelete = createMutationHook('DELETE')
