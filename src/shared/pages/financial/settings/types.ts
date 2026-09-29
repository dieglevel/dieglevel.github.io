export interface Currency {
  code: string
  name: string
  symbol: string
}

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
