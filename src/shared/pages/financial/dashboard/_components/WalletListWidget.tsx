import React from 'react'
import { Button, Card, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { Wallet } from 'lucide-react'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface WalletListWidgetProps {
  wallets: Array<WalletOverviewItem>
  onNavigateToWallet: () => void
}

export const WalletListWidget: React.FC<WalletListWidgetProps> = ({
  wallets,
  onNavigateToWallet,
}) => {
  const { t } = useTranslation('dashboard')

  return (
    <Card
      title={
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Wallet size={18} color="#4f46e5" /> {t('wallets.title')}
        </span>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToWallet}
          style={{ color: '#4f46e5', fontSize: 13 }}
        >
          {t('wallets.manage')}
        </Button>
      }
      style={{
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {wallets.length === 0 ? (
        <Empty description={t('wallets.empty')} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {wallets.map((w) => (
            <div
              key={w.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
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
                    borderRadius: '8px',
                    background: w.color ? `${w.color}15` : '#e0e7ff',
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
