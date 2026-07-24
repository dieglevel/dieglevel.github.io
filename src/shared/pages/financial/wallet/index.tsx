import { useState } from 'react'
import { Button, DatePicker, Flex, Modal, Space, Typography } from 'antd'
import { HistoryOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import SummaryCards from '../_components/SummaryCards'
import { AnimatedGrid } from '../category/_components/animation-card'
import { TransferForm } from './_components/TransferForm'
import { WalletModal } from './_components/WalletForm'
import TransferHistory from './_components/TransferHistory'
import { WalletCard } from './_components/WalletCard'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useGetWallet_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useMutationWallet } from '@/shared/api/financial/wallet/wallet.mutation'

const { Title, Text } = Typography

export function Wallets() {
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs())

  const { data, isFetching } = useGetWallet_Wallet_List({
    queryParams: {
      date: dayjs(selectedMonth).format('YYYY-MM-DD'),
    },
  })
  const wallets: Array<IWallet_Wallet> = data?.data || []
  const [mode, setMode] = useState<'add' | 'edit' | 'transfer' | null>(null)
  const [editTarget, setEditTarget] = useState<IWallet_Wallet | null>(null)
  const [open, setOpen] = useState(false)
  const [transferHistoryOpen, setTransferHistoryOpen] = useState(false)

  const { mWallet_Create, mWallet_Delete, mWallet_Update, mWallet_Transfer } =
    useMutationWallet()

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0)

  const handleOpenModal = (
    modeOpen: 'add' | 'edit' | 'transfer',
    wallet?: IWallet_Wallet,
  ) => {
    setMode(modeOpen)
    setEditTarget(wallet || null)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditTarget(null)
  }

  const save = async (formData: IWallet_Wallet) => {
    if (mode === 'add') {
      await mWallet_Create.mutateAsync(
        { body: formData },
        {
          onSuccess: () => {
            setOpen(false)
          },
        },
      )
    } else if (editTarget) {
      await mWallet_Update.mutateAsync(
        {
          body: {
            ...formData,
          },
          pathParams: {
            id: editTarget.id,
          },
        },
        {
          onSuccess: () => {
            setOpen(false)
            setEditTarget(null)
          },
        },
      )
    }
  }

  async function deleteWallet(id: string) {
    await mWallet_Delete.mutateAsync(
      {
        pathParams: {
          id,
        },
      },
      {
        onSuccess: () => {
          setOpen(false)
          setEditTarget(null)
        },
      },
    )
  }

  async function transfer(
    fromId: number,
    toId: number,
    amount: number,
    transferFee: number,
  ) {
    await mWallet_Transfer.mutateAsync({
      body: {
        fromWalletId: fromId,
        toWalletId: toId,
        amount,
        transferFee,
      },
    })
  }

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
      <TransferHistory
        selectedMonth={selectedMonth}
        open={transferHistoryOpen}
        onClose={() => setTransferHistoryOpen(false)}
      />

      {/* Header */}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Wallets
          </Title>
          <Text type="secondary">Manage your accounts &amp; balances</Text>
        </div>

        <Space
          size={8}
          wrap
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <Button
            icon={<HistoryOutlined />}
            onClick={() => setTransferHistoryOpen(!transferHistoryOpen)}
          >
            Transfer History
          </Button>
          <Button
            icon={<SwapOutlined />}
            onClick={() => handleOpenModal('transfer')}
          >
            Transfer
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal('add')}
          >
            Add Wallet
          </Button>
        </Space>
      </Flex>

      {/* Filter / Controls Bar */}
      <Flex justify="end" align="center" wrap="wrap" gap={12}>
        <DatePicker
          style={{ width: '100%', maxWidth: '200px' }}
          picker="month"
          value={selectedMonth}
          onChange={(date) => {
            setSelectedMonth(date ?? dayjs())
          }}
        />
      </Flex>

      {/* Summary Cards */}
      <SummaryCards totalBudget={totalBalance} totalSpent={0} />

      {/* Wallet Cards Grid */}
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

      {/* Modals */}
      <WalletModal
        open={(open && mode === 'add') || (mode === 'edit' && !!editTarget)}
        wallet={editTarget}
        onCancel={handleCloseModal}
        onSubmit={save}
      />

      <Modal
        title="Transfer Between Wallets"
        open={mode === 'transfer'}
        onCancel={() => setMode(null)}
        footer={null}
        destroyOnClose
      >
        <TransferForm
          wallets={wallets}
          onTransfer={transfer}
          onClose={() => setMode(null)}
        />
      </Modal>
    </Flex>
  )
}
