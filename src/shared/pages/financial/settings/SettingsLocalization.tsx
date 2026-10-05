import React from 'react'
import { Card, List, Select, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { GlobalOutlined } from '@ant-design/icons'
import type { IFinance_Setting } from '@/shared/api/financial/setting/setting.type'
import { FinancialSettingCurrencyHelper } from '@/shared/api/financial/setting/setting.enum'
import { LanguageHelper } from '@/i18n/enum'

const { Text } = Typography

interface Props {
  setting: IFinance_Setting
  onUpdate: (data: Partial<IFinance_Setting>) => void
}

export const SettingsLocalization: React.FC<Props> = ({
  setting,
  onUpdate,
}) => {
  const { t } = useTranslation('settings')

  return (
    <Card
      title={
        <Space>
          <GlobalOutlined style={{ color: '#1677ff' }} />
          <span>{t('localization.title')}</span>
        </Space>
      }
    >
      <List itemLayout="horizontal">
        <List.Item
          extra={
            <Select
              value={setting.currency}
              onChange={(val) => onUpdate({ currency: val })}
              style={{ width: 220 }}
              options={FinancialSettingCurrencyHelper.getOptions()}
            />
          }
        >
          <List.Item.Meta
            title={t('localization.currency')}
            description={
              <Text type="secondary">
                {t('localization.currencyDescription')}
              </Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Select
              value={setting.language}
              onChange={(val) => onUpdate({ language: val })}
              style={{ width: 160 }}
              options={LanguageHelper.getOptions()}
            />
          }
        >
          <List.Item.Meta
            title={t('localization.language')}
            description={
              <Text type="secondary">
                {t('localization.languageDescription')}
              </Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Select
              value={setting.cycleStartDate}
              onChange={(val) => onUpdate({ cycleStartDate: val })}
              style={{ width: 160 }}
              options={Array.from({ length: 31 }, (_, i) => ({
                label: `${i + 1}`,
                value: i + 1,
              }))}
            />
          }
        >
          <List.Item.Meta
            title={t('localization.cycleStartDate')}
            description={
              <Text type="secondary">
                {t('localization.cycleStartDateDescription')}
              </Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
