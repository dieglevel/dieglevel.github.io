import type { IBaseEntity } from '@/shared/types/base-entity'
import type { FINANCIAL_GOAL_STATUS, FINANCIAL_GOAL_TYPE } from './goal.enum'

export interface IFinance_Goal extends IBaseEntity {
  name: string
  description: string | null
  type: FINANCIAL_GOAL_TYPE
  status: FINANCIAL_GOAL_STATUS
  targetAmount: number
  currentAmount: number
  deadline: Date | null
  imageUrl: string | null
  isLocked: boolean
  autoContributionAmount: number | null
  autoContributionDay: number | null
  accountId: string
}
