import React from 'react'
import { Card, List, Select, Space, Typography } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import type { IFinance_Setting } from '@/shared/api/financial/setting/setting.type'
import {
  FinancialSettingCurrencyHelper,
  FinancialSettingLanguageHelper,
} from '@/shared/api/financial/setting/setting.enum'

const { Text } = Typography

interface Props {
  setting: IFinance_Setting
  onUpdate: (data: Partial<IFinance_Setting>) => void
}

export const SettingsLocalization: React.FC<Props> = ({
  setting,
  onUpdate,
}) => {
  return (
    <Card
      title={
        <Space>
          <GlobalOutlined style={{ color: '#1677ff' }} />
          <span>Localization</span>
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
            title="Currency"
            description={
              <Text type="secondary">Default currency for display</Text>
            }
          />
        </List.Item>

        <List.Item
          extra={
            <Select
              value={setting.language}
              onChange={(val) => onUpdate({ language: val })}
              style={{ width: 160 }}
              options={FinancialSettingLanguageHelper.getOptions()}
            />
          }
        >
          <List.Item.Meta
            title="Language"
            description={
              <Text type="secondary">Interface display language</Text>
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
            title="Cycle Start Date"
            description={
              <Text type="secondary">
                The date when each financial cycle starts
              </Text>
            }
          />
        </List.Item>
      </List>
    </Card>
  )
}
