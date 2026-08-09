export enum FINANCIAL_CATEGORY_TYPE {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}
export class FinancialCategoryTypeHelper {
  private static readonly DEFAULT_COLOR = '#808080'
  private static readonly DEFAULT_LABEL = '-'

  private static readonly colorMap: Record<FINANCIAL_CATEGORY_TYPE, string> = {
    [FINANCIAL_CATEGORY_TYPE.INCOME]: '#10b981',
    [FINANCIAL_CATEGORY_TYPE.EXPENSE]: '#f59e0b',
    [FINANCIAL_CATEGORY_TYPE.TRANSFER]: '#3b82f6',
  }

  private static readonly labelMap: Record<FINANCIAL_CATEGORY_TYPE, string> = {
    [FINANCIAL_CATEGORY_TYPE.INCOME]: 'Thu nhập',
    [FINANCIAL_CATEGORY_TYPE.EXPENSE]: 'Chi tiêu',
    [FINANCIAL_CATEGORY_TYPE.TRANSFER]: 'Chuyển khoản',
  }

  static getColor(type: FINANCIAL_CATEGORY_TYPE | null | undefined): string {
    if (!type || !this.isValid(type)) {
      return this.DEFAULT_COLOR
    }
    return this.colorMap[type]
  }

  static getLabel(type: FINANCIAL_CATEGORY_TYPE | null | undefined): string {
    if (!type || !this.isValid(type)) {
      return this.DEFAULT_LABEL
    }
    return this.labelMap[type]
  }

  static getOptions(): Array<{
    label: string
    value: FINANCIAL_CATEGORY_TYPE
    color: string
  }> {
    return Object.values(FINANCIAL_CATEGORY_TYPE).map((type) => ({
      label: this.getLabel(type),
      value: type,
      color: this.getColor(type),
    }))
  }

  private static isValid(value: any): value is FINANCIAL_CATEGORY_TYPE {
    return Object.values(FINANCIAL_CATEGORY_TYPE).includes(value)
  }
}

// ===========================================================================================

export enum FINANCIAL_CATEGORY_SPENDING_NATURE {
  ESSENTIAL = 'ESSENTIAL',
  FLEXIBLE = 'FLEXIBLE',
}

export class FinancialCategorySpendingNatureHelper {
  private static readonly DEFAULT_COLOR = '#808080'
  private static readonly DEFAULT_LABEL = '-'

  private static readonly colorMap: Record<
    FINANCIAL_CATEGORY_SPENDING_NATURE,
    string
  > = {
    [FINANCIAL_CATEGORY_SPENDING_NATURE.ESSENTIAL]: '#10b981',
    [FINANCIAL_CATEGORY_SPENDING_NATURE.FLEXIBLE]: '#f59e0b',
  }

  private static readonly labelMap: Record<
    FINANCIAL_CATEGORY_SPENDING_NATURE,
    string
  > = {
    [FINANCIAL_CATEGORY_SPENDING_NATURE.ESSENTIAL]: 'Tiêu dùng thiết yếu',
    [FINANCIAL_CATEGORY_SPENDING_NATURE.FLEXIBLE]: 'Tiêu dùng tự do',
  }

  static getColor(
    nature: FINANCIAL_CATEGORY_SPENDING_NATURE | null | undefined,
  ): string {
    if (!nature || !this.isValid(nature)) {
      return this.DEFAULT_COLOR
    }
    return this.colorMap[nature]
  }

  static getLabel(
    nature: FINANCIAL_CATEGORY_SPENDING_NATURE | null | undefined,
  ): string {
    if (!nature || !this.isValid(nature)) {
      return this.DEFAULT_LABEL
    }
    return this.labelMap[nature]
  }

  static getOptions(): Array<{
    label: string
    value: FINANCIAL_CATEGORY_SPENDING_NATURE
    color: string
  }> {
    return Object.values(FINANCIAL_CATEGORY_SPENDING_NATURE).map((nature) => ({
      label: this.getLabel(nature),
      value: nature,
      color: this.getColor(nature),
    }))
  }

  private static isValid(
    value: any,
  ): value is FINANCIAL_CATEGORY_SPENDING_NATURE {
    return Object.values(FINANCIAL_CATEGORY_SPENDING_NATURE).includes(value)
  }
}
