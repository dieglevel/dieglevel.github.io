import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '@/shared/lib/service/local-storage'

const exchangeRates = {
  VND: 1,
  USD: 26100,
  KRW: 19,
  JPY: 176,
} as const

type Currency = keyof typeof exchangeRates

export function convertCurrency(amountVND: number, locale = 'vi-VN'): string {
  const to = (LocalStorageService.get(LOCAL_STORAGE_KEY.CURRENCY, 'VND') ||
    'VND') as Currency

  const converted = amountVND / exchangeRates[to]

  if (to === 'VND') {
    return `${new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(converted)} Đ`
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: to,
    maximumFractionDigits: 2,
  }).format(converted)
}
