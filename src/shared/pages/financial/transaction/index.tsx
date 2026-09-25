import React, { useEffect, useMemo, useState } from 'react'
import { FloatButton, Grid, Space, Tabs, Tag } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useRouter } from '@tanstack/react-router'
import { TransactionModal } from './_components/TransactionModal'
import { TransactionDetail } from './_components/TransactionDetail'
import { TransactionsTable } from './_components/TransactionsTable'
import { TransactionHeader } from './_components/TransactionHeader'
import { TransactionSearch } from './_components/TransactionSearch'
import { TransactionFilterModal } from './_components/TransactionFilterModal'
import type { TablePaginationConfig, TabsProps } from 'antd'

import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_TRANSACTION_TYPE,
  FinancialTransactionTypeHelper,
} from '@/shared/api/financial/transaction/transaction.enum'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FinancialTransactionStatusHelper,
} from '@/shared/api/financial/wallet/wallet.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { useMutationTransaction } from '@/shared/api/financial/transaction/transaction.mutation'

const { useBreakpoint } = Grid

const tabsData: TabsProps['items'] = [
  { key: 'all', label: 'Tất cả' },
  ...FinancialTransactionTypeHelper.getOptions().map((option) => ({
    key: option.value,
    label: option.label,
  })),
  ...FinancialTransactionStatusHelper.getOptions().map((option) => ({
    key: option.value,
    label: option.label,
  })),
]

type ActiveTab =
  | 'all'
  | FINANCIAL_TRANSACTION_TYPE
  | FINANCIAL_TRANSACTION_STATUS

export function Transactions() {
  const screens = useBreakpoint()
  const router = useRouter()
  const isMobile = !screens.md
  const [page, setPage] = useState(1)
  const [pageData, setPageData] = useState<TablePaginationConfig>({
    current: -1,
    pageSize: 20,
    total: 0,
  })

  const { mTransaction_Delete } = useMutationTransaction()

  const [activeTab, setActiveTab] = useState<ActiveTab>('all')

  // State Bộ lọc & Tìm kiếm
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    'all' | FINANCIAL_TRANSACTION_TYPE
  >('all')
  const [walletFilter, setWalletFilter] = useState<number | 'all'>('all')
  const [catFilter, setCatFilter] = useState<number | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // State UI Controls
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Array<React.Key>>([])
  const [viewTransactionId, setViewTransactionId] = useState<number | null>(
    null,
  )

  const isType = (value: ActiveTab): value is FINANCIAL_TRANSACTION_TYPE =>
    Object.values(FINANCIAL_TRANSACTION_TYPE).includes(
      value as FINANCIAL_TRANSACTION_TYPE,
    )

  const isStatus = (value: ActiveTab): value is FINANCIAL_TRANSACTION_STATUS =>
    Object.values(FINANCIAL_TRANSACTION_STATUS).includes(
      value as FINANCIAL_TRANSACTION_STATUS,
    )

  const { data: dataTransaction, isFetching } = useGetFinance_Transaction_List({
    queryParams: {
      page,
      limit: pageData.pageSize || 20,
      type: isType(activeTab) ? activeTab : undefined,
      status: isStatus(activeTab) ? activeTab : undefined,
      walletId: walletFilter === 'all' ? undefined : walletFilter,
    },
  })

  useEffect(() => {
    if (dataTransaction?.data) {
      setPageData({
        current: dataTransaction.data.meta.page,
        pageSize: dataTransaction.data.meta.limit,
        total: dataTransaction.data.meta.total,
      })
    }
  }, [dataTransaction])
  const transactions = dataTransaction?.data.data || []

  // Options Select
  const walletOptions = useMemo(() => {
    const map = new Map<number, IFinance_Wallet>()
    transactions.forEach((t) => {
      if (t.wallet?.id) map.set(t.wallet.id, t.wallet)
    })
    return Array.from(map.values()).map((w) => ({ value: w.id, label: w.name }))
  }, [transactions])

  const categoryOptions = useMemo(() => {
    const map = new Map<number, IFinance_Category>()
    transactions.forEach((t) => {
      t.financialTransactionItems?.forEach((item) => {
        if (item.category?.id) map.set(item.category.id, item.category)
      })
    })
    return Array.from(map.values()).map((c) => ({ value: c.id, label: c.name }))
  }, [transactions])

  // Count active filter
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (typeFilter !== 'all') count++
    if (walletFilter !== 'all') count++
    if (catFilter !== 'all') count++
    if (statusFilter !== 'all') count++
    return count
  }, [typeFilter, walletFilter, catFilter, statusFilter])

  const handleResetFilter = () => {
    setTypeFilter('all')
    setWalletFilter('all')
    setCatFilter('all')
    setStatusFilter('all')
  }

  const handleViewDetail = (transaction: { id: number }) => {
    setViewTransactionId(transaction.id)
  }

  const handleDeleteTransaction = (transactionId: number) => {
    mTransaction_Delete.mutate(
      { pathParams: { id: transactionId } },
      {
        onSuccess: () => {
          // Refetch the transaction list after deletion
          router.navigate({ to: '/financial/transaction' })
        },
      },
    )
  }

  const navigateToCreate = () => {
    router.navigate({ to: '/financial/transaction/create' })
  }

  return (
    <Space
      direction="vertical"
      size={isMobile ? 'small' : 'middle'}
      style={{
        width: '100%',
        padding: isMobile ? 12 : 24,
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header Section */}
      <TransactionHeader
        isMobile={isMobile}
        filteredCount={transactions.length}
        totalCount={transactions.length}
        selectedCount={selectedKeys.length}
        onDeleteSelected={() => setSelectedKeys([])}
        onOpenAddModal={navigateToCreate}
      />

      {/* 2. Tabs Section */}
      <Tabs
        items={tabsData}
        activeKey={activeTab}
        onChange={(activeKey) => {
          setActiveTab(
            activeKey as
              | 'all'
              | FINANCIAL_TRANSACTION_TYPE
              | FINANCIAL_TRANSACTION_STATUS,
          )
        }}
        tabBarExtraContent={{
          right: (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Tag
                color="red"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                }}
              >
                <ArrowDownOutlined />
                {convertCurrency(dataTransaction?.data.totalExpense || 0)}
              </Tag>

              <Tag
                color="green"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                }}
              >
                <ArrowUpOutlined />
                {convertCurrency(dataTransaction?.data.totalIncome || 0)}
              </Tag>
            </div>
          ),
        }}
      />

      {/* 3. Transactions Table */}
      <TransactionsTable
        isFetching={isFetching}
        dataSource={transactions}
        isMobile={isMobile}
        selectedKeys={selectedKeys}
        onSelectChange={setSelectedKeys}
        onViewDetail={handleViewDetail}
        pagination={pageData}
        onPageChange={(newPage) => setPage(newPage)}
        onDelete={handleDeleteTransaction}
      />

      {/* 4. Search & Active Filters */}
      <TransactionSearch
        isMobile={isMobile}
        search={search}
        onSearchChange={setSearch}
        activeFilterCount={activeFilterCount}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        typeFilter={typeFilter}
        walletFilter={walletFilter}
        catFilter={catFilter}
        statusFilter={statusFilter}
        walletOptions={walletOptions}
        categoryOptions={categoryOptions}
        onClearType={() => setTypeFilter('all')}
        onClearWallet={() => setWalletFilter('all')}
        onClearCat={() => setCatFilter('all')}
        onClearStatus={() => setStatusFilter('all')}
        onResetAll={handleResetFilter}
      />

      {/* 5. Filter Modal */}
      <TransactionFilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilterCount={activeFilterCount}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        walletFilter={walletFilter}
        setWalletFilter={setWalletFilter}
        catFilter={catFilter}
        setCatFilter={setCatFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        walletOptions={walletOptions}
        categoryOptions={categoryOptions}
        onResetFilter={handleResetFilter}
      />

      {/* 6. View Detail Modal */}
      <TransactionDetail
        viewTransaction={viewTransactionId}
        setViewTransaction={setViewTransactionId}
      />

      {/* 7. Add Modal */}
      {showAdd && (
        <TransactionModal open={showAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* 8. Floating Action Button (Mobile) */}
      {isMobile && (
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={navigateToCreate}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </Space>
  )
}
