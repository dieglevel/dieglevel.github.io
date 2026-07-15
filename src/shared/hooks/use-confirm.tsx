import { useRef, useState } from 'react'
import { Modal } from 'antd'
import type { ModalProps } from 'antd'
import type { ReactNode } from 'react'

type ConfirmConfig = {
  title: string
  content: ReactNode
  okText: string
  cancelText: string
  modalProps?: ModalProps
}

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ConfirmConfig>({
    title: 'Xác nhận',
    content: null, // Ở đây có thể là một React Component
    okText: 'Đồng ý',
    cancelText: 'Hủy',
  })

  // Dùng ref để lưu trữ hàm resolve của Promise giữa các lần render
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = (options: Partial<ConfirmConfig> = {}) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setConfig((prev) => ({ ...prev, ...options }))
      setIsOpen(true)
    })
  }

  const handleOk = () => {
    setIsOpen(false)
    resolveRef.current?.(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    resolveRef.current?.(false)
  }

  // Component Modal này sẽ được đặt vào JSX của bạn
  const ConfirmModal = () => (
    <Modal
      open={isOpen}
      title={config.title}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={config.okText}
      cancelText={config.cancelText}
      {...config.modalProps}
    >
      {config.content}
    </Modal>
  )

  return { confirm, ConfirmModal }
}

export default useConfirm
