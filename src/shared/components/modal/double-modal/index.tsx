import { Modal } from 'antd'
import './index.css'

export interface DoubleCardModalProps {
  open: boolean
  onClose: () => void
  main: React.ReactNode
  side: React.ReactNode
  width?: number
}

export function DoubleCardModal({
  open,
  onClose,
  main,
  side,
  width = 900,
}: DoubleCardModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={width}
      className="dc-modal"
      destroyOnHidden
    >
      <div className="dc-body">
        <section className="dc-card dc-card--main">{main}</section>
        <aside className="dc-card dc-card--side">{side}</aside>
      </div>
    </Modal>
  )
}
