import { systemInformationKeys } from './system-information.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface Os {
  platform: string
  uptimeSeconds: number
  cpuCores: number
}

export interface Cpu {
  usagePercent: number
}

export interface Memory {
  totalBytes: number
  usedBytes: number
  freeBytes: number
  processRssBytes: number
  heapUsedBytes: number
}

export interface DisksItem {
  filesystem: string
  mount: string
  totalBytes: number
  usedBytes: number
  usagePercent: number
}

export interface ISystemInformation {
  os: Os
  cpu: Cpu
  memory: Memory
  disks: Array<DisksItem>
}

// Get<Example><Type>Params
export interface GetSystemInformation_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<ISystemInformation>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetSystemInformation = (props: GetSystemInformation_Params) =>
  useQueryGet<
    ApiBaseResponse<Array<ISystemInformation>>,
    '/system-information'
  >({
    endPoint: `/system-information`,
    queryKey: systemInformationKeys.information(),
    ...props,
  })
