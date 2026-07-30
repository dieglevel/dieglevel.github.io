import React, { useEffect } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Select,
  Typography,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import type { FinancialAdvanceTransaction_Create_Request } from '@/shared/api/financial/transaction/advance-transaction/advance-transaction.mutation'
import { useGetWallet_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useGetWallet_Category_List } from '@/shared/api/financial/category/useGetWallet_Category_List'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { InputWithComma } from '@/shared/components/input/utils'
import { useMutationAdvanceTransaction } from '@/shared/api/financial/transaction/advance-transaction/advance-transaction.mutation'

const { Text, Title } = Typography

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm()

  // Custom hook hoặc Mutation cho Advance Transaction
  const { mAdvanceTransaction_Create } = useMutationAdvanceTransaction()

  const { data: wallets } = useGetWallet_Wallet_List({
    options: { enabled: open },
  })

  const { data: categories } = useGetWallet_Category_List({
    options: { enabled: open },
  })

  // Watch danh sách sub-items để tính tổng tiền
  const items = Form.useWatch('data', form) || []
  const totalAmount = items.reduce(
    (sum: number, item: { amount?: number }) =>
      sum + (Number(item.amount) || 0),
    0,
  )

  // Reset form khi modal mở/đóng
  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        type: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
        walletId: wallets?.data[0]?.id,
        categoryId: categories?.data[0]?.id,
        date: dayjs(),
        status: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
        data: [{ description: '', amount: null }], // Mặc định 1 dòng nhập
      })
    }
  }, [open, wallets, categories, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      // Format payload chuẩn DTO Backend
      const payload: FinancialAdvanceTransaction_Create_Request = {
        ...values,
        date: values.date.toISOString(),
        data: values.data.map(
          (item: { description: string; amount: number }) => ({
            description: item.description,
            amount: Number(item.amount),
          }),
        ),
      }

      await mAdvanceTransaction_Create.mutateAsync({ body: payload })

      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title="Tạo Giao Dịch Nâng Cao"
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText="Lưu Giao Dịch"
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Loại giao dịch */}
        <Form.Item name="type">
          <Segmented
            block
            options={[
              {
                label: 'Chi tiêu (Expense)',
                value: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
              },
              {
                label: 'Thu nhập (Income)',
                value: FINANCIAL_TRANSACTION_TYPE.INCOME,
              },
            ]}
          />
        </Form.Item>

        {/* Ví & Danh mục */}
        <Flex gap={12}>
          <Form.Item
            label="Ví thanh toán"
            name="walletId"
            className="flex-1"
            rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
          >
            <Select
              placeholder="Chọn ví"
              options={wallets?.data.map((w) => ({
                value: w.id,
                label: (
                  <Flex align="center" gap={8}>
                    <IconRenderer iconName={w.icon} />
                    <Text style={{ fontSize: 13 }}>{w.name}</Text>
                  </Flex>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="categoryId"
            className="flex-1"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={categories?.data.map((c) => ({
                value: c.id,
                label: (
                  <Flex align="center" gap={8}>
                    <IconRenderer iconName={c.icon} />
                    <Text style={{ fontSize: 13 }}>{c.name}</Text>
                  </Flex>
                ),
              }))}
            />
          </Form.Item>
        </Flex>

        {/* Tiêu đề / Mô tả chung */}
        <Form.Item
          label="Mô tả chung"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả chung' }]}
        >
          <Input placeholder="Ví dụ: Đi siêu thị cuối tuần, Mua sắm tổng hợp..." />
        </Form.Item>

        {/* DANH SÁCH CÁC HẠNG MỤC CHI TIẾT (Advance Transactions) */}
        <Form.Item label="Chi tiết các khoản" required>
          <Form.List
            name="data"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.length < 1) {
                    return Promise.reject(
                      new Error('Cần ít nhất 1 hạng mục chi tiết'),
                    )
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <Flex vertical gap={10}>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ background: '#fafafa' }}
                  >
                    <Flex gap={8} align="start">
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[{ required: true, message: 'Nhập nội dung' }]}
                        style={{ flex: 2, marginBottom: 0 }}
                      >
                        <Input placeholder="Tên khoản (vd: Thịt heo, Rau củ...)" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        rules={[{ required: true, message: 'Nhập số tiền' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Số tiền"
                          min={0}
                          precision={2}
                          {...InputWithComma}
                        />
                      </Form.Item>

                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      )}
                    </Flex>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm hạng mục
                </Button>
              </Flex>
            )}
          </Form.List>
        </Form.Item>

        {/* BẢNG TỔNG TIỀN HIỂN THỊ DẠNG TỰ ĐỘNG TÍNH */}
        <Card
          size="small"
          style={{
            backgroundColor: '#f6ffed',
            borderColor: '#b7eb8f',
            marginBottom: 16,
          }}
        >
          <Flex justify="space-between" align="center">
            <Text type="secondary">Tổng cộng:</Text>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              $
              {totalAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </Title>
          </Flex>
        </Card>

        {/* Ngày & Trạng thái */}
        <Flex gap={12}>
          <Form.Item
            label="Ngày giao dịch"
            name="date"
            className="flex-1"
            rules={[{ required: true, message: 'Chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            className="flex-1"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                {
                  value: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
                  label: '✅ Hoàn thành',
                },
                {
                  value: FINANCIAL_TRANSACTION_STATUS.PENDING,
                  label: '⏳ Đang chờ',
                },
                {
                  value: FINANCIAL_TRANSACTION_STATUS.FAILED,
                  label: '❌ Thất bại',
                },
              ]}
            />
          </Form.Item>
        </Flex>

        {/* Ghi chú */}
        <Form.Item
          label="Ghi chú (Tùy chọn)"
          name="note"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea rows={2} placeholder="Thêm ghi chú thêm nếu có..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
