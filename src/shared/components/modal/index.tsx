import { Button, Flex, Modal } from 'antd'
import type { ModalProps } from 'antd'
import { background, border } from '@/shared/common/design-token'

interface BaseModalProps extends ModalProps {
  open: boolean
  onClose?: () => void
  onCancel?: () => void
  onOk?: () => void
  title?: React.ReactNode
  children?: React.ReactNode
  showButtonOk?: boolean
  showButtonCancel?: boolean
  width?: number | string
  style?: React.CSSProperties
}

export default function BaseModal({
  open,
  onClose,
  onCancel,
  onOk,
  title,
  children,
  showButtonOk = true,
  showButtonCancel = true,
  width = 900,
  style,
}: BaseModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel || onClose}
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
              onClick={onClose || onCancel}
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
          maxHeight: 'calc(100vh - 300px)',
          overflowY: 'auto',
        },
        footer: {
          borderTop: `1px solid ${border.base}`,
          margin: 0,
          padding: '16px 24px',
        },
      }}
      style={style}
    >
      {children}
    </Modal>
  )
}
