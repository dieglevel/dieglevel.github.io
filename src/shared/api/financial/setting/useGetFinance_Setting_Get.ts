import { settingKeys } from './setting.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Setting } from './setting.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Setting_Get_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_Setting>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Setting_Get = (
  props: GetFinance_Setting_Get_Params,
) =>
  useQueryGet<ApiBaseResponse<IFinance_Setting>, '/financial-setting'>({
    endPoint: `/financial-setting`,
    queryKey: settingKeys.get(),
    ...props,
  })
