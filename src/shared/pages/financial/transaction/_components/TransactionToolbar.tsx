import React from 'react'
import { Badge, Button, Input, Select, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import type { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'

interface SelectOption {
  value: number | string
  label: string
}

interface TransactionToolbarProps {
  tabs: Array<{ key: string; label: React.ReactNode }>
  activeTab: string
  onTabChange: (key: string) => void
  search: string
  onSearchChange: (value: string) => void
  activeFilterCount: number
  onOpenFilterModal: () => void
  typeFilter: 'all' | FINANCIAL_TRANSACTION_TYPE
  walletFilter: number | 'all'
  setWalletFilter: (value: number | 'all') => void
  catFilter: number | 'all'
  statusFilter: string
  walletOptions: Array<SelectOption>
  categoryOptions: Array<SelectOption>
  onClearType: () => void
  onClearCat: () => void
  onClearStatus: () => void
  onResetAll: () => void
}

/** Tab dạng pill + tìm kiếm + chọn ví + nút bộ lọc, kèm chip bộ lọc đang bật. */
export const TransactionToolbar: React.FC<TransactionToolbarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilterModal,
  typeFilter,
  walletFilter,
  setWalletFilter,
  catFilter,
  statusFilter,
  walletOptions,
  categoryOptions,
  onClearType,
  onClearCat,
  onClearStatus,
  onResetAll,
}) => {
  const { t } = useTranslation('finance')
  const hasChips =
    typeFilter !== 'all' || catFilter !== 'all' || statusFilter !== 'all'

  return (
    <>
      <div className="tx-bar">
        <div className="tx-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={tab.key === activeTab}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tx-tools">
          <Input
            placeholder={t('transaction.searchPlaceholder')}
            aria-label={t('transaction.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
          <Select<number | 'all'>
            aria-label={t('transaction.allWallets')}
            value={walletFilter}
            onChange={setWalletFilter}
            options={[
              { value: 'all', label: t('transaction.allWallets') },
              ...walletOptions.map((w) => ({
                value: w.value as number,
                label: w.label,
              })),
            ]}
          />
          <Badge count={activeFilterCount} size="small">
            <Button
              icon={<FilterOutlined />}
              aria-label={t('common.allTypes')}
              onClick={onOpenFilterModal}
            />
          </Badge>
        </div>
      </div>

      {hasChips && (
        <div className="tx-chips">
          {typeFilter !== 'all' && (
            <Tag closable onClose={onClearType}>
              {t('common.type')}: {typeFilter}
            </Tag>
          )}
          {catFilter !== 'all' && (
            <Tag closable onClose={onClearCat}>
              {t('common.category')}:{' '}
              {categoryOptions.find((c) => c.value === catFilter)?.label}
            </Tag>
          )}
          {statusFilter !== 'all' && (
            <Tag closable onClose={onClearStatus}>
              {t('common.status')}: {statusFilter}
            </Tag>
          )}
          <Button
            type="link"
            size="small"
            onClick={onResetAll}
            style={{ padding: 0 }}
          >
            {t('common.delete')}
          </Button>
        </div>
      )}
    </>
  )
}
