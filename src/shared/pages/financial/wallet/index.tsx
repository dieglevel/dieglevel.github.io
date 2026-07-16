import { useState } from 'react'
import { Button, Col, Flex, Modal, Row, Space, Typography } from 'antd'
import { HistoryOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons'
import SummaryCards from '../_components/SummaryCards'
import { WalletCard } from './_components/WalletCard'
import { TransferForm } from './_components/TransferForm'
import { WalletModal } from './_components/WalletForm'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useGetWallet_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useMutationWallet } from '@/shared/api/financial/wallet/wallet.mutation'

const { Title, Text } = Typography

export function Wallets() {
  const { data } = useGetWallet_Wallet_List({})
  const wallets: Array<IWallet_Wallet> = data?.data || []
  const [mode, setMode] = useState<'add' | 'edit' | 'transfer' | null>(null)
  const [editTarget, setEditTarget] = useState<IWallet_Wallet | null>(null)
  const [open, setOpen] = useState(false)

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
    <Flex vertical gap={24} flex={1} style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Wallets
          </Title>
          <Text type="secondary">Manage your accounts &amp; balances</Text>
        </div>
        <Space size={8}>
          <Button icon={<HistoryOutlined />}>Transfer History</Button>
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
      </div>

      <SummaryCards totalBudget={totalBalance} totalSpent={0} />

      {/* Wallet Cards Grid */}
      <Row gutter={[16, 16]}>
        {wallets.map((w) => (
          <Col xs={24} md={12} xl={8} key={w.id}>
            <WalletCard
              wallet={w}
              onEdit={() => {
                setEditTarget(w)
                setMode('edit')
              }}
              onDelete={() => deleteWallet(w.id)}
            />
          </Col>
        ))}
      </Row>

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
