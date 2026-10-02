import React from 'react'
import { Card, List, Segmented, Space, Typography } from 'antd'
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
  return (
    <Card
      title={
        <Space>
          <BgColorsOutlined style={{ color: '#1677ff' }} />
          <span>Appearance</span>
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
                  label: 'Light',
                  value: FINANCIAL_SETTING_THEME_MODE.LIGHT,
                  icon: <SunOutlined />,
                },
                {
                  label: 'Dark',
                  value: FINANCIAL_SETTING_THEME_MODE.DARK,
                  icon: <MoonOutlined />,
                },
              ]}
            />
          }
        >
          <List.Item.Meta
            title="Dark Mode"
            description={
              <Text type="secondary">
                Switch between light and dark interface
              </Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
