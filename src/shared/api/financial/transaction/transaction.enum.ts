export enum FINANCIAL_TRANSACTION_TYPE {
  INCOME = 'income',
  EXPENSE = 'expense',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
}

export enum FINANCIAL_TRANSACTION_STATUS {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export const FINANCIAL_TRANSACTION_STATUS_LABEL: Record<
  FINANCIAL_TRANSACTION_STATUS,
  { color: string }
> = {
  completed: { color: 'success' },
  pending: { color: 'warning' },
  failed: { color: 'error' },
}
