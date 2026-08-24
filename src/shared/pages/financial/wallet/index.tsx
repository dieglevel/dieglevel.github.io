import { useMemo, useState } from 'react'
import { Empty, Flex } from 'antd'
import { AnimatedGrid } from '../../../components/animated-grid/AnimatedGrid'
import TransferHistory from './_components/TransferHistory'
import { WalletCard } from './_components/WalletCard'
import { WalletModal } from './_components/WalletForm'
import { WalletHeader } from './_components/WalletHeader'
import { WalletSummaryCards } from './_components/WalletSummaryCards'
import { WalletTransferModal } from './_components/WalletTransferModal'
import { useWalletActions } from './_hooks/useWalletActions'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'

export function Wallets() {
  const { data, isFetching } = useGetFinance_Wallet_List({})
  const wallets: Array<IFinance_Wallet> = data?.data || []

  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  // Filter logic for tabs and search
  const filteredWallets = useMemo(() => {
    return wallets.filter((wallet) => {
      // Tab Filter
      if (activeTab === 'LOCKED' && !wallet.isLockedForDailySpending) {
        return false
      }
      if (
        activeTab !== 'ALL' &&
        activeTab !== 'LOCKED' &&
        wallet.type !== activeTab
      ) {
        return false
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = wallet.name?.toLowerCase().includes(q)
        const matchBank = wallet.institutionName?.toLowerCase().includes(q)
        const matchAccount = wallet.accountNumberMasked
          ?.toLowerCase()
          .includes(q)
        return matchName || matchBank || matchAccount
      }

      return true
    })
  }, [wallets, activeTab, searchQuery])

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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleHistory={() => setTransferHistoryOpen(!transferHistoryOpen)}
        onOpenTransfer={() => handleOpenModal('transfer')}
        onOpenAdd={() => handleOpenModal('add')}
      />

      {/* 3. Summary Cards Section */}
      <WalletSummaryCards wallets={wallets} />

      {/* 4. Wallet Cards Grid */}
      <div style={{ width: '100%' }}>
        {filteredWallets.length === 0 && !isFetching ? (
          <Empty
            description="Không tìm thấy ví nào phù hợp với bộ lọc"
            style={{ margin: '40px 0' }}
          />
        ) : (
          <AnimatedGrid
            items={filteredWallets}
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
        )}
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
