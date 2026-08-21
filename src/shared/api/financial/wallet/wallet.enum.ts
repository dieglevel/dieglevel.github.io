import { BaseEnumHelper } from '../../enum.abstract'

export enum FINANCIAL_WALLET_TYPE {
  CASH = 'cash',
  BANK = 'bank',
  E_WALLET = 'e_wallet',
}

class FinancialWalletTypeHelperImpl extends BaseEnumHelper<FINANCIAL_WALLET_TYPE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_WALLET_TYPE

  protected readonly colorMap = {
    [FINANCIAL_WALLET_TYPE.CASH]: '#10b981',
    [FINANCIAL_WALLET_TYPE.BANK]: '#3b82f6',
    [FINANCIAL_WALLET_TYPE.E_WALLET]: '#ec4899',
  }

  protected readonly labelMap = {
    [FINANCIAL_WALLET_TYPE.CASH]: 'Tiền mặt',
    [FINANCIAL_WALLET_TYPE.BANK]: 'Ngân hàng',
    [FINANCIAL_WALLET_TYPE.E_WALLET]: 'Ví điện tử',
  }
}

// Export dưới dạng Singleton/Static instance để sử dụng trực tiếp
export const FinancialWalletTypeHelper = new FinancialWalletTypeHelperImpl()

// ==========================================
// 2. FINANCIAL_TRANSACTION_STATUS
// ==========================================
export enum FINANCIAL_TRANSACTION_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

class FinancialTransactionStatusHelperImpl extends BaseEnumHelper<FINANCIAL_TRANSACTION_STATUS> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_TRANSACTION_STATUS

  protected readonly colorMap = {
    [FINANCIAL_TRANSACTION_STATUS.PENDING]: '#f59e0b',
    [FINANCIAL_TRANSACTION_STATUS.COMPLETED]: '#10b981',
    [FINANCIAL_TRANSACTION_STATUS.FAILED]: '#ef4444',
  }

  protected readonly labelMap = {
    [FINANCIAL_TRANSACTION_STATUS.PENDING]: 'Đang xử lý',
    [FINANCIAL_TRANSACTION_STATUS.COMPLETED]: 'Hoàn thành',
    [FINANCIAL_TRANSACTION_STATUS.FAILED]: 'Thất bại',
  }
}

export const FinancialTransactionStatusHelper =
  new FinancialTransactionStatusHelperImpl()
