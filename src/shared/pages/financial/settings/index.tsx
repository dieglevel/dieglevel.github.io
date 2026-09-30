import React, { useState } from 'react'
import { Flex, Space, Typography } from 'antd'

import { useSettingStore } from '../_store/setting.store'
import { SettingsAppearance } from './SettingsAppearance'
import { SettingsLocalization } from './SettingsLocalization'
import { SettingsNotifications } from './SettingsNotifications'
import { SettingsSecurity } from './SettingsSecurity'
import { SettingsDataManagement } from './SettingsDataManagement'
import type { NotificationSettings, SecuritySettings } from './types'
import type { IFinance_Setting } from '@/shared/api/financial/setting/setting.type'

import { useMutationFinanceSetting } from '@/shared/api/financial/setting/setting.mutation'

const { Title, Text } = Typography

export function Settings() {
  const [isDark, setIsDark] = useState(false)

  const toggleDark = () => {
    setIsDark((prev) => !prev)
  }

  const [notifications, setNotifications] = useState<NotificationSettings>({
    budgetAlerts: true,
    largeTransactions: true,
    weeklyReport: false,
    monthlyReport: true,
    unusualActivity: true,
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    biometric: true,
    sessionTimeout: '30min',
  })

  const setting = useSettingStore((state) => state.setting)

  const { mUpdate } = useMutationFinanceSetting()

  const handleSaveSettings = async (data: Partial<IFinance_Setting>) => {
    try {
      await mUpdate.mutateAsync({
        body: data,
      })
      console.log('Settings saved successfully:', data)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  if (setting === null) {
    return (
      <Flex flex={1} style={{ minWidth: 320, width: 'auto', padding: 24 }}>
        <Space vertical size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>
              Settings
            </Title>
            <Text type="secondary">Manage your preferences and account</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Loading settings...
          </Text>
        </Space>
      </Flex>
    )
  }

  return (
    <Flex flex={1} style={{ minWidth: 320, width: 'auto', padding: 24 }}>
      <Space vertical size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Settings
          </Title>
          <Text type="secondary">Manage your preferences and account</Text>
        </div>

        {/* Sections */}
        <SettingsAppearance isDark={isDark} toggleDark={toggleDark} />

        <SettingsLocalization setting={setting} onUpdate={handleSaveSettings} />

        <SettingsNotifications
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <SettingsSecurity security={security} setSecurity={setSecurity} />

        <SettingsDataManagement />

        {/* Footer info */}
        <div style={{ textAlign: 'center', paddingTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            FinanceOS v0.1 · Control your money, control your life.
          </Text>
        </div>
      </Space>
    </Flex>
  )
}

export default Settings
