import { useMemo } from 'react'
import { Flex } from 'antd'
import SummaryCards from '../_components/SummaryCards'
import { AnimatedGrid } from '../../../components/animated-grid/AnimatedGrid'
import TransferHistory from './_components/TransferHistory'
import { WalletCard } from './_components/WalletCard'
import { WalletModal } from './_components/WalletForm'
import { WalletHeader } from './_components/WalletHeader'
import { WalletTransferModal } from './_components/WalletTransferModal'
import { useWalletActions } from './_hooks/useWalletActions'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'

export function Wallets() {
  const { data, isFetching } = useGetFinance_Wallet_List({})
  const wallets: Array<IFinance_Wallet> = data?.data || []

  const {
    mode,
    setMode,
    editTarget,
    setEditTarget,
    openModal,
    transferHistoryOpen,
    setTransferHistoryOpen,
    handleOpenModal,
    handleCloseModal,
    saveWallet,
    deleteWallet,
    transfer,
  } = useWalletActions()

  const totalBalance = useMemo(
    () => wallets.reduce((s, w) => s + w.balance, 0),
    [wallets],
  )

  return (
    <Flex
      vertical
      gap={24}
      flex={1}
      style={{
        padding: '16px',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Drawer Lịch sử chuyển tiền */}
      <TransferHistory
        open={transferHistoryOpen}
        onClose={() => setTransferHistoryOpen(false)}
      />

      {/* 2. Header Section */}
      <WalletHeader
        onToggleHistory={() => setTransferHistoryOpen(!transferHistoryOpen)}
        onOpenTransfer={() => handleOpenModal('transfer')}
        onOpenAdd={() => handleOpenModal('add')}
      />

      {/* 3. Summary Cards */}
      <SummaryCards totalBudget={totalBalance} totalSpent={0} />

      {/* 4. Wallet Cards Grid */}
      <div style={{ width: '100%' }}>
        <AnimatedGrid
          items={wallets}
          isPending={isFetching}
          getKey={(wallet) => wallet.id}
          renderItem={(w) => (
            <WalletCard
              wallet={w}
              onEdit={() => {
                setEditTarget(w)
                setMode('edit')
              }}
              onDelete={() => deleteWallet(w.id)}
            />
          )}
        />
      </div>

      {/* 5. Modal Thêm / Sửa Wallet */}
      <WalletModal
        open={
          (openModal && mode === 'add') || (mode === 'edit' && !!editTarget)
        }
        wallet={editTarget}
        onCancel={handleCloseModal}
        onSubmit={saveWallet}
      />

      {/* 6. Modal Chuyển tiền */}
      <WalletTransferModal
        open={mode === 'transfer'}
        wallets={wallets}
        onClose={() => setMode(null)}
        onTransfer={transfer}
      />
    </Flex>
  )
}
