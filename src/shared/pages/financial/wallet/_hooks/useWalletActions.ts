import { useState } from 'react'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useMutationWallet } from '@/shared/api/financial/wallet/wallet.mutation'

export function useWalletActions() {
  const [mode, setMode] = useState<'add' | 'edit' | 'transfer' | null>(null)
  const [editTarget, setEditTarget] = useState<IFinance_Wallet | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [transferHistoryOpen, setTransferHistoryOpen] = useState(false)

  const { mWallet_Create, mWallet_Delete, mWallet_Update, mWallet_Transfer } =
    useMutationWallet()

  const handleOpenModal = (
    modeOpen: 'add' | 'edit' | 'transfer',
    wallet?: IFinance_Wallet,
  ) => {
    setMode(modeOpen)
    setEditTarget(wallet || null)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditTarget(null)
  }

  const saveWallet = async (formData: Partial<IFinance_Wallet>) => {
    if (mode === 'add') {
      await mWallet_Create.mutateAsync(
        { body: formData },
        {
          onSuccess: () => {
            setOpenModal(false)
          },
        },
      )
    } else if (editTarget) {
      await mWallet_Update.mutateAsync(
        {
          body: { ...formData },
          pathParams: { id: editTarget.id },
        },
        {
          onSuccess: () => {
            setOpenModal(false)
            setEditTarget(null)
          },
        },
      )
    }
  }

  const deleteWallet = async (id: number) => {
    await mWallet_Delete.mutateAsync(
      { pathParams: { id } },
      {
        onSuccess: () => {
          setOpenModal(false)
          setEditTarget(null)
        },
      },
    )
  }

  const transfer = async (
    fromId: number,
    toId: number,
    amount: number,
    transferFee: number,
  ) => {
    await mWallet_Transfer.mutateAsync({
      body: {
        fromWalletId: fromId,
        toWalletId: toId,
        amount,
        transferFee,
      },
    })
  }

  return {
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
  }
}
