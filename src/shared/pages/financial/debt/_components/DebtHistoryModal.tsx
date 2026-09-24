import React from 'react'
import { Modal } from 'antd'
import { DebtHistoryTable } from './DebtHistoryTable'

interface Props {
  debtId: number
  debtName?: string
  open: boolean
  onClose: () => void
}

export const DebtHistoryModal: React.FC<Props> = ({
  debtId,
  debtName,
  open,
  onClose,
}) => (
  <Modal
    title={`Lịch sử biến động: ${debtName || `#${debtId}`}`}
    open={open}
    onCancel={onClose}
    footer={null}
    width={820}
    centered
  >
    {open && <DebtHistoryTable debtId={debtId} />}
  </Modal>
)
