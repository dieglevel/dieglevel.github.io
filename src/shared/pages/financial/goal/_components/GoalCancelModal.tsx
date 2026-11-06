import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, App, Button, Form, Modal, Typography } from 'antd'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'
import { WalletBalanceSwitch } from '@/shared/components/wallet-balance-switch/WalletBalanceSwitch'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Paragraph } = Typography

interface GoalCancelModalProps {
  open: boolean
  goal: IFinance_Goal
  wallets: Array<IFinance_Wallet>
  isLoadingWallets: boolean
  onClose: () => void
}

/**
 * Hủy mục tiêu, tùy chọn hoàn toàn bộ số đã tích lũy vào ví.
 * Mục tiêu đang khóa rút tiền thì không cho hoàn (BE cũng chặn).
 */
export const GoalCancelModal: React.FC<GoalCancelModalProps> = ({
  open,
  goal,
  wallets,
  isLoadingWallets,
  onClose,
}) => {
  const { t } = useTranslation('finance')
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const { mGoal_Cancel } = useMutationGoal()

  const saved = Number(goal.currentAmount || 0)
  const canRefund = saved > 0 && !goal.isLocked

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        updateWallet: canRefund && !!goal.walletId,
        walletId: goal.walletId ?? undefined,
        refundAmount: saved,
      })
    }
  }, [open, canRefund, goal.walletId, saved, form])

  const handleFinish = async (values: {
    updateWallet?: boolean
    walletId?: number
  }) => {
    setSubmitting(true)
    try {
      await mGoal_Cancel.mutateAsync({
        pathParams: { id: goal.id },
        body: {
          refundWalletId:
            canRefund && values.updateWallet ? values.walletId : undefined,
        },
      })
      message.success(t('goal.cancelSuccess'))
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      title={t('goal.cancelTitle', { name: goal.name })}
      onCancel={onClose}
      destroyOnHidden
      width={480}
      centered
      footer={[
        <Button key="back" onClick={onClose}>
          {t('common.cancel')}
        </Button>,
        <Button
          key="ok"
          danger
          type="primary"
          loading={submitting}
          onClick={() => form.submit()}
        >
          {t('goal.cancelGoal')}
        </Button>,
      ]}
    >
      <Paragraph type="secondary">{t('goal.cancelDesc')}</Paragraph>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Field ẩn để WalletBalanceSwitch đọc số tiền hoàn */}
        <Form.Item name="refundAmount" hidden>
          <input />
        </Form.Item>

        {saved > 0 &&
          (goal.isLocked ? (
            <Alert type="warning" showIcon message={t('goal.refundLocked')} />
          ) : (
            <WalletBalanceSwitch
              wallets={wallets}
              isLoadingWallets={isLoadingWallets}
              amount={saved}
              amountField="refundAmount"
              isInflow
              title={t('goal.refund', { amount: convertCurrency(saved) })}
              hintOn={t('goal.refundHintOn')}
              hintOff={t('goal.refundHintOff')}
            />
          ))}
      </Form>
    </Modal>
  )
}
