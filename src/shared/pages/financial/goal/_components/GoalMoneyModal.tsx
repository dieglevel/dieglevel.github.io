import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { App, Button, Form, Input, InputNumber, Modal, Typography } from 'antd'
import { goalAmounts } from '../goal.utils'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import type { IFinance_GoalHistory } from '@/shared/api/financial/goal/goal-history/goal-history.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { FINANCIAL_GOAL_STATUS } from '@/shared/api/financial/goal/goal.enum'
import { useMutationGoalHistory } from '@/shared/api/financial/goal/goal-history/goal.mutation'
import {
  WalletBalanceSwitch,
  getWalletImpact,
} from '@/shared/components/wallet-balance-switch/WalletBalanceSwitch'
import { InputWithComma } from '@/shared/components/input/utils'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

/** contribute = góp tay · withdraw = rút ra · confirm = xác nhận khoản góp tự động đang chờ */
export type GoalMoneyMode = 'contribute' | 'withdraw' | 'confirm'

interface GoalMoneyModalProps {
  open: boolean
  mode: GoalMoneyMode
  goal: IFinance_Goal
  /** Bắt buộc khi mode = confirm */
  pending?: IFinance_GoalHistory | null
  wallets: Array<IFinance_Wallet>
  isLoadingWallets: boolean
  onClose: () => void
}

interface FormValues {
  amount: number
  note?: string
  updateWallet?: boolean
  walletId?: number
}

export const GoalMoneyModal: React.FC<GoalMoneyModalProps> = ({
  open,
  mode,
  goal,
  pending,
  wallets,
  isLoadingWallets,
  onClose,
}) => {
  const { t } = useTranslation('finance')
  const { message } = App.useApp()
  const [form] = Form.useForm<FormValues>()
  const [submitting, setSubmitting] = useState(false)
  const {
    mGoalHistory_ManualContribution,
    mGoalHistory_Withdraw,
    mGoalHistory_Complete,
  } = useMutationGoalHistory()

  const isWithdraw = mode === 'withdraw'
  const { current, remaining } = goalAmounts(goal)
  // Rút: tối đa số đã tích lũy · Góp/xác nhận: tối đa số còn thiếu
  const max = isWithdraw ? current : remaining

  const amount = Number(Form.useWatch('amount', form) || 0)
  const updateWallet = Form.useWatch('updateWallet', form)
  const walletId = Form.useWatch('walletId', form)
  const { insufficient } = getWalletImpact({
    wallets,
    updateWallet,
    walletId,
    amount,
    isInflow: isWithdraw,
  })

  useEffect(() => {
    if (!open) return
    // Ví gợi ý: ví của khoản chờ → ví trích tự động của mục tiêu
    const defaultWallet = pending?.walletId ?? goal.walletId ?? undefined
    form.resetFields()
    form.setFieldsValue({
      amount:
        mode === 'confirm'
          ? Math.min(Number(pending?.plannedAmount || 0), max)
          : undefined,
      updateWallet: mode === 'withdraw' ? false : !!defaultWallet,
      walletId: defaultWallet,
    })
  }, [open, mode, pending, goal.walletId, max, form])

  const title =
    mode === 'contribute'
      ? t('goal.contributeTitle', { name: goal.name })
      : mode === 'withdraw'
        ? t('goal.withdrawTitle', { name: goal.name })
        : t('goal.confirmTitle', { period: pending?.period ?? '' })

  const handleFinish = async (values: FormValues) => {
    const body = {
      amount: values.amount,
      note: values.note?.trim() || undefined,
      // Tắt công tắc = chỉ ghi sổ → không gửi walletId
      walletId: values.updateWallet ? values.walletId : undefined,
    }
    setSubmitting(true)
    try {
      if (mode === 'contribute') {
        const res = await mGoalHistory_ManualContribution.mutateAsync({
          pathParams: { id: goal.id },
          body,
        })
        message.success(
          res.data.isCompleted
            ? t('goal.goalCompleted')
            : t('goal.contributeSuccess'),
        )
      } else if (mode === 'withdraw') {
        await mGoalHistory_Withdraw.mutateAsync({
          pathParams: { id: goal.id },
          body,
        })
        message.success(t('goal.withdrawSuccess'))
      } else if (pending) {
        const res = await mGoalHistory_Complete.mutateAsync({
          pathParams: { historyId: pending.id },
          body,
        })
        message.success(
          res.data.status === FINANCIAL_GOAL_STATUS.COMPLETED
            ? t('goal.goalCompleted')
            : t('goal.confirmSuccess'),
        )
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      destroyOnHidden
      width={480}
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('common.cancel')}
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={submitting}
          disabled={insufficient}
          onClick={() => form.submit()}
        >
          {mode === 'withdraw' ? t('goal.withdraw') : t('goal.confirm')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        style={{ marginTop: 12 }}
      >
        <Form.Item label={t('goal.amount')} required>
          <div style={{ display: 'flex', gap: 8 }}>
            <Form.Item
              name="amount"
              noStyle
              rules={[
                { required: true, message: t('goal.amountRequired') },
                {
                  type: 'number',
                  min: 0.01,
                  message: t('goal.amountPositive'),
                },
                {
                  type: 'number',
                  max,
                  message: isWithdraw
                    ? t('goal.amountMaxWithdraw', {
                        max: convertCurrency(max),
                      })
                    : t('goal.amountMaxContribute', {
                        max: convertCurrency(max),
                      }),
                },
              ]}
            >
              <InputNumber
                style={{ flex: 1 }}
                aria-label={t('goal.amount')}
                precision={2}
                {...InputWithComma}
              />
            </Form.Item>
            <Button
              onClick={() => {
                form.setFieldsValue({ amount: max })
                form.validateFields(['amount', 'walletId']).catch(() => {})
              }}
            >
              {isWithdraw ? t('goal.withdrawAll') : t('goal.fillRemaining')}
            </Button>
          </div>
          <Text type="secondary">
            {isWithdraw
              ? t('goal.amountMaxWithdraw', { max: convertCurrency(max) })
              : t('goal.amountMaxContribute', { max: convertCurrency(max) })}
          </Text>
        </Form.Item>

        <WalletBalanceSwitch
          wallets={wallets}
          isLoadingWallets={isLoadingWallets}
          amount={amount}
          amountField="amount"
          isInflow={isWithdraw}
          title={isWithdraw ? t('goal.creditWallet') : t('goal.deductWallet')}
          hintOn={isWithdraw ? t('goal.creditHintOn') : t('goal.deductHintOn')}
          hintOff={t('goal.bookOnlyHint')}
        />

        <Form.Item name="note" style={{ marginBottom: 0 }}>
          <Input.TextArea
            rows={2}
            maxLength={500}
            placeholder={t('goal.notePlaceholder')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
