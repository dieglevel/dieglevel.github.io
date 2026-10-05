import React from 'react'
import { Button, Flex, Input, Segmented, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('finance')

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {t('wallet.title')}
          </Title>
          <Text type="secondary">
            {t('wallet.subtitle')}
          </Text>
        </div>

        <Space size={8} wrap style={{ justifyContent: 'flex-end' }}>
          <Button icon={<HistoryOutlined />} onClick={onToggleHistory}>
            {t('wallet.history')}
          </Button>
          <Button icon={<SwapOutlined />} onClick={onOpenTransfer}>
            {t('wallet.transfer')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenAdd}>
            {t('wallet.add')}
          </Button>
        </Space>
      </Flex>

      {/* Filter Tabs & Search Bar */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Segmented
          value={activeTab}
          onChange={(val) => onTabChange(val)}
          options={[
            { label: t('wallet.all'), value: 'ALL' },
            { label: t('wallet.bank'), value: FINANCIAL_WALLET_TYPE.BANK },
            { label: t('wallet.eWallet'), value: FINANCIAL_WALLET_TYPE.E_WALLET },
            { label: t('wallet.cash'), value: FINANCIAL_WALLET_TYPE.CASH },
            { label: t('wallet.locked'), value: 'LOCKED' },
          ]}
        />

        <Input
          placeholder={t('wallet.searchPlaceholder')}
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
