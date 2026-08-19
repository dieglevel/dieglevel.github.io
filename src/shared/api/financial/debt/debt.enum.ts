export enum FINANCIAL_DEBT_DIRECTION_ENUM {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

export enum FINANCIAL_DEBT_STATUS_ENUM {
  ACTIVE = 'ACTIVE', // Đang hoạt động
  PAID_OFF = 'PAID_OFF', // Đã hoàn tất
  SETTLED = 'SETTLED', // Đã tất toán (thỏa thuận)
  CANCELLED = 'CANCELLED', // Đã hủy
}

export enum FINANCIAL_DEBT_HISTORY_TYPE_ENUM {
  CREATED = 'CREATED',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

export enum FINANCIAL_DEBT_TYPE_ENUM {
  LOAN = 'LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
  MORTGAGE = 'MORTGAGE',
  OTHER = 'OTHER',
}

export class FinancialDebtDirectionHelper {
  private static readonly DEFAULT_COLOR = '#808080'
  private static readonly DEFAULT_LABEL = '-'

  private static readonly colorMap: Record<
    FINANCIAL_DEBT_DIRECTION_ENUM,
    string
  > = {
    [FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING]: '#ef4444',
    [FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING]: '#10b981',
  }

  private static readonly labelMap: Record<
    FINANCIAL_DEBT_DIRECTION_ENUM,
    string
  > = {
    [FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING]: 'Đi vay (Nợ phải trả)',
    [FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING]: 'Cho vay (Nợ phải thu)',
  }

  static getColor(
    direction: FINANCIAL_DEBT_DIRECTION_ENUM | null | undefined,
  ): string {
    if (!direction || !this.isValid(direction)) return this.DEFAULT_COLOR
    return this.colorMap[direction]
  }

  static getLabel(
    direction: FINANCIAL_DEBT_DIRECTION_ENUM | null | undefined,
  ): string {
    if (!direction || !this.isValid(direction)) return this.DEFAULT_LABEL
    return this.labelMap[direction]
  }

  static getOptions(): Array<{
    label: string
    value: FINANCIAL_DEBT_DIRECTION_ENUM
    color: string
  }> {
    return Object.values(FINANCIAL_DEBT_DIRECTION_ENUM).map((direction) => ({
      label: this.getLabel(direction),
      value: direction,
      color: this.getColor(direction),
    }))
  }

  private static isValid(value: any): value is FINANCIAL_DEBT_DIRECTION_ENUM {
    return Object.values(FINANCIAL_DEBT_DIRECTION_ENUM).includes(value)
  }
}

export class FinancialDebtStatusHelper {
  private static readonly DEFAULT_COLOR = '#808080'
  private static readonly DEFAULT_LABEL = '-'

  private static readonly colorMap: Record<FINANCIAL_DEBT_STATUS_ENUM, string> =
    {
      [FINANCIAL_DEBT_STATUS_ENUM.ACTIVE]: '#3b82f6',
      [FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF]: '#10b981',
      [FINANCIAL_DEBT_STATUS_ENUM.SETTLED]: '#6b7280',
      [FINANCIAL_DEBT_STATUS_ENUM.CANCELLED]: '#ef4444',
    }

  private static readonly labelMap: Record<FINANCIAL_DEBT_STATUS_ENUM, string> =
    {
      [FINANCIAL_DEBT_STATUS_ENUM.ACTIVE]: 'Đang nợ',
      [FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF]: 'Đã trả xong',
      [FINANCIAL_DEBT_STATUS_ENUM.SETTLED]: 'Đã tất toán',
      [FINANCIAL_DEBT_STATUS_ENUM.CANCELLED]: 'Đã hủy',
    }

  static getColor(
    status: FINANCIAL_DEBT_STATUS_ENUM | null | undefined,
  ): string {
    if (!status || !this.isValid(status)) return this.DEFAULT_COLOR
    return this.colorMap[status]
  }

  static getLabel(
    status: FINANCIAL_DEBT_STATUS_ENUM | null | undefined,
  ): string {
    if (!status || !this.isValid(status)) return this.DEFAULT_LABEL
    return this.labelMap[status]
  }

  static getOptions(): Array<{
    label: string
    value: FINANCIAL_DEBT_STATUS_ENUM
    color: string
  }> {
    return Object.values(FINANCIAL_DEBT_STATUS_ENUM).map((status) => ({
      label: this.getLabel(status),
      value: status,
      color: this.getColor(status),
    }))
  }

  private static isValid(value: any): value is FINANCIAL_DEBT_STATUS_ENUM {
    return Object.values(FINANCIAL_DEBT_STATUS_ENUM).includes(value)
  }
}
