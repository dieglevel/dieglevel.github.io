export interface Currency {
  code: string
  name: string
  symbol: string
}

export const CURRENCIES: Array<Currency> = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
]

export const LANGUAGES = [
  'English',
  'Vietnamese',
  'Spanish',
  'French',
  'Japanese',
  'Korean',
]

export interface NotificationSettings {
  budgetAlerts: boolean
  largeTransactions: boolean
  weeklyReport: boolean
  monthlyReport: boolean
  unusualActivity: boolean
}

export interface SecuritySettings {
  twoFactor: boolean
  biometric: boolean
  sessionTimeout: string
}
