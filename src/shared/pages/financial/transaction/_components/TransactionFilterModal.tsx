import React from 'react'
import { Button, Flex, Modal, Select, Space, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import type { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'

const { Text } = Typography

interface SelectOption {
  value: number | string
  label: string
}

interface TransactionFilterModalProps {
  open: boolean
  onClose: () => void
  activeFilterCount: number
  typeFilter: 'all' | FINANCIAL_TRANSACTION_TYPE
  setTypeFilter: (val: 'all' | FINANCIAL_TRANSACTION_TYPE) => void
  walletFilter: number | 'all'
  setWalletFilter: (val: number | 'all') => void
  catFilter: number | 'all'
  setCatFilter: (val: number | 'all') => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  walletOptions: Array<SelectOption>
  categoryOptions: Array<SelectOption>
  onResetFilter: () => void
}

export const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  open,
  onClose,
  activeFilterCount,
  typeFilter,
  setTypeFilter,
  walletFilter,
  setWalletFilter,
  catFilter,
  setCatFilter,
  statusFilter,
  setStatusFilter,
  walletOptions,
  categoryOptions,
  onResetFilter,
}) => {
  return (
    <Modal
      title={
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingRight: 24 }}
        >
          <span>Filter Transactions</span>
          {activeFilterCount > 0 && (
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={onResetFilter}
            >
              Reset
            </Button>
          )}
        </Flex>
      }
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Apply Filters"
      cancelText="Close"
      centered
      width={420}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%', marginTop: 16 }}
      >
        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            Transaction Type
          </Text>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
          />
        </div>

        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            Wallet
          </Text>
          <Select
            value={walletFilter}
            onChange={setWalletFilter}
            style={{ width: '100%' }}
            options={[{ value: 'all', label: 'All Wallets' }, ...walletOptions]}
          />
        </div>

        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            Category
          </Text>
          <Select
            value={catFilter}
            onChange={setCatFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categoryOptions,
            ]}
          />
        </div>

        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            Status
          </Text>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </div>
      </Space>
    </Modal>
  )
}
