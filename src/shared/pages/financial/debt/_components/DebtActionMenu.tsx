import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dropdown, Typography } from 'antd'
import {
  CheckCircle2,
  Eraser,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Receipt,
  Trash2,
  XCircle,
} from 'lucide-react'
import { isActiveDebt, isReceivable } from '../debt.utils'
import { DEBT_UI_CLASS } from './DebtThemeProvider'
import type { MenuProps } from 'antd'
import type { HookAPI } from 'antd/es/modal/useModal'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import { FINANCIAL_DEBT_STATUS_ENUM } from '@/shared/api/financial/debt/debt.enum'

export interface DebtActionHandlers {
  onOpenPayment: (debt: IFinance_Debt) => void
  onOpenAdjust: (debt: IFinance_Debt) => void
  onOpenCorrect: (debt: IFinance_Debt) => void
  onOpenIncrease: (debt: IFinance_Debt) => void
  onSettle: (id: number) => Promise<void>
  onCancel: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

interface DebtActionMenuProps extends DebtActionHandlers {
  debt: IFinance_Debt
  /** Từ Modal.useModal() để hộp xác nhận nhận theme của module */
  modal: HookAPI
}

const { Text } = Typography

const Item: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <span className="dm-item">
    <span>{title}</span>
    <Text type="secondary">{desc}</Text>
  </span>
)

/**
 * Menu "⋯": mỗi thao tác có dòng phụ nêu rõ tác động lên ví.
 * Các thao tác thay đổi số tiền chỉ áp dụng cho khoản đang nợ (BE cũng chặn).
 */
export const DebtActionMenu: React.FC<DebtActionMenuProps> = ({
  debt,
  modal,
  onOpenPayment,
  onOpenAdjust,
  onOpenCorrect,
  onOpenIncrease,
  onSettle,
  onCancel,
  onDelete,
}) => {
  const { t } = useTranslation('finance')
  const active = isActiveDebt(debt)
  const receivable = isReceivable(debt)
  // BE: không hủy được khoản đã trả xong hoặc đã hủy
  const canCancel =
    debt.status !== FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF &&
    debt.status !== FINANCIAL_DEBT_STATUS_ENUM.CANCELLED &&
    debt.status !== FINANCIAL_DEBT_STATUS_ENUM.MERGED

  const confirm = (
    title: string,
    content: string,
    okText: string,
    onOk: () => Promise<void>,
    danger: boolean,
  ) =>
    modal.confirm({
      title,
      content,
      okText,
      cancelText: t('debt.back'),
      okButtonProps: { danger },
      rootClassName: DEBT_UI_CLASS,
      onOk,
    })

  const items: MenuProps['items'] = []

  // Vay / cho vay thêm: khoản đang nợ hoặc đã trả xong (BE mở lại khoản)
  const canIncrease =
    active || debt.status === FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF
  const increaseItem = {
    key: 'increase',
    icon: <PlusCircle size={16} />,
    label: (
      <Item
        title={
          receivable ? t('debt.menuIncreaseLend') : t('debt.menuIncreaseBorrow')
        }
        desc={t('debt.menuIncreaseDesc')}
      />
    ),
    onClick: () => onOpenIncrease(debt),
  }

  if (active) {
    items.push(
      {
        key: 'pay',
        icon: <Receipt size={16} />,
        label: (
          <Item
            title={receivable ? t('debt.collect') : t('debt.pay')}
            desc={receivable ? t('debt.menuPayIn') : t('debt.menuPayOut')}
          />
        ),
        onClick: () => onOpenPayment(debt),
      },
      increaseItem,
      {
        key: 'adjust',
        icon: <Pencil size={16} />,
        label: (
          <Item title={t('debt.menuAdjust')} desc={t('debt.menuAdjustDesc')} />
        ),
        onClick: () => onOpenAdjust(debt),
      },
      {
        key: 'correct',
        icon: <Eraser size={16} />,
        label: (
          <Item
            title={t('debt.menuCorrect')}
            desc={t('debt.menuCorrectDesc')}
          />
        ),
        onClick: () => onOpenCorrect(debt),
      },
      {
        key: 'settle',
        icon: <CheckCircle2 size={16} />,
        label: (
          <Item title={t('debt.menuSettle')} desc={t('debt.menuSettleDesc')} />
        ),
        onClick: () =>
          confirm(
            t('debt.settleConfirm'),
            t('debt.settleDesc'),
            t('debt.menuSettle'),
            () => onSettle(debt.id),
            false,
          ),
      },
      { type: 'divider' },
    )
  }

  if (canIncrease && !active) {
    items.push(increaseItem, { type: 'divider' })
  }

  if (canCancel) {
    items.push({
      key: 'cancel',
      danger: true,
      icon: <XCircle size={16} />,
      label: (
        <Item title={t('debt.menuCancel')} desc={t('debt.menuCancelDesc')} />
      ),
      onClick: () =>
        confirm(
          t('debt.cancelConfirm'),
          t('debt.cancelDesc'),
          t('debt.menuCancel'),
          () => onCancel(debt.id),
          true,
        ),
    })
  }

  items.push({
    key: 'delete',
    danger: true,
    icon: <Trash2 size={16} />,
    label: (
      <Item title={t('debt.menuDelete')} desc={t('debt.menuDeleteDesc')} />
    ),
    onClick: () =>
      confirm(
        t('debt.deleteConfirm'),
        t('debt.deleteDesc'),
        t('debt.menuDelete'),
        () => onDelete(debt.id),
        true,
      ),
  })

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      rootClassName={DEBT_UI_CLASS}
      menu={{ items }}
    >
      <Button
        className="dp-icon-btn"
        aria-label={t('debt.moreActionsFor', { name: debt.name })}
        icon={<MoreHorizontal size={18} />}
      />
    </Dropdown>
  )
}
