import React from 'react'
import { Badge, Button, Card, Flex, Input, Tag, Typography } from 'antd'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import type { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'

const { Text } = Typography

interface SelectOption {
  value: number | string
  label: string
}

interface TransactionSearchProps {
  isMobile: boolean
  search: string
  onSearchChange: (value: string) => void
  activeFilterCount: number
  onOpenFilterModal: () => void
  typeFilter: 'all' | FINANCIAL_TRANSACTION_TYPE
  walletFilter: number | 'all'
  catFilter: number | 'all'
  statusFilter: string
  walletOptions: Array<SelectOption>
  categoryOptions: Array<SelectOption>
  onClearType: () => void
  onClearWallet: () => void
  onClearCat: () => void
  onClearStatus: () => void
  onResetAll: () => void
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({
  isMobile,
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilterModal,
  typeFilter,
  walletFilter,
  catFilter,
  statusFilter,
  walletOptions,
  categoryOptions,
  onClearType,
  onClearWallet,
  onClearCat,
  onClearStatus,
  onResetAll,
}) => {
  return (
    <Card size="small" styles={{ body: { padding: 12 } }}>
      <Flex gap={10} align="center">
        <Input
          placeholder="Search transactions…"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ flex: 1 }}
          allowClear
        />
        <Badge count={activeFilterCount} color="#1677ff" offset={[-2, 2]}>
          <Button icon={<FilterOutlined />} onClick={onOpenFilterModal}>
            {!isMobile && 'Filters'}
          </Button>
        </Badge>
      </Flex>

      {/* Chips hiển thị bộ lọc đang active */}
      {activeFilterCount > 0 && (
        <Flex wrap gap={6} style={{ marginTop: 10 }}>
          <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
            Active Filters:
          </Text>

          {typeFilter !== 'all' && (
            <Tag closable onClose={onClearType} color="blue">
              Type: {typeFilter}
            </Tag>
          )}
          {walletFilter !== 'all' && (
            <Tag closable onClose={onClearWallet} color="blue">
              Wallet:{' '}
              {walletOptions.find((w) => w.value === walletFilter)?.label}
            </Tag>
          )}
          {catFilter !== 'all' && (
            <Tag closable onClose={onClearCat} color="blue">
              Category:{' '}
              {categoryOptions.find((c) => c.value === catFilter)?.label}
            </Tag>
          )}
          {statusFilter !== 'all' && (
            <Tag closable onClose={onClearStatus} color="blue">
              Status: {statusFilter}
            </Tag>
          )}

          <Button
            type="link"
            size="small"
            onClick={onResetAll}
            style={{ padding: 0, fontSize: 12 }}
          >
            Clear all
          </Button>
        </Flex>
      )}
    </Card>
  )
}
