import React from 'react'
import { Button, Flex, Input, Segmented, Space, Typography } from 'antd'
import {
  HistoryOutlined,
  PlusOutlined,
  SearchOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { FINANCIAL_WALLET_TYPE } from '@/shared/api/financial/wallet/wallet.enum'

const { Title, Text } = Typography

interface WalletHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleHistory: () => void
  onOpenTransfer: () => void
  onOpenAdd: () => void
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onToggleHistory,
  onOpenTransfer,
  onOpenAdd,
}) => {
  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý Ví &amp; Tài khoản
          </Title>
          <Text type="secondary">
            Theo dõi số dư, phân loại loại tiền và đồng bộ thông báo ngân hàng
          </Text>
        </div>

        <Space size={8} wrap style={{ justifyContent: 'flex-end' }}>
          <Button icon={<HistoryOutlined />} onClick={onToggleHistory}>
            Lịch sử chuyển tiền
          </Button>
          <Button icon={<SwapOutlined />} onClick={onOpenTransfer}>
            Chuyển tiền
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenAdd}>
            Thêm ví mới
          </Button>
        </Space>
      </Flex>

      {/* Filter Tabs & Search Bar */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Segmented
          value={activeTab}
          onChange={(val) => onTabChange(val)}
          options={[
            { label: 'Tất cả ví', value: 'ALL' },
            { label: 'Ngân hàng', value: FINANCIAL_WALLET_TYPE.BANK },
            { label: 'Ví điện tử', value: FINANCIAL_WALLET_TYPE.E_WALLET },
            { label: 'Tiền mặt', value: FINANCIAL_WALLET_TYPE.CASH },
            { label: 'Ví đã khóa', value: 'LOCKED' },
          ]}
        />

        <Input
          placeholder="Tìm theo tên ví / ngân hàng..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />
      </Flex>
    </Flex>
  )
}
