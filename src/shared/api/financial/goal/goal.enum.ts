import { BaseEnumHelper } from '../../enum.abstract'

// ===========================================================================================
// FINANCIAL_GOAL_TYPE
// ===========================================================================================
export enum FINANCIAL_GOAL_TYPE {
  SAVING = 'SAVING',
  INVESTMENT = 'INVESTMENT',
  DEBT_PAYMENT = 'DEBT_PAYMENT',
  EMERGENCY_FUND = 'EMERGENCY_FUND',
  OTHER = 'OTHER',
}

class FinancialGoalTypeHelperImpl extends BaseEnumHelper<FINANCIAL_GOAL_TYPE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_GOAL_TYPE

  protected readonly colorMap: Record<FINANCIAL_GOAL_TYPE, string> = {
    [FINANCIAL_GOAL_TYPE.SAVING]: '#10b981', // Xanh lá (Tiết kiệm)
    [FINANCIAL_GOAL_TYPE.INVESTMENT]: '#8b5cf6', // Tím (Đầu tư)
    [FINANCIAL_GOAL_TYPE.DEBT_PAYMENT]: '#ef4444', // Đỏ (Trả nợ)
    [FINANCIAL_GOAL_TYPE.EMERGENCY_FUND]: '#06b6d4', // Xanh lam (Quỹ khẩn cấp)
    [FINANCIAL_GOAL_TYPE.OTHER]: '#6b7280', // Xám (Khác)
  }

  protected readonly labelMap: Record<FINANCIAL_GOAL_TYPE, string> = {
    [FINANCIAL_GOAL_TYPE.SAVING]: 'enum.goal.type.saving',
    [FINANCIAL_GOAL_TYPE.INVESTMENT]: 'enum.goal.type.investment',
    [FINANCIAL_GOAL_TYPE.DEBT_PAYMENT]: 'enum.goal.type.debtPayment',
    [FINANCIAL_GOAL_TYPE.EMERGENCY_FUND]: 'enum.goal.type.emergency',
    [FINANCIAL_GOAL_TYPE.OTHER]: 'enum.goal.type.other',
  }
}

export const FinancialGoalTypeHelper = new FinancialGoalTypeHelperImpl()

// ===========================================================================================
// FINANCIAL_GOAL_SAVING_MODE
// ===========================================================================================
export enum FINANCIAL_GOAL_SAVING_MODE {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

class FinancialGoalSavingModeHelperImpl extends BaseEnumHelper<FINANCIAL_GOAL_SAVING_MODE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_GOAL_SAVING_MODE

  protected readonly colorMap: Record<FINANCIAL_GOAL_SAVING_MODE, string> = {
    [FINANCIAL_GOAL_SAVING_MODE.MANUAL]: '#f59e0b', // Cam (Thủ công)
    [FINANCIAL_GOAL_SAVING_MODE.AUTO]: '#3b82f6', // Xanh dương (Tự động)
  }

  protected readonly labelMap: Record<FINANCIAL_GOAL_SAVING_MODE, string> = {
    [FINANCIAL_GOAL_SAVING_MODE.MANUAL]: 'enum.goal.savingMode.manual',
    [FINANCIAL_GOAL_SAVING_MODE.AUTO]: 'enum.goal.savingMode.auto',
  }
}

export const FinancialGoalSavingModeHelper =
  new FinancialGoalSavingModeHelperImpl()

// ===========================================================================================
// FINANCIAL_GOAL_STATUS
// ===========================================================================================
export enum FINANCIAL_GOAL_STATUS {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  INACTIVE = 'INACTIVE',
}

class FinancialGoalStatusHelperImpl extends BaseEnumHelper<FINANCIAL_GOAL_STATUS> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_GOAL_STATUS

  protected readonly colorMap: Record<FINANCIAL_GOAL_STATUS, string> = {
    [FINANCIAL_GOAL_STATUS.ACTIVE]: '#3b82f6', // Xanh dương (Đang thực hiện)
    [FINANCIAL_GOAL_STATUS.COMPLETED]: '#10b981', // Xanh lá (Hoàn thành)
    [FINANCIAL_GOAL_STATUS.CANCELLED]: '#ef4444', // Đỏ (Đã hủy)
    [FINANCIAL_GOAL_STATUS.INACTIVE]: '#9ca3af', // Xám (Tạm dừng)
  }

  protected readonly labelMap: Record<FINANCIAL_GOAL_STATUS, string> = {
    [FINANCIAL_GOAL_STATUS.ACTIVE]: 'enum.goal.status.active',
    [FINANCIAL_GOAL_STATUS.COMPLETED]: 'enum.goal.status.completed',
    [FINANCIAL_GOAL_STATUS.CANCELLED]: 'enum.goal.status.cancelled',
    [FINANCIAL_GOAL_STATUS.INACTIVE]: 'enum.goal.status.inactive',
  }
}

export const FinancialGoalStatusHelper = new FinancialGoalStatusHelperImpl()
