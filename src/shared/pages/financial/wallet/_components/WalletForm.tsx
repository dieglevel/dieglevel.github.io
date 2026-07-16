import { useEffect } from 'react'
import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import ColorPicker from '@/shared/components/color-picker'
import { IconPicker } from '@/shared/components/icon-picker'
import { FINANCIAL_WALLET_TYPE_OPTIONS } from '@/shared/api/financial/wallet/wallet.enum'
import { InputWithComma } from '@/shared/components/input/utils'

interface WalletModalProps {
  open: boolean
  wallet?: IWallet_Wallet | null
  onCancel: () => void
  onSubmit: (data: IWallet_Wallet) => Promise<void>
}

export function WalletModal({
  open,
  wallet,
  onCancel,
  onSubmit,
}: WalletModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!open) return
    form.setFieldsValue(
      wallet
        ? wallet
        : {
            name: '',
            type: 'bank',
            balance: 0,
            currency: 'USD',
            color: '#5b5fef',
            icon: '🏦',
          },
    )
  }, [open, wallet, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      open={open}
      title={wallet ? 'Edit Wallet' : 'Add Wallet'}
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Wallet Name"
          name="name"
          rules={[{ required: true, message: 'Please enter wallet name' }]}
        >
          <Input placeholder="e.g. Chase Savings" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select wallet type' }]}
        >
          <Select
            options={Object.entries(FINANCIAL_WALLET_TYPE_OPTIONS).map(
              ([value, { label }]) => ({
                value,
                label,
              }),
            )}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Balance" name="balance">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                {...InputWithComma}
                suffix={'VND'}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Icon" name="icon" shouldUpdate>
              <IconPicker />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Color" shouldUpdate>
          {() => (
            <Form.Item noStyle name="color">
              <ColorPicker
                value={form.getFieldValue('color')}
                onChange={(color) => form.setFieldValue('color', color)}
              />
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
