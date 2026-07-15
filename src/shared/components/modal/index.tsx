import { Button, Flex, Modal } from 'antd'
import { background } from '@/shared/common/design-token'

interface BaseModalProps {
  open: boolean
  onClose?: () => void
  onOk?: () => void
  title?: React.ReactNode
  children?: React.ReactNode
}

export default function BaseModal({
  open,
  onClose,
  onOk,
  title,
  children,
}: BaseModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onOk}
      title={title}
      footer={
        <Flex gap={8} justify="center">
          <Button
            style={{
              minWidth: 70,
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              minWidth: 70,
            }}
            type="primary"
          >
            Accept
          </Button>
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
