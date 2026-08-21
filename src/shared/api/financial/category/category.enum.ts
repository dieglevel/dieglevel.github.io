import { BaseEnumHelper } from '../../enum.abstract'

// ===========================================================================================
// FINANCIAL_CATEGORY_TYPE
// ===========================================================================================
export enum FINANCIAL_CATEGORY_TYPE {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

class FinancialCategoryTypeHelperImpl extends BaseEnumHelper<FINANCIAL_CATEGORY_TYPE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_CATEGORY_TYPE

  protected readonly colorMap: Record<FINANCIAL_CATEGORY_TYPE, string> = {
    [FINANCIAL_CATEGORY_TYPE.INCOME]: '#10b981',
    [FINANCIAL_CATEGORY_TYPE.EXPENSE]: '#f59e0b',
    [FINANCIAL_CATEGORY_TYPE.TRANSFER]: '#3b82f6',
  }

  protected readonly labelMap: Record<FINANCIAL_CATEGORY_TYPE, string> = {
    [FINANCIAL_CATEGORY_TYPE.INCOME]: 'Thu nhập',
    [FINANCIAL_CATEGORY_TYPE.EXPENSE]: 'Chi tiêu',
    [FINANCIAL_CATEGORY_TYPE.TRANSFER]: 'Chuyển khoản',
  }
}

export const FinancialCategoryTypeHelper = new FinancialCategoryTypeHelperImpl()

// ===========================================================================================
// FINANCIAL_CATEGORY_SPENDING_NATURE
// ===========================================================================================
export enum FINANCIAL_CATEGORY_SPENDING_NATURE {
  ESSENTIAL = 'ESSENTIAL',
  FLEXIBLE = 'FLEXIBLE',
}

class FinancialCategorySpendingNatureHelperImpl extends BaseEnumHelper<FINANCIAL_CATEGORY_SPENDING_NATURE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_CATEGORY_SPENDING_NATURE

  protected readonly colorMap: Record<
    FINANCIAL_CATEGORY_SPENDING_NATURE,
    string
  > = {
    [FINANCIAL_CATEGORY_SPENDING_NATURE.ESSENTIAL]: '#10b981',
    [FINANCIAL_CATEGORY_SPENDING_NATURE.FLEXIBLE]: '#f59e0b',
  }

  protected readonly labelMap: Record<
    FINANCIAL_CATEGORY_SPENDING_NATURE,
    string
  > = {
    [FINANCIAL_CATEGORY_SPENDING_NATURE.ESSENTIAL]: 'Tiêu dùng thiết yếu',
    [FINANCIAL_CATEGORY_SPENDING_NATURE.FLEXIBLE]: 'Tiêu dùng tự do',
  }
}

export const FinancialCategorySpendingNatureHelper =
  new FinancialCategorySpendingNatureHelperImpl()
