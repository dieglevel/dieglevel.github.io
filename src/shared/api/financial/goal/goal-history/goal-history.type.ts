import type { IBaseEntity } from '@/shared/types/base-entity'
import type { IFinance_Goal } from '../goal.type'
import type {
  FINANCIAL_GOAL_HISTORY_SOURCE,
  FINANCIAL_GOAL_HISTORY_STATUS,
  FINANCIAL_GOAL_HISTORY_TYPE,
} from './goal-history.enum'
import type { IFinance_Wallet } from '../../wallet/wallet.type'

export interface IFinance_GoalHistory extends IBaseEntity {
  goalId: number
  goal?: IFinance_Goal
  period: string
  /** Góp vào / rút ra — amount luôn dương */
  type: FINANCIAL_GOAL_HISTORY_TYPE
  plannedAmount: number
  amount: number
  source: FINANCIAL_GOAL_HISTORY_SOURCE
  status: FINANCIAL_GOAL_HISTORY_STATUS
  /** Ví bị trừ (góp) / được cộng (rút); null = chỉ ghi sổ */
  walletId?: number | null
  wallet?: IFinance_Wallet | null
  note?: string | null
  completedAt?: Date | string | null
}
