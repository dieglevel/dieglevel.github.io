import type { IBaseEntity } from '@/shared/types/base-entity'
import type {
  FINANCIAL_SETTING_CURRENCY,
  FINANCIAL_SETTING_LANGUAGE,
  FINANCIAL_SETTING_THEME,
  FINANCIAL_SETTING_THEME_MODE,
} from './setting.enum'

export interface IFinance_Setting extends IBaseEntity {
  themeMode: FINANCIAL_SETTING_THEME_MODE
  theme: FINANCIAL_SETTING_THEME
  language: FINANCIAL_SETTING_LANGUAGE
  currency: FINANCIAL_SETTING_CURRENCY
  cycleStartDate: number
  accountId: number
}
