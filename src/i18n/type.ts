import 'i18next'
import type en from './locales/en/common.json'
import type enSettings from './locales/en/finance/settings.json'
import type enDashboard from './locales/en/finance/dashboard.json'
import type enFinance from './locales/en/finance'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof en
      settings: typeof enSettings
      dashboard: typeof enDashboard
      finance: typeof enFinance
    }
  }
}
