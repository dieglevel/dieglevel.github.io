import React from 'react'
import { Card, List, Segmented, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { BgColorsOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import type { IFinance_Setting } from '@/shared/api/financial/setting/setting.type'
import { FINANCIAL_SETTING_THEME_MODE } from '@/shared/api/financial/setting/setting.enum'

const { Text } = Typography

interface Props {
  setting: IFinance_Setting
  toggle: () => void
}

export const SettingsAppearance: React.FC<Props> = ({
  setting,
  toggle,
}: Props) => {
  const { t } = useTranslation('settings')

  return (
    <Card
      title={
        <Space>
          <BgColorsOutlined style={{ color: '#1677ff' }} />
          <span>{t('appearance.title')}</span>
        </Space>
      }
    >
      <List itemLayout="horizontal">
        <List.Item
          extra={
            <Segmented
              value={setting.themeMode}
              onChange={toggle}
              options={[
                {
                  label: t('appearance.light'),
                  value: FINANCIAL_SETTING_THEME_MODE.LIGHT,
                  icon: <SunOutlined />,
                },
                {
                  label: t('appearance.dark'),
                  value: FINANCIAL_SETTING_THEME_MODE.DARK,
                  icon: <MoonOutlined />,
                },
              ]}
            />
          }
        >
          <List.Item.Meta
            title={t('appearance.darkMode')}
            description={
              <Text type="secondary">
                {t('appearance.darkModeDescription')}
              </Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
