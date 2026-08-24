import React, { useEffect, useState } from 'react'
import {
  Card,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

import type {
  IFinance_Debt,
  IFinance_DebtHistory,
} from '@/shared/api/financial/debt/debt.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FinancialDebtHistoryTypeHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { useGetFinance_Debt_Histories } from '@/shared/api/financial/debt/useGetDebtHistories'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'
import { InputWithComma } from '@/shared/components/input/utils'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'

const { Text } = Typography

interface DebtPaymentModalProps {
  open: boolean
  debt: IFinance_Debt
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

  const watch = Form.useWatch([], form)
  console.log('watch', watch)

  const paymentAmount = Form.useWatch('amount', form) || 0
  const selectedWalletId = Form.useWatch('walletId', form)

  // Load Lịch sử khoản nợ
  const { data: historyResponse, isLoading: isLoadingHistory } =
    useGetFinance_Debt_Histories({
      id: debt.id,
    })
  const histories = historyResponse?.data || []

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        amount: Number(debt.outstandingAmount),
      })
      setActiveTabKey('payment')
    }
  }, [open, debt, form])

  const isIncoming = debt.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId)

  // Tính toán Dư nợ còn lại
  const paymentAmountNumber = Number(paymentAmount || 0)
  const remainingDebt = Math.max(
    0,
    debt.outstandingAmount - paymentAmountNumber,
  )

  // Tính toán biến động ví
  const currentWalletBalance = selectedWallet
    ? Number(selectedWallet.balance || 0)
    : 0
  const walletChange = isIncoming ? paymentAmountNumber : -paymentAmountNumber
  const projectedWalletBalance = currentWalletBalance + walletChange

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

  // Columns cho bảng Lịch sử
  const historyColumns: ColumnsType<IFinance_DebtHistory> = [
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => (
        <Text
          type="secondary"
          style={{ fontSize: 11, fontFamily: 'monospace' }}
        >
          {DayjsHelper.formatDate(date, 'DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => (
        <Tag color={FinancialDebtHistoryTypeHelper.getColor(type)}>
          {FinancialDebtHistoryTypeHelper.getLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Số tiền tác động',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (val: number) => (
        <Text strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {convertCurrency(val || 0)}
        </Text>
      ),
    },
    {
      title: 'Dư nợ còn lại',
      key: 'outstandingAmount',
      align: 'right',
      render: (_, record) => (
        <Text strong style={{ color: '#1677ff', fontFamily: 'monospace' }}>
          {convertCurrency(record.outstandingAmount)}
        </Text>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note: string) => note || <Text type="secondary">-</Text>,
    },
  ]

  return (
    <Modal
      title={isIncoming ? 'Thu hồi nợ (Nhận tiền)' : 'Thanh toán nợ (Trả tiền)'}
      open={open}
      onCancel={onClose}
      onOk={() => {
        if (activeTabKey === 'payment') {
          form.submit()
        } else {
          onClose()
        }
      }}
      okText={activeTabKey === 'payment' ? 'Xác nhận thanh toán' : 'Đóng'}
      destroyOnClose
      width={680}
      centered
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={[
          {
            key: 'payment',
            label: `Thực hiện ${isIncoming ? 'thu nợ' : 'thanh toán'}`,
          },
          {
            key: 'history',
            label: `Lịch sử biến động (${histories.length})`,
          },
        ]}
      />

      {activeTabKey === 'payment' ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 8 }}
        >
          {/* Tóm tắt thông tin khoản nợ */}
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

          {/* Chọn Ví */}
          <Form.Item
            name="walletId"
            label="Ví giao dịch"
            rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
          >
            <Select
              placeholder="Chọn ví thanh toán / nhận tiền"
              loading={isLoadingWallets}
              options={walletOptions}
            />
          </Form.Item>

          {/* Hiển thị biến động Ví nếu đã chọn Ví */}
          {selectedWallet && (
            <Card
              size="small"
              style={{
                marginBottom: 16,
                backgroundColor: isIncoming ? '#f6ffed' : '#fff2f0',
                borderColor: isIncoming ? '#b7eb8f' : '#ffccc7',
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
                    {convertCurrency(currentWalletBalance)}
                  </Text>
                </Flex>

                {paymentAmountNumber > 0 && (
                  <>
                    <Flex justify="space-between" align="center">
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Biến động ví (
                        {isIncoming ? 'Cộng tiền thu nợ' : 'Trừ tiền trả nợ'}):
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          color: isIncoming ? '#52c41a' : '#ff4d4f',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {isIncoming ? '+' : '-'}
                        {convertCurrency(paymentAmountNumber)}
                      </Text>
                    </Flex>

                    <Divider style={{ margin: '4px 0' }} dashed />

                    <Flex justify="space-between" align="center">
                      <Text strong style={{ fontSize: 13 }}>
                        Số dư ví dự kiến sau giao dịch:
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: 15,
                          color:
                            !isIncoming && projectedWalletBalance < 0
                              ? '#dc2626'
                              : '#1677ff',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {convertCurrency(projectedWalletBalance)}
                      </Text>
                    </Flex>
                  </>
                )}
              </Flex>
            </Card>
          )}

          {/* Số tiền thanh toán */}
          <Form.Item
            name="amount"
            label="Số tiền thanh toán"
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền' },
              {
                type: 'number',
                min: 0.01,
                message: 'Số tiền phải lớn hơn 0',
              },
              {
                type: 'number',
                max: debt.outstandingAmount,
                message: 'Số tiền không được vượt quá dư nợ còn lại',
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

          {/* Preview dư nợ còn lại của Khoản nợ */}
          <Card
            size="small"
            style={{
              backgroundColor: remainingDebt === 0 ? '#f6ffed' : '#e6f7ff',
              borderColor: remainingDebt === 0 ? '#b7eb8f' : '#91caff',
              marginBottom: 16,
            }}
          >
            <Flex justify="space-between" align="center">
              <Text type="secondary">Dư nợ khoản nợ còn lại:</Text>
              <Text
                strong
                style={{
                  color: remainingDebt === 0 ? '#52c41a' : '#1677ff',
                  fontSize: 15,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {convertCurrency(remainingDebt)}{' '}
                {remainingDebt === 0 ? '(Hoàn tất nợ)' : ''}
              </Text>
            </Flex>
          </Card>

          <Form.Item name="note" label="Ghi chú thanh toán">
            <Input.TextArea
              rows={2}
              placeholder="Nội dung/ghi chú thanh toán..."
            />
          </Form.Item>
        </Form>
      ) : (
        /* Tab Lịch sử biến động khoản nợ */
        <Table<IFinance_DebtHistory>
          rowKey="id"
          loading={isLoadingHistory}
          columns={historyColumns}
          dataSource={histories}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          size="small"
          style={{ marginTop: 12 }}
        />
      )}
    </Modal>
  )
}
