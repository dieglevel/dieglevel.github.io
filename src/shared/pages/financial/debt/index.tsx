import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { App } from 'antd'

import {
  DEBT_UI_CLASS,
  DebtThemeProvider,
} from './_components/DebtThemeProvider'
import { DebtHeader } from './_components/DebtHeader'
import { DebtSummaryCards } from './_components/DebtSummaryCards'
import { DebtList } from './_components/DebtList'
import { DebtCreateModal } from './_components/DebtCreateModal'
import { DebtPaymentModal } from './_components/DebtPaymentModal'
import { DebtAdjustModal } from './_components/DebtAdjustModal'
import { DebtHistoryModal } from './_components/DebtHistoryModal'
import { DebtCorrectModal } from './_components/DebtCorrectModal'
import { summarizeDebts } from './debt.utils'
import type { DebtPaymentSubmit } from './_components/DebtPaymentModal'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import { useMutationFinanceDebt } from '@/shared/api/financial/debt/debt.mutation'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useGetFinance_Debt_List } from '@/shared/api/financial/debt/useGetFinance_Debt_List'

type ModalKind = 'payment' | 'adjust' | 'correct' | 'history'

export const DebtManagementPage: React.FC = () => {
  const { t } = useTranslation('finance')
  const { message } = App.useApp()

  // Queries & Mutations
  const { data: debtListResponse, isLoading } = useGetFinance_Debt_List()
  const { data: walletListResponse, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})

  const wallets = walletListResponse?.data || []
  const debts = useMemo(() => debtListResponse?.data || [], [debtListResponse])
  const summary = useMemo(() => summarizeDebts(debts), [debts])

  const {
    mDebt_Create,
    mDebt_Delete,
    mDebt_Payment,
    mDebt_Adjust,
    mDebt_Settle,
    mDebt_Cancel,
    mDebt_Correct,
  } = useMutationFinanceDebt()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<IFinance_Debt | null>(null)
  const [openModal, setOpenModal] = useState<ModalKind | null>(null)

  const open = (kind: ModalKind) => (debt: IFinance_Debt) => {
    setSelectedDebt(debt)
    setOpenModal(kind)
  }
  const close = () => setOpenModal(null)
  const selectedId = () => ({ id: String(selectedDebt?.id) })

  // Handlers
  const handleCreate = async (values: any) => {
    await mDebt_Create.mutateAsync({ body: values })
    setIsCreateOpen(false)
  }

  const handlePayment = async (values: DebtPaymentSubmit) => {
    if (!selectedDebt) return
    await mDebt_Payment.mutateAsync({
      pathParams: selectedId(),
      body: values,
    })
    close()
    // Về 0 → BE tự chuyển sang PAID_OFF
    if (values.amount >= Number(selectedDebt.outstandingAmount)) {
      message.success(t('debt.paidOffToast', { name: selectedDebt.name }))
    }
  }

  const handleAdjust = async (values: any) => {
    if (!selectedDebt) return
    await mDebt_Adjust.mutateAsync({ pathParams: selectedId(), body: values })
    close()
  }

  const handleCorrect = async (values: any) => {
    if (!selectedDebt) return
    await mDebt_Correct.mutateAsync({ pathParams: selectedId(), body: values })
    close()
  }

  const handleSettle = async (id: number) => {
    await mDebt_Settle.mutateAsync({
      pathParams: { id: String(id) },
      body: { note: t('debt.settleNote') },
    })
  }

  const handleCancel = async (id: number) => {
    await mDebt_Cancel.mutateAsync({
      pathParams: { id: String(id) },
      body: { note: t('debt.cancelNote') },
    })
  }

  const handleDelete = async (id: number) => {
    await mDebt_Delete.mutateAsync({ pathParams: { id: String(id) } })
  }

  return (
    <DebtThemeProvider>
      <div className={`${DEBT_UI_CLASS} debt-page`}>
        <div className="dp-wrap">
          {/* 1. Header */}
          <DebtHeader
            totalCount={summary.total}
            activeCount={summary.activeCount}
            overdueCount={summary.overdueCount}
            onOpenCreate={() => setIsCreateOpen(true)}
          />

          {/* 2. Tổng quan */}
          <DebtSummaryCards summary={summary} />

          {/* 3–5. Tab trạng thái, tìm kiếm, danh sách */}
          <DebtList
            debts={debts}
            isLoading={isLoading}
            onOpenHistory={open('history')}
            onOpenPayment={open('payment')}
            onOpenAdjust={open('adjust')}
            onOpenCorrect={open('correct')}
            onSettle={handleSettle}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        </div>

        <DebtCreateModal
          open={isCreateOpen}
          isLoadingWallets={isLoadingWallets}
          wallets={wallets}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />

        <DebtPaymentModal
          open={openModal === 'payment'}
          debt={selectedDebt}
          wallets={wallets}
          isLoadingWallets={isLoadingWallets}
          onClose={close}
          onSubmit={handlePayment}
        />

        <DebtAdjustModal
          open={openModal === 'adjust'}
          debt={selectedDebt}
          onClose={close}
          onSubmit={handleAdjust}
        />

        <DebtCorrectModal
          open={openModal === 'correct'}
          debt={selectedDebt}
          onClose={close}
          onSubmit={handleCorrect}
        />

        {selectedDebt && (
          <DebtHistoryModal
            debtId={selectedDebt.id}
            debtName={selectedDebt.name}
            open={openModal === 'history'}
            onClose={close}
          />
        )}
      </div>
    </DebtThemeProvider>
  )
}
