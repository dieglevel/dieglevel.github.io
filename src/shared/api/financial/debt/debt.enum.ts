import { BaseEnumHelper } from '../../enum.abstract'

// ===========================================================================================
// FINANCIAL_DEBT_DIRECTION_ENUM
// ===========================================================================================
export enum FINANCIAL_DEBT_DIRECTION_ENUM {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

class FinancialDebtDirectionHelperImpl extends BaseEnumHelper<FINANCIAL_DEBT_DIRECTION_ENUM> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_DEBT_DIRECTION_ENUM

  protected readonly colorMap: Record<FINANCIAL_DEBT_DIRECTION_ENUM, string> = {
    [FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING]: '#ef4444', // Đỏ
    [FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING]: '#10b981', // Xanh lá
  }

  protected readonly labelMap: Record<FINANCIAL_DEBT_DIRECTION_ENUM, string> = {
    [FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING]: 'enum.debt.direction.incoming',
    [FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING]: 'enum.debt.direction.outgoing',
  }
}

export const FinancialDebtDirectionHelper =
  new FinancialDebtDirectionHelperImpl()

// ===========================================================================================
// FINANCIAL_DEBT_STATUS_ENUM
// ===========================================================================================
export enum FINANCIAL_DEBT_STATUS_ENUM {
  ACTIVE = 'ACTIVE', // Đang hoạt động
  PAID_OFF = 'PAID_OFF', // Đã hoàn tất
  SETTLED = 'SETTLED', // Đã tất toán (thỏa thuận)
  CANCELLED = 'CANCELLED', // Đã hủy
}

class FinancialDebtStatusHelperImpl extends BaseEnumHelper<FINANCIAL_DEBT_STATUS_ENUM> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_DEBT_STATUS_ENUM

  protected readonly colorMap: Record<FINANCIAL_DEBT_STATUS_ENUM, string> = {
    [FINANCIAL_DEBT_STATUS_ENUM.ACTIVE]: '#3b82f6', // Xanh dương
    [FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF]: '#10b981', // Xanh lá
    [FINANCIAL_DEBT_STATUS_ENUM.SETTLED]: '#6b7280', // Xám
    [FINANCIAL_DEBT_STATUS_ENUM.CANCELLED]: '#ef4444', // Đỏ
  }

  protected readonly labelMap: Record<FINANCIAL_DEBT_STATUS_ENUM, string> = {
    [FINANCIAL_DEBT_STATUS_ENUM.ACTIVE]: 'enum.debt.status.active',
    [FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF]: 'enum.debt.status.paidOff',
    [FINANCIAL_DEBT_STATUS_ENUM.SETTLED]: 'enum.debt.status.settled',
    [FINANCIAL_DEBT_STATUS_ENUM.CANCELLED]: 'enum.debt.status.cancelled',
  }
}

export const FinancialDebtStatusHelper = new FinancialDebtStatusHelperImpl()

// ===========================================================================================
// FINANCIAL_DEBT_HISTORY_TYPE_ENUM
// ===========================================================================================
export enum FINANCIAL_DEBT_HISTORY_TYPE_ENUM {
  CREATED = 'CREATED',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

class FinancialDebtHistoryTypeHelperImpl extends BaseEnumHelper<FINANCIAL_DEBT_HISTORY_TYPE_ENUM> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_DEBT_HISTORY_TYPE_ENUM

  protected readonly colorMap: Record<
    FINANCIAL_DEBT_HISTORY_TYPE_ENUM,
    string
  > = {
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.CREATED]: '#3b82f6', // Xanh dương (Tạo khoản nợ)
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.PAYMENT]: '#10b981', // Xanh lá (Thanh toán)
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.ADJUSTMENT]: '#8b5cf6', // Tím (Điều chỉnh)
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.SETTLED]: '#6b7280', // Xám (Tất toán)
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.CANCELLED]: '#ef4444', // Đỏ (Đã hủy)
  }

  protected readonly labelMap: Record<
    FINANCIAL_DEBT_HISTORY_TYPE_ENUM,
    string
  > = {
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.CREATED]: 'enum.debt.history.created',
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.PAYMENT]: 'enum.debt.history.payment',
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.ADJUSTMENT]:
      'enum.debt.history.adjustment',
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.SETTLED]: 'enum.debt.history.settled',
    [FINANCIAL_DEBT_HISTORY_TYPE_ENUM.CANCELLED]: 'enum.debt.history.cancelled',
  }
}

export const FinancialDebtHistoryTypeHelper =
  new FinancialDebtHistoryTypeHelperImpl()

// ===========================================================================================
// FINANCIAL_DEBT_TYPE_ENUM
// ===========================================================================================
export enum FINANCIAL_DEBT_TYPE_ENUM {
  LOAN = 'LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
  MORTGAGE = 'MORTGAGE',
  OTHER = 'OTHER',
}

class FinancialDebtTypeHelperImpl extends BaseEnumHelper<FINANCIAL_DEBT_TYPE_ENUM> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_DEBT_TYPE_ENUM

  protected readonly colorMap: Record<FINANCIAL_DEBT_TYPE_ENUM, string> = {
    [FINANCIAL_DEBT_TYPE_ENUM.LOAN]: '#3b82f6', // Xanh dương (Vay cá nhân/ngân hàng)
    [FINANCIAL_DEBT_TYPE_ENUM.CREDIT_CARD]: '#f59e0b', // Cam (Thẻ tín dụng)
    [FINANCIAL_DEBT_TYPE_ENUM.MORTGAGE]: '#8b5cf6', // Tím (Vay thế chấp)
    [FINANCIAL_DEBT_TYPE_ENUM.OTHER]: '#6b7280', // Xám (Khác)
  }

  protected readonly labelMap: Record<FINANCIAL_DEBT_TYPE_ENUM, string> = {
    [FINANCIAL_DEBT_TYPE_ENUM.LOAN]: 'enum.debt.type.loan',
    [FINANCIAL_DEBT_TYPE_ENUM.CREDIT_CARD]: 'enum.debt.type.creditCard',
    [FINANCIAL_DEBT_TYPE_ENUM.MORTGAGE]: 'enum.debt.type.mortgage',
    [FINANCIAL_DEBT_TYPE_ENUM.OTHER]: 'enum.debt.type.other',
  }
}

export const FinancialDebtTypeHelper = new FinancialDebtTypeHelperImpl()
