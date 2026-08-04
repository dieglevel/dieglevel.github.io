import { useState } from 'react'
import { Button, Card, Popconfirm, Space, Tooltip } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
} from '@ant-design/icons'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_WALLET_TYPE,
  FINANCIAL_WALLET_TYPE_OPTIONS,
} from '@/shared/api/financial/wallet/wallet.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface WalletCardProps {
  wallet: IFinance_Wallet
  onEdit: () => void
  onDelete: () => void
}

export function WalletCard({ wallet, onEdit, onDelete }: WalletCardProps) {
  const [visible, setVisible] = useState(false)

  const isCreditCard =
    wallet.type === FINANCIAL_WALLET_TYPE.CREDIT_CARD ||
    wallet.creditLimit != null
  const isNegative = wallet.balance < 0

  const typeLabel =
    FINANCIAL_WALLET_TYPE_OPTIONS[wallet.type].label || wallet.type

  // Format hiển thị số tài khoản dạng •••• 1234
  const displayAccountNumber = wallet.accountNumberMasked
    ? wallet.accountNumberMasked.replace(/.(?=.{4})/g, '•')
    : '•••• •••• ••••'

  return (
    <Card
      variant="borderless"
      style={{
        background: `linear-gradient(135deg, ${wallet.color}E6, ${wallet.color}99)`,
        borderRadius: 16,
        width: '100%',
        minHeight: 200,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        color: '#fff',
      }}
      styles={{
        body: {
          padding: '18px 20px',
          height: '100%',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Background Decor */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 130,
          height: 130,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(4px)',
              borderRadius: 12,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <IconRenderer iconName={wallet.icon} size={26} color="#ffffff" />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fff',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={wallet.name}
              >
                {wallet.name}
              </p>
              {wallet.isLockedForDailySpending && (
                <Tooltip title="Ví bị khóa chi tiêu hàng ngày">
                  <LockOutlined
                    style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}
                  />
                </Tooltip>
              )}
            </div>

            <p
              style={{
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '2px 0 0',
              }}
            >
              {wallet.institutionName ? `${wallet.institutionName} • ` : ''}
              {typeLabel.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <Space size={4} style={{ flexShrink: 0, marginLeft: 8 }}>
          <Tooltip title={visible ? 'Ẩn số dư' : 'Hiện số dư'}>
            <Button
              type="text"
              size="small"
              icon={
                visible ? (
                  <EyeInvisibleOutlined style={{ color: '#fff' }} />
                ) : (
                  <EyeOutlined style={{ color: '#fff' }} />
                )
              }
              onClick={() => setVisible((v) => !v)}
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#fff' }} />}
              onClick={onEdit}
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            />
          </Tooltip>
          <Popconfirm
            title={`Xóa ví "${wallet.name}"?`}
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={onDelete}
          >
            <Tooltip title="Xóa ví">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined style={{ color: '#fff' }} />}
                style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      </div>

      {/* Account Masked Number */}
      <div style={{ zIndex: 1, marginTop: 12 }}>
        <p
          style={{
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            letterSpacing: 1.5,
            fontFamily: 'monospace',
          }}
        >
          {displayAccountNumber}
        </p>
      </div>

      {/* Balance & Metrics */}
      <div style={{ zIndex: 1, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <p
            style={{
              fontSize: 'clamp(20px, 4vw, 26px)',
              fontWeight: 700,
              color: '#fff',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              margin: 0,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {visible
              ? `${isNegative ? '-' : ''}${convertCurrency(Math.abs(wallet.balance), undefined, false)}`
              : '••••••••'}
          </p>
          <span
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
            }}
          >
            VND
          </span>
        </div>

        {/* Credit Card Specific Metrics */}
        {isCreditCard && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.15)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <div>
              <span>Dư nợ: </span>
              <strong>
                {visible
                  ? convertCurrency(wallet.currentDebt ?? 0, undefined, false)
                  : '••••'}
              </strong>
            </div>
            <div>
              <span>Hạn mức: </span>
              <strong>
                {visible
                  ? convertCurrency(wallet.creditLimit ?? 0, undefined, false)
                  : '••••'}
              </strong>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
