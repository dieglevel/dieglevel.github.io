import type { IBaseEntity } from '@/shared/types/base-entity'
import type { FINANCIAL_GOAL_STATUS, FINANCIAL_GOAL_TYPE } from './goal.enum'
import type { IFinance_GoalHistory } from './goal-history/goal-history.type'

export interface IFinance_Goal_Detail {
  goal: IFinance_Goal
  histories: Array<IFinance_GoalHistory>
}

export interface IFinance_Goal_Projection {
  goalId: number
  targetAmount: number
  currentAmount: number
  remainingAmount: number
  monthlyAmount: number
  estimatedMonthsToTarget: number | null
}

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
