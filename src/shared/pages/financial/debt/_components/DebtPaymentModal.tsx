import React, { useEffect, useState } from 'react'
import {
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tabs,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { DebtHistoryTable } from './DebtHistoryTable'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { FINANCIAL_DEBT_DIRECTION_ENUM } from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { InputWithComma } from '@/shared/components/input/utils'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'

const { Text } = Typography
const mono = "'JetBrains Mono', monospace"

interface DebtPaymentModalProps {
  open: boolean
  debt: IFinance_Debt | null
  wallets: Array<IFinance_Wallet>
  isLoadingWallets: boolean
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
}

export const DebtPaymentModal: React.FC<DebtPaymentModalProps> = ({
  open,
  debt,
  wallets,
  isLoadingWallets,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm()
  const [activeTabKey, setActiveTabKey] = useState<string>('payment')

  const paymentAmount = Number(Form.useWatch('amount', form) || 0)
  const selectedWalletId = Form.useWatch('walletId', form)

  useEffect(() => {
    if (open && debt) {
      form.resetFields()
      form.setFieldsValue({
        amount: Number(debt.outstandingAmount),
        occurredAt: dayjs(),
      })
      setActiveTabKey('payment')
    }
  }, [open, debt, form])

  if (!debt) return null

  const isIncoming = debt.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId)

  const remainingDebt = Math.max(0, debt.outstandingAmount - paymentAmount)
  const currentBalance = Number(selectedWallet?.balance || 0)
  const projectedBalance =
    currentBalance + (isIncoming ? paymentAmount : -paymentAmount)
  const insufficient = !!selectedWallet && !isIncoming && projectedBalance < 0

  const walletOptions = wallets.map((w) => ({
    value: w.id,
    label: (
      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
        <Flex align="center" gap={8}>
          <IconRenderer iconName={w.icon} />
          <Text style={{ fontSize: 13 }}>{w.name}</Text>
        </Flex>
        <Text
          type="secondary"
          style={{ fontSize: 12, fontFamily: 'monospace' }}
        >
          {convertCurrency(w.balance)}
        </Text>
      </Flex>
    ),
  }))

  const handleFinish = async (values: any) => {
    await onSubmit({
      ...values,
      occurredAt: values.occurredAt.format('YYYY-MM-DD'),
      walletId: values.walletId ?? undefined,
    })
  }

  const isPaymentTab = activeTabKey === 'payment'

  return (
    <Modal
      title={isIncoming ? 'Thu hồi nợ (Nhận tiền)' : 'Thanh toán nợ (Trả tiền)'}
      open={open}
      onCancel={onClose}
      onOk={() => (isPaymentTab ? form.submit() : onClose())}
      okText={isPaymentTab ? 'Xác nhận' : 'Đóng'}
      okButtonProps={{ disabled: isPaymentTab && insufficient }}
      destroyOnClose
      width={720}
      centered
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={[
          {
            key: 'payment',
            label: isIncoming ? 'Thực hiện thu nợ' : 'Thực hiện thanh toán',
          },
          { key: 'history', label: 'Lịch sử biến động' },
        ]}
      />

      {isPaymentTab ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 8 }}
        >
          <Card
            size="small"
            style={{ backgroundColor: '#fafafa', marginBottom: 16 }}
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Khoản nợ" span={2}>
                <Text strong>{debt.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Đối tác">
                {debt.namePerson}
              </Descriptions.Item>
              <Descriptions.Item label="Dư nợ hiện tại">
                <Text type="danger" strong style={{ fontFamily: 'monospace' }}>
                  {convertCurrency(debt.outstandingAmount)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Flex gap={12} wrap>
            <Form.Item
              name="occurredAt"
              label="Ngày giao dịch"
              style={{ flex: 1, minWidth: 180 }}
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                allowClear={false}
                disabledDate={(d) => d.isBefore(dayjs(debt.startDate), 'day')}
              />
            </Form.Item>

            <Form.Item
              name="walletId"
              label="Ví (không bắt buộc)"
              style={{ flex: 2, minWidth: 220 }}
              tooltip="Bỏ trống nếu không muốn thay đổi số dư ví."
            >
              <Select
                allowClear
                placeholder="Không dùng ví (chỉ ghi sổ)"
                loading={isLoadingWallets}
                options={walletOptions}
              />
            </Form.Item>
          </Flex>

          <Form.Item
            name="amount"
            label="Số tiền"
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền' },
              { type: 'number', min: 0.01, message: 'Số tiền phải lớn hơn 0' },
              {
                type: 'number',
                max: debt.outstandingAmount,
                message: 'Không được vượt quá dư nợ còn lại',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập số tiền..."
              precision={2}
              {...InputWithComma}
            />
          </Form.Item>

          {selectedWallet && paymentAmount > 0 && (
            <Card
              size="small"
              style={{
                marginBottom: 16,
                backgroundColor: isIncoming ? '#f6ffed' : '#fff2f0',
                borderColor: isIncoming ? '#b7eb8f' : '#ffccc7',
              }}
            >
              <Flex vertical gap={6}>
                <Flex justify="space-between">
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Số dư ví ({selectedWallet.name}):
                  </Text>
                  <Text strong style={{ fontFamily: mono }}>
                    {convertCurrency(currentBalance)}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Biến động ví ({isIncoming ? 'nhận tiền' : 'trả tiền'}):
                  </Text>
                  <Text
                    strong
                    style={{
                      color: isIncoming ? '#52c41a' : '#ff4d4f',
                      fontFamily: mono,
                    }}
                  >
                    {isIncoming ? '+' : '-'}
                    {convertCurrency(paymentAmount)}
                  </Text>
                </Flex>
                <Divider style={{ margin: '4px 0' }} dashed />
                <Flex justify="space-between">
                  <Text strong style={{ fontSize: 13 }}>
                    Số dư ví dự kiến:
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: 15,
                      color: insufficient ? '#dc2626' : '#1677ff',
                      fontFamily: mono,
                    }}
                  >
                    {convertCurrency(projectedBalance)}
                  </Text>
                </Flex>
                {insufficient && (
                  <Text type="danger" style={{ fontSize: 12 }}>
                    Số dư ví không đủ.
                  </Text>
                )}
              </Flex>
            </Card>
          )}

          <Card
            size="small"
            style={{
              backgroundColor: remainingDebt === 0 ? '#f6ffed' : '#e6f7ff',
              borderColor: remainingDebt === 0 ? '#b7eb8f' : '#91caff',
              marginBottom: 16,
            }}
          >
            <Flex justify="space-between" align="center">
              <Text type="secondary">Dư nợ còn lại sau giao dịch:</Text>
              <Text
                strong
                style={{
                  color: remainingDebt === 0 ? '#52c41a' : '#1677ff',
                  fontSize: 15,
                  fontFamily: mono,
                }}
              >
                {convertCurrency(remainingDebt)}{' '}
                {remainingDebt === 0 && '(Hoàn tất nợ)'}
              </Text>
            </Flex>
          </Card>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea
              rows={2}
              maxLength={500}
              placeholder="Nội dung/ghi chú..."
            />
          </Form.Item>
        </Form>
      ) : (
        <DebtHistoryTable debtId={debt.id} />
      )}
    </Modal>
  )
}
