import type { IBaseEntity } from '@/shared/types/base-entity'
import type { IFinance_Goal } from '../goal.type'
import type {
  FINANCIAL_GOAL_HISTORY_SOURCE,
  FINANCIAL_GOAL_HISTORY_STATUS,
} from './goal-history.enum'

export interface IFinance_GoalHistory extends IBaseEntity {
  goalId: number
  goal?: IFinance_Goal
  period: string
  plannedAmount: number
  amount: number
  source: FINANCIAL_GOAL_HISTORY_SOURCE
  status: FINANCIAL_GOAL_HISTORY_STATUS
  note?: string | null
  completedAt?: Date | string | null
}
