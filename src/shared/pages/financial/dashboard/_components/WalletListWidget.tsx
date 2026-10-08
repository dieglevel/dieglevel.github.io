import React from 'react'
import { Button, Card, Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Wallet } from 'lucide-react'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface WalletListWidgetProps {
  wallets: Array<WalletOverviewItem>
  onNavigateToWallet: () => void
}

export const WalletListWidget: React.FC<WalletListWidgetProps> = ({
  wallets,
  onNavigateToWallet,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, state, radius, text } = getTokens(mode)

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.md,
              background: '#4f46e518',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={18} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {t('wallets.title')}
          </span>
        </div>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToWallet}
          style={{
            color: '#4f46e5',
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {t('wallets.manage')}
          <ArrowUpRight size={14} />
        </Button>
      }
      style={{
        borderRadius: radius.lg,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px',
        },
      }}
    >
      {wallets.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
          }}
        >
          <Empty description={t('wallets.empty')} />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {wallets.map((w) => (
            <div
              key={w.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: radius.md,
                border: `1px solid ${border.base}`,
                background: state.hover,
                transition: 'transform 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: radius.sm,
                    background: w.color ? `${w.color}20` : '#e0e7ff',
                    color: w.color || '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  <Wallet size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: text.primary,
                    }}
                  >
                    {w.name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>
                    {w.type || t('wallets.defaultType')}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#0284c7',
                    fontSize: 15,
                  }}
                >
                  {convertCurrency(w.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
