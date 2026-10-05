import { Flex, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import type { LanguageEnum } from '@/i18n/enum'
import { LanguageHelper } from '@/i18n/enum'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '@/shared/lib/service/local-storage'

export const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const changeLanguage = async (language: LanguageEnum) => {
    await i18n.changeLanguage(language)
    LocalStorageService.set(LOCAL_STORAGE_KEY.LANGUAGE, language)
  }
  return (
    <Flex
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
      }}
    >
      <Select
        value={i18n.resolvedLanguage}
        onChange={(e) => changeLanguage(e as any)}
        options={LanguageHelper.getOptions()}
      />
    </Flex>
  )
}
