import React from 'react'
import { Button, Select, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { PlusCircle } from 'lucide-react'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { DashboardTimeFrame } from '@/shared/api/financial/dashboard/dashboard.type'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'
// Chỉnh lại đường dẫn import cho đúng với project của bạn

const { Title, Text } = Typography

interface DashboardHeaderProps {
  timeFrame: DashboardTimeFrame
  setTimeFrame: (tf: DashboardTimeFrame) => void
  selectedWalletId?: number
  setSelectedWalletId: (id?: number) => void
  wallets: Array<WalletOverviewItem>
  onNavigateToCreateTransaction: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeFrame,
  setTimeFrame,
  selectedWalletId,
  setSelectedWalletId,
  wallets,
  onNavigateToCreateTransaction,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, state, shadow, radius } = getTokens(mode)

  const timeFrames = [
    { key: DashboardTimeFrame.WEEKLY, label: t('header.thisWeek') },
    { key: DashboardTimeFrame.MONTHLY, label: t('header.thisMonth') },
    { key: DashboardTimeFrame.YEARLY, label: t('header.thisYear') },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
        padding: '20px 24px',
        borderRadius: radius.lg,
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          {t('header.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {t('header.subtitle')}
        </Text>
      </div>

      <Space wrap size="middle">
        {/* Timeframe Filter Buttons */}
        <div
          style={{
            background: state.hover,
            padding: 4,
            borderRadius: radius.md,
            border: `1px solid ${border.base}`,
            display: 'flex',
            gap: 4,
          }}
        >
          {timeFrames.map((tf) => {
            const active = timeFrame === tf.key
            return (
              <Button
                key={tf.key}
                type={active ? 'primary' : 'text'}
                size="small"
                onClick={() => setTimeFrame(tf.key)}
                style={{
                  borderRadius: radius.sm,
                  fontWeight: 500,
                  fontSize: 13,
                  boxShadow: active ? shadow.button : 'none',
                }}
              >
                {tf.label}
              </Button>
            )
          })}
        </div>

        {/* Wallet Selector */}
        <Select
          placeholder={t('header.allWallets')}
          allowClear
          value={selectedWalletId}
          onChange={(val) => setSelectedWalletId(val)}
          style={{ width: 160 }}
          options={[
            { value: undefined, label: t('header.allWallets') },
            ...wallets.map((w) => ({ value: w.id, label: w.name })),
          ]}
        />

        {/* Quick Add Transaction */}
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          onClick={onNavigateToCreateTransaction}
          style={{
            borderRadius: radius.md,
            height: 36,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {t('header.newTransaction')}
        </Button>
      </Space>
    </div>
  )
}
