import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import vi from './locales/vi/common.json'
import ko from './locales/ko/common.json'
import enSettings from './locales/en/finance/settings.json'
import viSettings from './locales/vi/finance/settings.json'
import koSettings from './locales/ko/finance/settings.json'
import enDashboard from './locales/en/finance/dashboard.json'
import viDashboard from './locales/vi/finance/dashboard.json'
import koDashboard from './locales/ko/finance/dashboard.json'
import enFinance from './locales/en/finance'
import viFinance from './locales/vi/finance'
import koFinance from './locales/ko/finance'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '@/shared/lib/service/local-storage'

const translations = {
  en: {
    common: en,
    settings: enSettings,
    dashboard: enDashboard,
    finance: enFinance,
  },
  vi: {
    common: vi,
    settings: viSettings,
    dashboard: viDashboard,
    finance: viFinance,
  },
  ko: {
    common: ko,
    settings: koSettings,
    dashboard: koDashboard,
    finance: koFinance,
  },
}

const resource = translations

i18n.use(initReactI18next).init({
  resources: resource,
  lng: LocalStorageService.get<string>(LOCAL_STORAGE_KEY.LANGUAGE) || 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
