import React from 'react'
import { Button, Card, Empty } from 'antd'
import { Wallet } from 'lucide-react'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val || 0)
}

interface WalletListWidgetProps {
  wallets: WalletOverviewItem[]
  onNavigateToWallet: () => void
}

export const WalletListWidget: React.FC<WalletListWidgetProps> = ({
  wallets,
  onNavigateToWallet,
}) => {
  return (
    <Card
      title={
        <span
          style={{
            color: '#0f172a',
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Wallet size={18} color="#4f46e5" /> Danh Sách Ví Tài Chính
        </span>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToWallet}
          style={{ color: '#4f46e5', fontSize: 13 }}
        >
          Quản lý ví
        </Button>
      }
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {wallets.length === 0 ? (
        <Empty description="Chưa tạo ví tài chính nào" />
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
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
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
                      color: '#0f172a',
                      fontSize: 14,
                    }}
                  >
                    {w.name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>
                    {w.type || 'Ví chung'}
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
                  {formatVND(w.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
