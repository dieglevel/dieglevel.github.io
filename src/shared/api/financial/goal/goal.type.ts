import type { IBaseEntity } from '@/shared/types/base-entity'
import type {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_STATUS,
  FINANCIAL_GOAL_TYPE,
} from './goal.enum'
import type { IFinance_Wallet } from '../wallet/wallet.type'
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
  progressPercentage: number
  /** Số góp mỗi tháng dùng để tính (AUTO: autoContributionAmount) */
  monthlyAmount: number
  /** null khi không có số góp mỗi tháng */
  estimatedMonthsToTarget: number | null
  /** "YYYY-MM-DD" */
  estimatedCompletionDate: string | null
  /** null khi không có deadline */
  monthsUntilDeadline: number | null
  /** Cần góp mỗi tháng để kịp deadline; null khi không có deadline */
  requiredMonthlyAmount: number | null
  /** monthlyAmount đủ để kịp deadline? null khi không có deadline */
  onTrack: boolean | null
}

export interface IFinance_Goal extends IBaseEntity {
  name: string
  description: string | null
  type: FINANCIAL_GOAL_TYPE
  status: FINANCIAL_GOAL_STATUS
  targetAmount: number
  currentAmount: number
  savingMode: FINANCIAL_GOAL_SAVING_MODE
  deadline: Date | string | null
  imageUrl: string | null
  /** Khóa rút tiền: chặn rút và hoàn tiền khi hủy */
  isLocked: boolean
  autoContributionAmount: number | null
  autoContributionDay: number | null
  /** Ví mặc định cho góp tự động; null = góp tự động chỉ tạo khoản chờ xác nhận */
  walletId: number | null
  wallet?: IFinance_Wallet | null
  /** Có trong response paging/detail */
  progressPercentage?: number
  accountId: number
}

/** Body tạo/sửa mục tiêu (status do BE quản lý qua cancel/pause/resume) */
export interface UpsertFinanceGoalDto {
  name: string
  description?: string
  type?: FINANCIAL_GOAL_TYPE
  targetAmount: number
  deadline?: string | null
  savingMode: FINANCIAL_GOAL_SAVING_MODE
  isLocked?: boolean
  imageUrl?: string
  autoContributionAmount?: number | null
  autoContributionDay?: number | null
  walletId?: number | null
}
