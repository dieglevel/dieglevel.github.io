import { BaseEnumHelper } from '../../enum.abstract'

// ===========================================================================================
// FINANCIAL_TRANSACTION_TYPE
// ===========================================================================================
export enum FINANCIAL_TRANSACTION_TYPE {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}

class FinancialTransactionTypeHelperImpl extends BaseEnumHelper<FINANCIAL_TRANSACTION_TYPE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_TRANSACTION_TYPE

  protected readonly colorMap: Record<FINANCIAL_TRANSACTION_TYPE, string> = {
    [FINANCIAL_TRANSACTION_TYPE.INCOME]: '#10b981', // Xanh lá (Thu nhập)
    [FINANCIAL_TRANSACTION_TYPE.EXPENSE]: '#ef4444', // Đỏ (Chi tiêu)
    [FINANCIAL_TRANSACTION_TYPE.REFUND]: '#06b6d4', // Xanh lam (Hoàn tiền)
    [FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT]: '#8b5cf6', // Tím (Điều chỉnh)
    [FINANCIAL_TRANSACTION_TYPE.TRANSFER]: '#3b82f6', // Xanh dương (Chuyển khoản)
  }

  protected readonly labelMap: Record<FINANCIAL_TRANSACTION_TYPE, string> = {
    [FINANCIAL_TRANSACTION_TYPE.INCOME]: 'Thu nhập',
    [FINANCIAL_TRANSACTION_TYPE.EXPENSE]: 'Chi tiêu',
    [FINANCIAL_TRANSACTION_TYPE.REFUND]: 'Hoàn tiền',
    [FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT]: 'Điều chỉnh số dư',
    [FINANCIAL_TRANSACTION_TYPE.TRANSFER]: 'Chuyển khoản',
  }
}

export const FinancialTransactionTypeHelper =
  new FinancialTransactionTypeHelperImpl()

// ===========================================================================================
// FINANCIAL_TRANSACTION_STATUS
// ===========================================================================================
export enum FINANCIAL_TRANSACTION_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

class FinancialTransactionStatusHelperImpl extends BaseEnumHelper<FINANCIAL_TRANSACTION_STATUS> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_TRANSACTION_STATUS

  protected readonly colorMap: Record<FINANCIAL_TRANSACTION_STATUS, string> = {
    [FINANCIAL_TRANSACTION_STATUS.PENDING]: '#f59e0b', // Cam (Đang xử lý)
    [FINANCIAL_TRANSACTION_STATUS.COMPLETED]: '#10b981', // Xanh lá (Hoàn thành)
    [FINANCIAL_TRANSACTION_STATUS.FAILED]: '#ef4444', // Đỏ (Thất bại)
  }

  protected readonly labelMap: Record<FINANCIAL_TRANSACTION_STATUS, string> = {
    [FINANCIAL_TRANSACTION_STATUS.PENDING]: 'Đang xử lý',
    [FINANCIAL_TRANSACTION_STATUS.COMPLETED]: 'Hoàn thành',
    [FINANCIAL_TRANSACTION_STATUS.FAILED]: 'Thất bại',
  }
}

export const FinancialTransactionStatusHelper =
  new FinancialTransactionStatusHelperImpl()
