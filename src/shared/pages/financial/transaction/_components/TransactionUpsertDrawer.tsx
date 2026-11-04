import React from 'react'
import { Drawer, Grid } from 'antd'
import { TransactionUpsertPage } from './TransactionUpsertPage'

const { useBreakpoint } = Grid

export type TransactionUpsertTarget =
  | { mode: 'create' }
  | { mode: 'update'; transactionId: number }

interface TransactionUpsertDrawerProps {
  target: TransactionUpsertTarget | null
  onClose: () => void
}

/** Form tạo / sửa giao dịch mở dạng drawer bên phải thay vì chuyển trang. */
export const TransactionUpsertDrawer: React.FC<
  TransactionUpsertDrawerProps
> = ({ target, onClose }) => {
  const screens = useBreakpoint()

  return (
    <Drawer
      open={!!target}
      onClose={onClose}
      placement="right"
      size={screens.md ? 720 : '100%'}
      closable={false}
      destroyOnHidden
    >
      {target && (
        // key để form, dữ liệu chi tiết và idempotency key được tạo lại mỗi lần mở
        <TransactionUpsertPage
          key={target.mode === 'update' ? target.transactionId : 'create'}
          mode={target.mode}
          transactionId={
            target.mode === 'update' ? target.transactionId : undefined
          }
          inDrawer
          onClose={onClose}
        />
      )}
    </Drawer>
  )
}
