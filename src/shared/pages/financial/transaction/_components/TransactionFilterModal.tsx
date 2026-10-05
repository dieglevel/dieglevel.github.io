import React from 'react'
import { Button, Flex, Modal, Select, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('finance')

  return (
    <Modal
      title={
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingRight: 24 }}
        >
          <span>{t('transaction.title')}</span>
          {activeFilterCount > 0 && (
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={onResetFilter}
            >
              {t('common.cancel')}
            </Button>
          )}
        </Flex>
      }
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText={t('common.save')}
      cancelText={t('common.close')}
      centered
      width={420}
    >
      <Space
        vertical
        size="middle"
        style={{ width: '100%', marginTop: 16 }}
      >
        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            {t('common.type')}
          </Text>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: t('transaction.allTypes') },
              { value: 'income', label: t('transaction.income') },
              { value: 'expense', label: t('transaction.expense') },
            ]}
          />
        </div>

        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            {t('common.wallet')}
          </Text>
          <Select
            value={walletFilter}
            onChange={setWalletFilter}
            style={{ width: '100%' }}
            options={[{ value: 'all', label: t('transaction.allWallets') }, ...walletOptions]}
          />
        </div>

        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            {t('common.category')}
          </Text>
          <Select
            value={catFilter}
            onChange={setCatFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: t('transaction.allCategories') },
              ...categoryOptions,
            ]}
          />
        </div>

        <div>
          <Text
            strong
            style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
          >
            {t('common.status')}
          </Text>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%' }}
            options={[
              { value: 'all', label: t('transaction.allStatuses') },
              { value: 'completed', label: t('transaction.completed') },
              { value: 'pending', label: t('transaction.pending') },
              { value: 'failed', label: t('transaction.failed') },
            ]}
          />
        </div>
      </Space>
    </Modal>
  )
}
