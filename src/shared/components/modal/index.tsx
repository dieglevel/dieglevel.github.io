import { Button, Flex, Modal } from 'antd'
import { background } from '@/shared/common/design-token'

interface BaseModalProps {
  open: boolean
  onClose?: () => void
  onOk?: () => void
  title?: React.ReactNode
  children?: React.ReactNode
  showButtonOk?: boolean
  showButtonCancel?: boolean
  width?: number | string
}

export default function BaseModal({
  open,
  onClose,
  onOk,
  title,
  children,
  showButtonOk = true,
  showButtonCancel = true,
  width = 900,
}: BaseModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onOk}
      title={title}
      width={width}
      footer={
        <Flex gap={8} justify="center">
          {showButtonCancel && (
            <Button
              style={{
                minWidth: 70,
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          {showButtonOk && (
            <Button
              type="primary"
              style={{
                minWidth: 70,
              }}
              onClick={onOk}
            >
              OK
            </Button>
          )}
        </Flex>
      }
      rootStyle={{
        padding: 0,
      }}
      styles={{
        container: {
          padding: 0,
        },
        header: {
          margin: 0,
          padding: '16px 24px',
          background: background.spotlight,
        },
        body: {
          padding: '16px 24px',
        },
        footer: {
          margin: 0,
          padding: '16px 24px',
        },
      }}
    >
      {children}
    </Modal>
  )
}
