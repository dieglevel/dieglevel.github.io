import React from 'react'
import { Button, Select, Space, Typography } from 'antd'
import { PlusCircle } from 'lucide-react'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { DashboardTimeFrame } from '@/shared/api/financial/dashboard/dashboard.type'

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
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div>
        <Title
          level={3}
          style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}
        >
          Dashboard Tổng Quan Tài Chính
        </Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Theo dõi dòng tiền, thu chi và tình hình tài chính của bạn theo thời
          gian thực.
        </Text>
      </div>

      <Space wrap size="middle">
        {/* Timeframe Filter Buttons */}
        <div
          style={{
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            gap: 4,
          }}
        >
          {[
            { key: DashboardTimeFrame.WEEKLY, label: 'Tuần này' },
            { key: DashboardTimeFrame.MONTHLY, label: 'Tháng này' },
            { key: DashboardTimeFrame.YEARLY, label: 'Năm nay' },
          ].map((tf) => (
            <Button
              key={tf.key}
              type={timeFrame === tf.key ? 'primary' : 'text'}
              size="small"
              onClick={() => setTimeFrame(tf.key)}
              style={{
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '13px',
                boxShadow:
                  timeFrame === tf.key ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tf.label}
            </Button>
          ))}
        </div>

        {/* Wallet Selector */}
        <Select
          placeholder="Tất cả ví"
          allowClear
          value={selectedWalletId}
          onChange={(val) => setSelectedWalletId(val)}
          style={{ width: 160 }}
          options={[
            { value: undefined, label: 'Tất cả các ví' },
            ...wallets.map((w) => ({ value: w.id, label: w.name })),
          ]}
        />

        {/* Quick Add Transaction */}
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          onClick={onNavigateToCreateTransaction}
          style={{
            borderRadius: '8px',
            height: '36px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Giao dịch mới
        </Button>
      </Space>
    </div>
  )
}
