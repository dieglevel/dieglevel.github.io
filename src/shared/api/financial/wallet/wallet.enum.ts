export enum FINANCIAL_WALLET_TYPE {
  CASH = 'cash',
  BANK = 'bank',
  CREDIT_CARD = 'credit_card',
}

export const FINANCIAL_WALLET_TYPE_OPTIONS: Record<
  FINANCIAL_WALLET_TYPE,
  { label: string }
> = {
  [FINANCIAL_WALLET_TYPE.CASH]: { label: 'Cash' },
  [FINANCIAL_WALLET_TYPE.BANK]: { label: 'Bank Account' },
  [FINANCIAL_WALLET_TYPE.CREDIT_CARD]: { label: 'Credit Card' },
}
