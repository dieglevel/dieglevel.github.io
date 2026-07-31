import type { IBaseEntity } from '@/shared/types/base-entity'

export interface IWallet_Goal extends IBaseEntity {
  name: string
  type: string
  status: string
  targetAmount: number
  currentAmount: number
  deadline: string
  imageUrl: string
  isLocked: boolean
  autoContributionAmount: number
  autoContributionDay: number
}
