import React from 'react'
import { Modal } from 'antd'
import { TransferForm } from './TransferForm'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'

interface WalletTransferModalProps {
  open: boolean
  wallets: Array<IFinance_Wallet>
  onClose: () => void
  onTransfer: (
    fromId: number,
    toId: number,
    amount: number,
    transferFee: number,
  ) => Promise<void>
}

export const WalletTransferModal: React.FC<WalletTransferModalProps> = ({
  open,
  wallets,
  onClose,
  onTransfer,
}) => {
  return (
    <Modal
      title="Transfer Between Wallets"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <TransferForm
        wallets={wallets}
        onTransfer={onTransfer}
        onClose={onClose}
      />
    </Modal>
  )
}
