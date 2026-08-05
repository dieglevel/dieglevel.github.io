import React, { useMemo, useState } from 'react'
import { FloatButton, Grid, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { TransactionModal } from './_components/TransactionModal'
import { TransactionsSummary } from './_components/TransactionsSummary'
import { TransactionDetail } from './_components/TransactionDetail'
import { TransactionsTable } from './_components/TransactionsTable'
import { TransactionHeader } from './_components/TransactionHeader'
import { TransactionSearch } from './_components/TransactionSearch'
import { TransactionFilterModal } from './_components/TransactionFilterModal'

import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import type { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'
import { useGetWallet_Transaction_Date } from '@/shared/api/financial/transaction/useGetFinance_Transaction_Date'

const { useBreakpoint } = Grid

export function Transactions() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { data: dataTransaction } = useGetWallet_Transaction_Date({})
  const transactions = dataTransaction?.data || []

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
  const [viewTransaction, setViewTransaction] =
    useState<IFinance_Transaction | null>(null)

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
      t.financialAdvanceTransactions?.forEach((adv) => {
        if (adv.category?.id) map.set(adv.category.id, adv.category)
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

  // Filter Logic
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (
        search &&
        ![t.description, t.amount.toString()]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false
      }
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (walletFilter !== 'all' && t.wallet?.id !== walletFilter) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false

      if (catFilter !== 'all') {
        const hasCategory = t.financialAdvanceTransactions?.some(
          (adv) => adv.categoryId === catFilter,
        )
        if (!hasCategory) return false
      }
      return true
    })
  }, [transactions, search, typeFilter, walletFilter, catFilter, statusFilter])

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
        filteredCount={filtered.length}
        totalCount={transactions.length}
        selectedCount={selectedKeys.length}
        onDeleteSelected={() => setSelectedKeys([])}
        onOpenAddModal={() => setShowAdd(true)}
      />

      {/* 2. Summary Chart */}
      <TransactionsSummary transactions={transactions} />

      {/* 3. Search & Active Filters */}
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

      {/* 4. Table */}
      <TransactionsTable
        dataSource={filtered}
        isMobile={isMobile}
        selectedKeys={selectedKeys}
        onSelectChange={setSelectedKeys}
        onViewDetail={setViewTransaction}
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
        viewTransaction={viewTransaction}
        setViewTransaction={() => setViewTransaction(null)}
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
          onClick={() => setShowAdd(true)}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </Space>
  )
}
