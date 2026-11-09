import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { isReceivable } from '../debt.utils'
import { DEBT_UI_CLASS } from './DebtThemeProvider'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  WalletBalanceSwitch,
  getWalletImpact,
} from '@/shared/components/wallet-balance-switch/WalletBalanceSwitch'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { InputWithComma } from '@/shared/components/input/utils'

const { Title, Text } = Typography

const round2 = (n: number) => Math.round(n * 100) / 100

export interface DebtPaymentSubmit {
  amount: number
  occurredAt: string
  walletId?: number
  note?: string
}

/**
 * - payment: thu / trả nợ (mặc định)
 * - increase: vay / cho vay thêm vào khoản (cộng dư nợ, chiều ví ngược lại)
 */
export type DebtPaymentMode = 'payment' | 'increase'

interface DebtPaymentModalProps {
  open: boolean
  debt: IFinance_Debt | null
  mode?: DebtPaymentMode
  /** Thu / trả theo người: hiện gợi ý phân bổ khoản cũ trước */
  fifoHint?: boolean
  wallets: Array<IFinance_Wallet>
  isLoadingWallets: boolean
  onClose: () => void
  onSubmit: (values: DebtPaymentSubmit) => Promise<void>
}

/**
 * Thu nợ (khoản cho vay) / Trả nợ (khoản đi vay) — POST /:id/payment.
 * Về 0 thì BE tự chuyển khoản nợ sang PAID_OFF.
 * mode = 'increase': vay / cho vay thêm — POST /:id/increase.
 */
export const DebtPaymentModal: React.FC<DebtPaymentModalProps> = ({
  open,
  debt,
  mode = 'payment',
  fifoHint = false,
  wallets,
  isLoadingWallets,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('finance')
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const amount = Number(Form.useWatch('amount', form) || 0)
  const updateWallet: boolean | undefined = Form.useWatch('updateWallet', form)
  const walletId: number | undefined = Form.useWatch('walletId', form)

  useEffect(() => {
    if (open && debt) {
      form.resetFields()
      form.setFieldsValue({
        amount:
          mode === 'increase' ? undefined : Number(debt.outstandingAmount),
        occurredAt: dayjs(),
        updateWallet: true,
      })
    }
  }, [open, debt, form, mode])

  if (!debt) return null

  const increasing = mode === 'increase'
  const collecting = isReceivable(debt)
  // Thu nợ / mình vay thêm → tiền vào ví; trả nợ / cho vay thêm → tiền ra ví
  const isInflow = increasing ? !collecting : collecting
  const outstanding = Number(debt.outstandingAmount || 0)
  const remaining = increasing
    ? round2(outstanding + amount)
    : Math.max(0, round2(outstanding - amount))
  // Thu / trả vượt dư nợ: BE ghi phần dư là tiền lãi (INTEREST)
  const excess = increasing ? 0 : Math.max(0, round2(amount - outstanding))
  const validAmount = amount > 0
  const { insufficient } = getWalletImpact({
    wallets,
    updateWallet,
    walletId,
    amount,
    isInflow,
  })

  const title = increasing
    ? collecting
      ? t('debtForms.increaseLendTitle')
      : t('debtForms.increaseBorrowTitle')
    : collecting
      ? t('debtForms.paymentCollect')
      : t('debtForms.paymentPay')
  const okText = increasing
    ? t('debtForms.confirm')
    : collecting
      ? t('debtForms.confirmCollect')
      : t('debtForms.confirmPay')
  const previewLabel = increasing
    ? t('debtForms.outstandingAfterIncrease')
    : collecting
      ? t('debtForms.remainingAfterCollect')
      : t('debtForms.remainingAfterPay')

  const handleFinish = async (values: any) => {
    setSubmitting(true)
    try {
      await onSubmit({
        amount: values.amount,
        occurredAt: values.occurredAt.format('YYYY-MM-DD'),
        // Tắt công tắc = chỉ ghi sổ → không gửi walletId
        walletId: values.updateWallet ? values.walletId : undefined,
        note: values.note?.trim() || undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      rootClassName={DEBT_UI_CLASS}
      open={open}
      onCancel={onClose}
      destroyOnHidden
      width={520}
      centered
      title={
        <div>
          {title}
          <span className="pm-sub">
            {debt.name} · {debt.namePerson}
          </span>
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('debtForms.cancel')}
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={submitting}
          disabled={insufficient}
          onClick={() => form.submit()}
        >
          {okText}
        </Button>,
      ]}
    >
      <div className="pm-highlight">
        <Text type="secondary">
          {collecting ? t('debt.receivable') : t('debt.payable')}
        </Text>
        <Title
          level={3}
          className="dp-num"
          style={{
            margin: 0,
            color: collecting ? 'var(--d-income)' : 'var(--d-danger)',
          }}
        >
          {convertCurrency(outstanding)}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label={t('debtForms.amount')}
          required
          style={{ marginBottom: 16 }}
        >
          <div className="pm-amount-row">
            <Form.Item
              name="amount"
              noStyle
              rules={[
                { required: true, message: t('debtForms.amountRequired') },
                {
                  type: 'number',
                  min: 0.01,
                  message: t('debtForms.amountPositive'),
                },
              ]}
            >
              <InputNumber
                aria-label={t('debtForms.amount')}
                placeholder={t('debtForms.amountPlaceholder')}
                precision={2}
                {...InputWithComma}
              />
            </Form.Item>
            {!increasing && (
              <Button
                onClick={() => {
                  form.setFieldsValue({ amount: outstanding })
                  form.validateFields(['amount', 'walletId']).catch(() => {})
                }}
              >
                {collecting ? t('debtForms.collectAll') : t('debtForms.payAll')}
              </Button>
            )}
          </div>
        </Form.Item>

        <Form.Item
          name="occurredAt"
          label={t('debtForms.date')}
          rules={[{ required: true, message: t('debtForms.dateRequired') }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            allowClear={false}
            // BE từ chối ngày tương lai; không cho chọn trước ngày bắt đầu nợ
            disabledDate={(d) =>
              d.isAfter(dayjs(), 'day') ||
              d.isBefore(dayjs(debt.startDate), 'day')
            }
          />
        </Form.Item>

        <WalletBalanceSwitch
          title={t('debtForms.updateWallet')}
          hintOff={t('debtForms.alertBookOnly')}
          hintOn={isInflow ? t('debtForms.hintAdd') : t('debtForms.hintDeduct')}
          wallets={wallets}
          isLoadingWallets={isLoadingWallets}
          amount={amount}
          amountField="amount"
          isInflow={isInflow}
        />

        <Form.Item name="note" label={t('debtForms.noteOptional')}>
          <Input.TextArea
            rows={2}
            maxLength={500}
            placeholder={t('debtForms.paymentNotePlaceholder')}
          />
        </Form.Item>

        <div className="pm-preview" aria-live="polite">
          <span>{previewLabel}</span>
          <Text strong className="dp-num">
            {convertCurrency(remaining)}
          </Text>
        </div>

        {fifoHint && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 12 }}
            message={t('debtForms.fifoHint')}
          />
        )}

        {excess > 0 && (
          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 12 }}
            message={t('debtForms.excessAsInterest', {
              amount: convertCurrency(excess),
            })}
          />
        )}

        {!increasing && validAmount && remaining === 0 && (
          <Alert
            type="success"
            showIcon
            style={{ marginTop: 12 }}
            message={t('debtForms.willPayOff')}
          />
        )}
      </Form>
    </Modal>
  )
}
