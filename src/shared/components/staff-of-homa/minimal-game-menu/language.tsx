import { Flex, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import type { LanguageEnum } from '@/i18n/enum'
import { LanguageHelper } from '@/i18n/enum'
import { i18nChangeLanguage } from '@/i18n'

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  return (
    <Flex
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
      }}
    >
      <Select<LanguageEnum>
        value={i18n.resolvedLanguage as LanguageEnum}
        onChange={(e) => i18nChangeLanguage(e)}
        options={LanguageHelper.getOptions()}
      />
    </Flex>
  )
}
