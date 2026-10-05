import React from 'react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('finance')

  return (
    <Modal
      title={t('wallet.transfer')}
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
