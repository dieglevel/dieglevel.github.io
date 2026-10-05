import { BaseEnumHelper } from '../../enum.abstract'

// ===========================================================================================
// FINANCIAL_SETTING_THEME_MODE
// ===========================================================================================
export enum FINANCIAL_SETTING_THEME_MODE {
  LIGHT = 'light',
  DARK = 'dark',
}

class FinancialSettingThemeModeHelperImpl extends BaseEnumHelper<FINANCIAL_SETTING_THEME_MODE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_SETTING_THEME_MODE

  protected readonly colorMap: Record<FINANCIAL_SETTING_THEME_MODE, string> = {
    [FINANCIAL_SETTING_THEME_MODE.LIGHT]: '#f59e0b', // Vàng / Sáng
    [FINANCIAL_SETTING_THEME_MODE.DARK]: '#1e293b', // Xám tối
  }

  protected readonly labelMap: Record<FINANCIAL_SETTING_THEME_MODE, string> = {
    [FINANCIAL_SETTING_THEME_MODE.LIGHT]: 'enum.setting.themeMode.light',
    [FINANCIAL_SETTING_THEME_MODE.DARK]: 'enum.setting.themeMode.dark',
  }
}

export const FinancialSettingThemeModeHelper =
  new FinancialSettingThemeModeHelperImpl()

// ===========================================================================================
// FINANCIAL_SETTING_THEME
// ===========================================================================================
export enum FINANCIAL_SETTING_THEME {
  HUTAO = 'hutao',
}

class FinancialSettingThemeHelperImpl extends BaseEnumHelper<FINANCIAL_SETTING_THEME> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_SETTING_THEME

  protected readonly colorMap: Record<FINANCIAL_SETTING_THEME, string> = {
    [FINANCIAL_SETTING_THEME.HUTAO]: '#a72828', // Đỏ sẫm / Đặc trưng Hu Tao
  }

  protected readonly labelMap: Record<FINANCIAL_SETTING_THEME, string> = {
    [FINANCIAL_SETTING_THEME.HUTAO]: 'enum.setting.theme.huTao',
  }
}

export const FinancialSettingThemeHelper = new FinancialSettingThemeHelperImpl()

// ===========================================================================================
// FINANCIAL_SETTING_LANGUAGE
// ===========================================================================================
export enum FINANCIAL_SETTING_LANGUAGE {
  EN = 'en',
  KO = 'ko',
  VN = 'vn',
}

class FinancialSettingLanguageHelperImpl extends BaseEnumHelper<FINANCIAL_SETTING_LANGUAGE> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_SETTING_LANGUAGE

  protected readonly colorMap: Record<FINANCIAL_SETTING_LANGUAGE, string> = {
    [FINANCIAL_SETTING_LANGUAGE.EN]: '#3b82f6', // Xanh dương (Tiếng Anh)
    [FINANCIAL_SETTING_LANGUAGE.KO]: '#ef4444', // Đỏ (Tiếng Hàn)
    [FINANCIAL_SETTING_LANGUAGE.VN]: '#10b981', // Xanh lá (Tiếng Việt)
  }

  protected readonly labelMap: Record<FINANCIAL_SETTING_LANGUAGE, string> = {
    [FINANCIAL_SETTING_LANGUAGE.EN]: 'enum.setting.language.en',
    [FINANCIAL_SETTING_LANGUAGE.KO]: 'enum.setting.language.ko',
    [FINANCIAL_SETTING_LANGUAGE.VN]: 'enum.setting.language.vn',
  }
}

export const FinancialSettingLanguageHelper =
  new FinancialSettingLanguageHelperImpl()

// ===========================================================================================
// FINANCIAL_SETTING_CURRENCY
// ===========================================================================================
export enum FINANCIAL_SETTING_CURRENCY {
  USD = 'usd',
  KRW = 'krw',
  VND = 'vnd',
}

class FinancialSettingCurrencyHelperImpl extends BaseEnumHelper<FINANCIAL_SETTING_CURRENCY> {
  protected readonly DEFAULT_COLOR = '#808080'
  protected readonly DEFAULT_LABEL = '-'
  protected readonly enumObject = FINANCIAL_SETTING_CURRENCY

  protected readonly colorMap: Record<FINANCIAL_SETTING_CURRENCY, string> = {
    [FINANCIAL_SETTING_CURRENCY.USD]: '#10b981', // Xanh lá (Đô la Mỹ)
    [FINANCIAL_SETTING_CURRENCY.KRW]: '#8b5cf6', // Tím (Won Hàn)
    [FINANCIAL_SETTING_CURRENCY.VND]: '#f59e0b', // Cam/Vàng (Đồng Việt Nam)
  }

  protected readonly labelMap: Record<FINANCIAL_SETTING_CURRENCY, string> = {
    [FINANCIAL_SETTING_CURRENCY.USD]: 'enum.setting.currency.usd',
    [FINANCIAL_SETTING_CURRENCY.KRW]: 'enum.setting.currency.krw',
    [FINANCIAL_SETTING_CURRENCY.VND]: 'enum.setting.currency.vnd',
  }
}

export const FinancialSettingCurrencyHelper =
  new FinancialSettingCurrencyHelperImpl()
