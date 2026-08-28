import React, { useMemo, useState } from 'react'
import { Grid, Space } from 'antd'

import { DebtHeader } from './_components/DebtHeader'
import { DebtSummaryCards } from './_components/DebtSummaryCards'
import { DebtTable } from './_components/DebtTable'
import { DebtCreateModal } from './_components/DebtCreateModal'
import { DebtPaymentModal } from './_components/DebtPaymentModal'
import { DebtAdjustModal } from './_components/DebtAdjustModal'
import { DebtHistoryModal } from './_components/DebtHistoryModal'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_STATUS_ENUM,
} from '@/shared/api/financial/debt/debt.enum'
import { useMutationFinanceDebt } from '@/shared/api/financial/debt/useMutationDebt'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useGetFinance_Debt_List } from '@/shared/api/financial/debt/useGetDebtList'

const { useBreakpoint } = Grid

export const DebtManagementPage: React.FC = () => {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  // Queries & Mutations
  const { data: debtListResponse, isLoading } = useGetFinance_Debt_List()
  const { data: walletListResponse, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})

  const wallets = walletListResponse?.data || []
  const debts = debtListResponse?.data || []

  const {
    mDebt_Create,
    mDebt_Delete,
    mDebt_Payment,
    mDebt_Adjust,
    mDebt_Settle,
    mDebt_Cancel,
  } = useMutationFinanceDebt()

  // Local States
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [selectedDebt, setSelectedDebt] = useState<IFinance_Debt | null>(null)

  // Modals visibility
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Handlers
  const handleCreate = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate
        ? values.startDate.toISOString()
        : new Date().toISOString(),
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      status: FINANCIAL_DEBT_STATUS_ENUM.ACTIVE,
    }
    await mDebt_Create.mutateAsync({ body: payload })
    setIsCreateOpen(false)
  }

  const handlePayment = async (values: any) => {
    if (!selectedDebt) return
    await mDebt_Payment.mutateAsync({
      pathParams: { id: String(selectedDebt.id) },
      body: values,
    })
    setIsPaymentOpen(false)
  }

  const handleAdjust = async (values: any) => {
    if (!selectedDebt) return
    await mDebt_Adjust.mutateAsync({
      pathParams: { id: String(selectedDebt.id) },
      body: values,
    })
    setIsAdjustOpen(false)
  }

  const handleSettle = async (id: number) => {
    await mDebt_Settle.mutateAsync({
      pathParams: { id: String(id) },
      body: { note: 'Tất toán khoản nợ' },
    })
  }

  const handleCancel = async (id: number) => {
    await mDebt_Cancel.mutateAsync({
      pathParams: { id: String(id) },
      body: { note: 'Hủy khoản nợ' },
    })
  }

  const handleDelete = async (id: number) => {
    await mDebt_Delete.mutateAsync({
      pathParams: { id: String(id) },
    })
  }

  // Filtered debts by active tab
  const filteredDebts = useMemo(() => {
    return debts.filter((item) => {
      if (activeTab === 'ALL') return true
      if (
        activeTab === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING ||
        activeTab === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING
      ) {
        return item.direction === activeTab
      }
      return item.status === activeTab
    })
  }, [debts, activeTab])

  const activeCount = debts.filter(
    (d) => d.status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE,
  ).length

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        width: '100%',
        padding: isMobile ? 12 : 24,
        boxSizing: 'border-box',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      {/* 1. Header Component */}
      <DebtHeader
        isMobile={isMobile}
        totalCount={debts.length}
        activeCount={activeCount}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* 2. Summary Statistics Cards */}
      <DebtSummaryCards debts={debts} />

      {/* 3. Main Debt Table with Filtering Tabs */}
      <DebtTable
        debts={filteredDebts}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPayment={(debt) => {
          setSelectedDebt(debt)
          setIsPaymentOpen(true)
        }}
        onOpenAdjust={(debt) => {
          setSelectedDebt(debt)
          setIsAdjustOpen(true)
        }}
        onOpenHistory={(debt) => {
          setSelectedDebt(debt)
          setIsHistoryOpen(true)
        }}
        onSettle={handleSettle}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      {/* 4. Modal: Tạo mới khoản nợ */}
      <DebtCreateModal
        open={isCreateOpen}
        isLoadingWallets={isLoadingWallets}
        wallets={wallets}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* 5. Modal: Thanh toán / Thu hồi nợ */}
      {selectedDebt && (
        <DebtPaymentModal
          open={isPaymentOpen}
          debt={selectedDebt}
          wallets={wallets}
          isLoadingWallets={isLoadingWallets}
          onClose={() => setIsPaymentOpen(false)}
          onSubmit={handlePayment}
        />
      )}

      {/* 6. Modal: Điều chỉnh dư nợ */}
      <DebtAdjustModal
        open={isAdjustOpen}
        debt={selectedDebt}
        onClose={() => setIsAdjustOpen(false)}
        onSubmit={handleAdjust}
      />

      {/* 7. Modal: Lịch sử biến động nợ */}
      {selectedDebt && (
        <DebtHistoryModal
          debtId={selectedDebt.id}
          debtName={selectedDebt.name}
          open={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </Space>
  )
}
