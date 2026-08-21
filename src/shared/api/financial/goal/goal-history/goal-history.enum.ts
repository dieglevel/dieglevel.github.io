import { BaseEnumHelper } from '@/shared/api/enum.abstract'
// ===========================================================================================
// FINANCIAL_GOAL_HISTORY_SOURCE
// ===========================================================================================
export enum FINANCIAL_GOAL_HISTORY_SOURCE {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

class FinancialGoalHistorySourceHelperImpl extends BaseEnumHelper<FINANCIAL_GOAL_HISTORY_SOURCE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_GOAL_HISTORY_SOURCE

  protected readonly colorMap: Record<FINANCIAL_GOAL_HISTORY_SOURCE, string> = {
    [FINANCIAL_GOAL_HISTORY_SOURCE.USER]: '#3b82f6', // Xanh dương (Người dùng)
    [FINANCIAL_GOAL_HISTORY_SOURCE.SYSTEM]: '#8b5cf6', // Tím (Hệ thống)
  }

  protected readonly labelMap: Record<FINANCIAL_GOAL_HISTORY_SOURCE, string> = {
    [FINANCIAL_GOAL_HISTORY_SOURCE.USER]: 'Người dùng',
    [FINANCIAL_GOAL_HISTORY_SOURCE.SYSTEM]: 'Hệ thống tự động',
  }
}

export const FinancialGoalHistorySourceHelper =
  new FinancialGoalHistorySourceHelperImpl()

// ===========================================================================================
// FINANCIAL_GOAL_HISTORY_STATUS
// ===========================================================================================
export enum FINANCIAL_GOAL_HISTORY_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

class FinancialGoalHistoryStatusHelperImpl extends BaseEnumHelper<FINANCIAL_GOAL_HISTORY_STATUS> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_GOAL_HISTORY_STATUS

  protected readonly colorMap: Record<FINANCIAL_GOAL_HISTORY_STATUS, string> = {
    [FINANCIAL_GOAL_HISTORY_STATUS.PENDING]: '#f59e0b', // Cam (Chờ xử lý)
    [FINANCIAL_GOAL_HISTORY_STATUS.COMPLETED]: '#10b981', // Xanh lá (Hoàn thành)
    [FINANCIAL_GOAL_HISTORY_STATUS.SKIPPED]: '#9ca3af', // Xám (Bỏ qua)
  }

  protected readonly labelMap: Record<FINANCIAL_GOAL_HISTORY_STATUS, string> = {
    [FINANCIAL_GOAL_HISTORY_STATUS.PENDING]: 'Chờ nạp',
    [FINANCIAL_GOAL_HISTORY_STATUS.COMPLETED]: 'Đã hoàn thành',
    [FINANCIAL_GOAL_HISTORY_STATUS.SKIPPED]: 'Đã bỏ qua',
  }
}

export const FinancialGoalHistoryStatusHelper =
  new FinancialGoalHistoryStatusHelperImpl()
