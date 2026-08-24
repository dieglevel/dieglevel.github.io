import React from 'react'
import { Button, Card, Popconfirm, Space, Tag, Tooltip, message } from 'antd'
import { DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_WALLET_TYPE,
  FinancialWalletTypeHelper,
} from '@/shared/api/financial/wallet/wallet.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface WalletCardProps {
  wallet: IFinance_Wallet
  onEdit: () => void
  onDelete: () => void
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  onEdit,
  onDelete,
}) => {
  const isCreditCard =
    wallet.type === FINANCIAL_WALLET_TYPE.E_WALLET || wallet.creditLimit != null

  const typeLabel = FinancialWalletTypeHelper.getLabel(wallet.type)

  const displayAccountNumber = wallet.accountNumberMasked
    ? wallet.accountNumberMasked.replace(/.(?=.{4})/g, '•')
    : '•••• •••• ••••'

  const handleCopyApiKey = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!wallet.apiKey) {
      message.warning('Ví này chưa được khởi tạo API Key!')
      return
    }
    navigator.clipboard.writeText(wallet.apiKey)
    message.success('Đã sao chép API Key vào khay nhớ tạm!')
  }

  // Credit Utilization Percentage
  const creditLimit = Number(wallet.creditLimit || 0)
  const currentDebt = Number(wallet.currentDebt || 0)
  const creditUsagePercent =
    creditLimit > 0
      ? Math.min(100, Math.round((currentDebt / creditLimit) * 100))
      : 0

  return (
    <Card
      variant="borderless"
      style={{
        background: `linear-gradient(135deg, ${wallet.color}E6, ${wallet.color}AA)`,
        borderRadius: 20,
        width: '100%',
        minHeight: 210,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        color: '#fff',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      styles={{
        body: {
          padding: '20px 22px',
          height: '100%',
          minHeight: 210,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Glossy Background Accents */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Icon, Name & Actions */}
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
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(8px)',
              borderRadius: 14,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            }}
          >
            <IconRenderer iconName={wallet.icon} size={26} color="#ffffff" />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h4
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  letterSpacing: -0.2,
                }}
                title={wallet.name}
              >
                {wallet.name}
              </h4>
              {wallet.isLockedForDailySpending && (
                <Tooltip title="Ví bị khóa khỏi tổng chi tiêu hàng ngày">
                  <Tag
                    color="warning"
                    style={{
                      margin: 0,
                      borderRadius: 10,
                      padding: '0 6px',
                      fontSize: 10,
                      lineHeight: '18px',
                      background: 'rgba(251, 146, 60, 0.3)',
                      borderColor: 'rgba(251, 146, 60, 0.5)',
                      color: '#fff',
                    }}
                  >
                    <LockOutlined style={{ marginRight: 2 }} /> Khóa
                  </Tag>
                </Tooltip>
              )}
            </div>

            <p
              style={{
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '2px 0 0',
                fontWeight: 500,
              }}
            >
              {wallet.institutionName ? `${wallet.institutionName} • ` : ''}
              {typeLabel.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <Space size={6} style={{ flexShrink: 0, marginLeft: 8 }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#fff' }} />}
              onClick={onEdit}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
              }}
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
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      </div>

      {/* EMV Chip & Account Masked Number */}
      <div
        style={{
          zIndex: 1,
          marginTop: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: 32,
            height: 24,
            borderRadius: 5,
            background: 'linear-gradient(135deg, #fce055 0%, #d8a027 100%)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}
        />
        <p
          style={{
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.85)',
            margin: 0,
            letterSpacing: 2,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}
        >
          {displayAccountNumber}
        </p>
      </div>

      {/* Balance & Metrics */}
      <div style={{ zIndex: 1, marginTop: 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Số dư hiện tại
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <p
                style={{
                  fontSize: 'clamp(22px, 4vw, 28px)',
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.2,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {convertCurrency(Math.abs(wallet.balance), undefined, false)}
              </p>
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 600,
                }}
              >
                VND
              </span>
            </div>
          </div>

          {/* Quick API Key Copy Pill */}
        </div>

        {/* Credit Card Specific Metrics */}
        {isCreditCard && creditLimit > 0 && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.2)',
              fontSize: 11,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: 4,
              }}
            >
              <span>Dư nợ: {convertCurrency(currentDebt)}</span>
              <span>Hạn mức: {convertCurrency(creditLimit)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
