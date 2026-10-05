import React, { useState } from 'react'
import { Flex, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useSettingStore } from '../_store/setting.store'
import { SettingsAppearance } from './SettingsAppearance'
import { SettingsLocalization } from './SettingsLocalization'
import { SettingsNotifications } from './SettingsNotifications'
import { SettingsSecurity } from './SettingsSecurity'
import { SettingsDataManagement } from './SettingsDataManagement'
import type { NotificationSettings, SecuritySettings } from './types'
import type { IFinance_Setting } from '@/shared/api/financial/setting/setting.type'

import { useMutationFinanceSetting } from '@/shared/api/financial/setting/setting.mutation'
import { FINANCIAL_SETTING_THEME_MODE } from '@/shared/api/financial/setting/setting.enum'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '@/shared/lib/service/local-storage'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'

const { Title, Text } = Typography
const Settings = () => {
  const { t, i18n } = useTranslation('settings')
  const { toggle } = useThemeMode()
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

  const handleSaveSettings = async (request: Partial<IFinance_Setting>) => {
    try {
      await mUpdate.mutateAsync(
        {
          body: request,
        },
        {
          onSuccess(data, variables, onMutateResult, context) {
            if (request.themeMode) {
              toggle()
              LocalStorageService.set(
                LOCAL_STORAGE_KEY.THEME,
                request.themeMode,
              )
            }
            if (request.language) {
              i18n.changeLanguage(request.language)
              LocalStorageService.set(
                LOCAL_STORAGE_KEY.LANGUAGE,
                request.language,
              )
            }
          },
        },
      )
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
              {t('page.title')}
            </Title>
            <Text type="secondary">{t('page.subtitle')}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('page.loading')}
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
            {t('page.title')}
          </Title>
          <Text type="secondary">{t('page.subtitle')}</Text>
        </div>

        {/* Sections */}
        <SettingsAppearance
          setting={setting}
          toggle={() =>
            handleSaveSettings({
              themeMode:
                setting.themeMode === FINANCIAL_SETTING_THEME_MODE.LIGHT
                  ? FINANCIAL_SETTING_THEME_MODE.DARK
                  : FINANCIAL_SETTING_THEME_MODE.LIGHT,
            })
          }
        />

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
            {t('page.footer')}
          </Text>
        </div>
      </Space>
    </Flex>
  )
}
export default Settings
