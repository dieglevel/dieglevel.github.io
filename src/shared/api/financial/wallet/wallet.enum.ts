export enum FINANCIAL_WALLET_TYPE {
  CASH = 'cash',
  BANK = 'bank',
  E_WALLET = 'e_wallet',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
  SAVINGS = 'savings',
}

export const FINANCIAL_WALLET_TYPE_OPTIONS: Record<
  FINANCIAL_WALLET_TYPE,
  { label: string }
> = {
  [FINANCIAL_WALLET_TYPE.CASH]: { label: 'Cash' },
  [FINANCIAL_WALLET_TYPE.BANK]: { label: 'Bank Account' },
  [FINANCIAL_WALLET_TYPE.CREDIT_CARD]: { label: 'Credit Card' },
  [FINANCIAL_WALLET_TYPE.E_WALLET]: { label: 'E-Wallet' },
  [FINANCIAL_WALLET_TYPE.INVESTMENT]: { label: 'Investment' },
  [FINANCIAL_WALLET_TYPE.SAVINGS]: { label: 'Savings' },
}
