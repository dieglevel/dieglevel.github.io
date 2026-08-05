import React from 'react'
import { Button, Flex, Space, Typography } from 'antd'
import { HistoryOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface WalletHeaderProps {
  onToggleHistory: () => void
  onOpenTransfer: () => void
  onOpenAdd: () => void
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  onToggleHistory,
  onOpenTransfer,
  onOpenAdd,
}) => {
  return (
    <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Wallets
        </Title>
        <Text type="secondary">Manage your accounts &amp; balances</Text>
      </div>

      <Space
        size={8}
        wrap
        style={{ width: '100%', justifyContent: 'flex-end' }}
      >
        <Button icon={<HistoryOutlined />} onClick={onToggleHistory}>
          Transfer History
        </Button>
        <Button icon={<SwapOutlined />} onClick={onOpenTransfer}>
          Transfer
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={onOpenAdd}>
          Add Wallet
        </Button>
      </Space>
    </Flex>
  )
}
