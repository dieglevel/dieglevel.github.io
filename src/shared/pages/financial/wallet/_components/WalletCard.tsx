import { useState } from 'react'
import { Button, Card, Popconfirm, Space } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'

export function WalletCard({
  wallet,
  onEdit,
  onDelete,
}: {
  wallet: IWallet_Wallet
  onEdit: () => void
  onDelete: () => void
}) {
  const [visible, setVisible] = useState(false)
  const isNegative = wallet.balance < 0

  return (
    <Card
      variant="borderless"
      style={{
        background: `linear-gradient(135deg, ${wallet.color}e0, ${wallet.color}90)`,
        borderRadius: 16,
        aspectRatio: '20/9',
        minHeight: 180,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      }}
      styles={{
        body: {
          padding: 20,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        },
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: -32,
          right: -32,
          width: 128,
          height: 128,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -24,
          left: -24,
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: `${wallet.color}ff`,
              borderRadius: 8,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
            }}
          >
            <IconRenderer iconName={wallet.icon} size={32} color={'#ffffff'} />
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              margin: '4px 0 0',
            }}
          >
            {wallet.name}
          </p>
          <p
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}
          >
            {wallet.type.toUpperCase()}
          </p>
        </div>
        <Space size={4}>
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
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ color: '#fff' }} />}
            onClick={onEdit}
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          />
          <Popconfirm
            title={`Delete ${wallet.name}?`}
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={onDelete}
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined style={{ color: '#fff' }} />}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
          </Popconfirm>
        </Space>
      </div>

      {/* Bottom row */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 4,
            letterSpacing: 2,
          }}
        >
          ●●●● ●●●● ●●●●
        </p>

        <p
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#fff',
            fontFamily: "'JetBrains Mono', monospace",
            margin: 0,
          }}
        >
          {visible
            ? (isNegative ? '-' : '') +
              convertCurrency(wallet.balance, undefined, false)
            : '●●●●●'}
        </p>
        <p
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}
        >
          VND
        </p>
      </div>
    </Card>
  )
}
