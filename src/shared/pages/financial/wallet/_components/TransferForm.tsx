import { useEffect } from 'react'
import { Button, Form, InputNumber, Select, Space, Typography } from 'antd'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { InputWithComma } from '@/shared/components/input/utils'

export function TransferForm({
  wallets,
  onTransfer,
  onClose,
}: {
  wallets: Array<IWallet_Wallet>
  onTransfer: (
    fromId: number,
    toId: number,
    amount: number,
    transferFee: number,
  ) => void
  onClose: () => void
}) {
  const [form] = Form.useForm()

  const fromWalletId = Form.useWatch('fromWalletId', form)

  useEffect(() => {
    form.setFieldsValue({
      fromWalletId: wallets[0]?.id ?? '',
      toWalletId: wallets[1]?.id ?? '',
    })
  }, [wallets, form])

  useEffect(() => {
    const currentTo = form.getFieldValue('toWalletId')
    if (fromWalletId && currentTo === fromWalletId) {
      const nextAvailableWallet = wallets.find((w) => w.id !== fromWalletId)
      form.setFieldValue('toWalletId', nextAvailableWallet?.id ?? '')
    }

    if (form.getFieldValue('amount')) {
      form.validateFields(['amount'])
    }
  }, [fromWalletId, wallets, form])

  const onFinish = (values: {
    fromWalletId: number
    toWalletId: number
    amount: number
    transferFee: number
  }) => {
    onTransfer(
      values.fromWalletId,
      values.toWalletId,
      values.amount,
      values.transferFee,
    )
    onClose()
  }

  return (
    <Form
      form={form} // Gắn form instance vào đây
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        transferFee: 0,
      }}
    >
      {/* Cần đặt thuộc tính "name" trùng khớp với DTO nhận ở Backend */}
      <Form.Item
        label="From Wallet"
        name="fromWalletId"
        rules={[{ required: true, message: 'Please select source wallet' }]}
      >
        <Select
          options={wallets.map((w) => ({
            value: w.id,
            label: w.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="To Wallet"
        name="toWalletId"
        rules={[
          { required: true, message: 'Please select destination wallet' },
        ]}
      >
        <Select
          options={wallets
            .filter((w) => w.id !== fromWalletId) // Lọc bỏ ví gửi đang chọn
            .map((w) => ({
              value: w.id,
              label: w.name,
            }))}
        />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            message: 'Please input the transfer amount',
          },
          () => ({
            validator(_, value) {
              if (value === undefined || value === null) {
                return Promise.resolve()
              }
              if (value <= 0) {
                return Promise.reject(
                  new Error('Amount must be greater than 0'),
                )
              }

              const selectedWallet = wallets.find((w) => w.id === fromWalletId)
              const balance = selectedWallet?.balance ?? 0
              if (value > balance) {
                return Promise.reject(
                  new Error(
                    'Amount exceeds the balance of the selected wallet',
                  ),
                )
              }

              return Promise.resolve()
            },
          }),
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="0.00"
          {...InputWithComma}
          suffix={'VND'}
        />
      </Form.Item>

      <Form.Item
        label="Transfer Fee"
        name="transferFee"
        rules={[
          {
            required: true,
            message: 'Please input the transfer fee',
          },
        ]}
      >
        <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
          Transfer fee will be deducted from "From Wallet".
        </Typography.Paragraph>
        <InputNumber
          style={{ width: '100%' }}
          placeholder="0.00"
          {...InputWithComma}
          suffix={'VND'}
        />
      </Form.Item>

      <Space style={{ width: '100%', marginTop: 8 }} size={8}>
        <Button onClick={onClose} block>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" block>
          Transfer
        </Button>
      </Space>
    </Form>
  )
}
