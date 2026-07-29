import React, { useState } from 'react'
import { Flex, Space, Typography } from 'antd'

import { SettingsAppearance } from './SettingsAppearance'
import { SettingsLocalization } from './SettingsLocalization'
import { SettingsNotifications } from './SettingsNotifications'
import { SettingsSecurity } from './SettingsSecurity'
import { SettingsDataManagement } from './SettingsDataManagement'
import type { NotificationSettings, SecuritySettings } from './types'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '@/shared/lib/service/local-storage'

const { Title, Text } = Typography

export function Settings() {
  const [isDark, setIsDark] = useState(false)

  const toggleDark = () => {
    setIsDark((prev) => !prev)
  }
  const [currency, setCurrency] = useState<string | null>(
    LocalStorageService.get(LOCAL_STORAGE_KEY.CURRENCY, 'VND'),
  )
  const [language, setLanguage] = useState<string | null>(
    LocalStorageService.get(LOCAL_STORAGE_KEY.LANGUAGE, 'English'),
  )

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    LocalStorageService.set(LOCAL_STORAGE_KEY.CURRENCY, newCurrency)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    LocalStorageService.set(LOCAL_STORAGE_KEY.LANGUAGE, newLanguage)
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

  return (
    <Flex flex={1} style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Settings
          </Title>
          <Text type="secondary">Manage your preferences and account</Text>
        </div>

        {/* Sections */}
        <SettingsAppearance isDark={isDark} toggleDark={toggleDark} />

        <SettingsLocalization
          currency={currency}
          setCurrency={handleCurrencyChange}
          language={language}
          setLanguage={handleLanguageChange}
        />

        <SettingsNotifications
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <SettingsSecurity security={security} setSecurity={setSecurity} />

        <SettingsDataManagement />

        {/* Footer info */}
        <div style={{ textAlign: 'center', paddingTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            FinanceOS v2.0.1 · Built with ♥ for your financial freedom
          </Text>
        </div>
      </Space>
    </Flex>
  )
}

export default Settings
