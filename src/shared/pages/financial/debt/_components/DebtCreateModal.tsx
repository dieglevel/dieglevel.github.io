import React, { useEffect } from 'react'
import {
  Alert,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_TYPE_ENUM,
  FinancialDebtDirectionHelper,
  FinancialDebtTypeHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { InputWithComma } from '@/shared/components/input/utils'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface DebtCreateModalProps {
  open: boolean
  isLoadingWallets: boolean
  wallets: Array<IFinance_Wallet>
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
}

export const DebtCreateModal: React.FC<DebtCreateModalProps> = ({
  open,
  isLoadingWallets,
  wallets,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm()

  const selectedDirection = Form.useWatch('direction', form)
  const originalAmount = Form.useWatch('originalAmount', form)
  const selectedWalletId = Form.useWatch('walletId', form)

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId)

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        direction: FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING,
        type: FINANCIAL_DEBT_TYPE_ENUM.LOAN,
        startDate: dayjs(),
      })
    }
  }, [open, form])

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
    await onSubmit(values)
  }

  const isOutgoing =
    selectedDirection === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING
  const currentBalance = selectedWallet
    ? Number(selectedWallet.balance || 0)
    : 0
  const amountNumber = Number(originalAmount || 0)
  const projectedBalance = isOutgoing
    ? currentBalance - amountNumber
    : currentBalance + amountNumber

  return (
    <Modal
      title="Tạo khoản nợ mới"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnClose
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Alert
          type={isOutgoing ? 'warning' : 'info'}
          showIcon
          style={{ marginBottom: 12 }}
          message={
            isOutgoing
              ? 'Số tiền nợ sẽ được trừ trực tiếp từ ví đã chọn.'
              : 'Số tiền nợ sẽ được cộng trực tiếp vào ví đã chọn.'
          }
        />

        {selectedWallet && (
          <Card
            size="small"
            style={{
              marginBottom: 16,
              backgroundColor: isOutgoing ? '#fff2f0' : '#f6ffed',
              borderColor: isOutgoing ? '#ffccc7' : '#b7eb8f',
            }}
          >
            <Flex vertical gap={6}>
              <Flex justify="space-between" align="center">
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Số dư ví hiện tại ({selectedWallet.name}):
                </Text>
                <Text
                  strong
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {convertCurrency(currentBalance)}
                </Text>
              </Flex>

              {amountNumber > 0 && (
                <>
                  <Flex justify="space-between" align="center">
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Số tiền thay đổi ví khi tạo nợ:
                    </Text>
                    <Text
                      strong
                      style={{
                        fontSize: 14,
                        color: isOutgoing ? '#ff4d4f' : '#52c41a',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {isOutgoing ? '-' : '+'}
                      {convertCurrency(amountNumber)}
                    </Text>
                  </Flex>

                  <Flex
                    justify="space-between"
                    align="center"
                    style={{
                      borderTop: '1px dashed #cbd5e1',
                      paddingTop: 6,
                      marginTop: 2,
                    }}
                  >
                    <Text strong style={{ fontSize: 13 }}>
                      Số dư dự kiến sau tạo nợ:
                    </Text>
                    <Text
                      strong
                      style={{
                        fontSize: 15,
                        color:
                          isOutgoing && projectedBalance < 0
                            ? '#dc2626'
                            : '#1677ff',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {convertCurrency(projectedBalance)}
                    </Text>
                  </Flex>
                </>
              )}
            </Flex>
          </Card>
        )}

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label="Tên khoản nợ"
              rules={[
                { required: true, message: 'Vui lòng nhập tên khoản nợ' },
              ]}
            >
              <Input placeholder="Vd: Cho Nam mượn tiền, Vay mua xe..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="namePerson"
              label="Tên đối tác / Người vay hoặc cho vay"
              rules={[{ required: true, message: 'Vui lòng nhập tên đối tác' }]}
            >
              <Input placeholder="Vd: Nguyen Van A..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="direction"
              label="Chiều nợ"
              rules={[{ required: true, message: 'Vui lòng chọn chiều nợ' }]}
            >
              <Select
                options={FinancialDebtDirectionHelper.getOptions()}
                placeholder="Chọn chiều nợ"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Loại nợ"
              rules={[{ required: true, message: 'Vui lòng chọn loại nợ' }]}
            >
              <Select
                placeholder="Chọn loại nợ"
                options={FinancialDebtTypeHelper.getOptions()}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="originalAmount"
              label="Số tiền ban đầu"
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền' },
                { type: 'number', min: 1, message: 'Số tiền phải lớn hơn 0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền..."
                precision={2}
                {...InputWithComma}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="walletId"
              label="Ví giao dịch liên quan"
              rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
            >
              <Select
                placeholder="Chọn ví"
                loading={isLoadingWallets}
                options={walletOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
              ]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="dueDate" label="Hạn trả (nếu có)">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Ghi chú / Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết khoản nợ..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
