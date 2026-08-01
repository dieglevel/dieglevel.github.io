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
  message,
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
import { useGetWallet_Transaction_List } from '@/shared/api/financial/transaction/useGetWallet_Transaction_List'

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

  const { mAdvanceTransaction_Create } = useMutationAdvanceTransaction()

  // API Danh sách Ví & Danh mục
  const { data: wallets, isLoading: isLoadingWallets } =
    useGetWallet_Wallet_List({
      options: { enabled: open },
    })

  const { data: categories, isLoading: isLoadingCategories } =
    useGetWallet_Category_List({
      options: { enabled: open },
    })

  // API Danh sách Giao dịch gốc (dành cho chọn originalTransactionId)
  const { data: originalTransactions, isLoading: isLoadingOriginal } =
    useGetWallet_Transaction_List({
      options: { enabled: open },
    })

  // Tự động tính tổng tiền từ danh sách financialAdvanceTransactions
  const items = Form.useWatch('financialAdvanceTransactions', form) || []
  const calculatedTotalAmount = items.reduce(
    (sum: number, item: { amount?: number }) =>
      sum + (Number(item.amount) || 0),
    0,
  )

  // Cập nhật giá trị amount chính khi tổng danh sách nâng cao thay đổi
  useEffect(() => {
    if (items.length > 0) {
      form.setFieldValue('amount', calculatedTotalAmount)
    }
  }, [calculatedTotalAmount, items.length, form])

  // Reset form khi modal mở
  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        type: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
        status: FINANCIAL_TRANSACTION_STATUS.PENDING,
        date: dayjs(),
        financialAdvanceTransactions: [{ description: '', amount: null }],
      })
    }
  }, [open, form])

  // Set Ví & Danh mục mặc định khi API trả về
  useEffect(() => {
    if (open) {
      if (wallets?.data.length && !form.getFieldValue('walletId')) {
        form.setFieldValue('walletId', wallets.data[0].id)
      }
      if (categories?.data.length && !form.getFieldValue('categoryId')) {
        form.setFieldValue('categoryId', categories.data[0].id)
      }
    }
  }, [open, wallets, categories, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('Validated form values:', values)

      // Format Payload chuẩn các trường theo Entity Backend
      const payload: FinancialAdvanceTransaction_Create_Request = {
        description: values.description?.trim(),
        type: values.type,
        status: values.status,
        walletId: Number(values.walletId),
        categoryId: values.categoryId ? Number(values.categoryId) : undefined,

        date: values.date.toISOString(),
        data: values.financialAdvanceTransactions.map(
          (item: { description: string; amount: number }) => ({
            description: item.description,
            amount: Number(item.amount),
          }),
        ),
      }

      await mAdvanceTransaction_Create.mutateAsync({ body: payload })

      message.success('Tạo giao dịch thành công!')
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation/API error:', error)
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
      confirmLoading={mAdvanceTransaction_Create.isPending}
      destroyOnClose
      width={680}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* 1. Phân loại giao dịch (type) */}
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

        {/* 2. Wallet & Category */}
        <Flex gap={12}>
          <Form.Item
            label="Ví thanh toán (walletId)"
            name="walletId"
            className="flex-1"
            rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
          >
            <Select
              placeholder="Chọn ví"
              loading={isLoadingWallets}
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
            label="Danh mục (categoryId)"
            name="categoryId"
            className="flex-1"
          >
            <Select
              placeholder="Chọn danh mục"
              allowClear
              loading={isLoadingCategories}
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

        {/* 3. Mô tả chung (description) */}
        <Form.Item
          label="Mô tả giao dịch (description)"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả' },
            { whitespace: true, message: 'Không được chỉ nhập khoảng trắng' },
          ]}
        >
          <Input placeholder="Mô tả nội dung giao dịch..." maxLength={255} />
        </Form.Item>

        {/* 4. Merchant & Location */}
        <Flex gap={12}>
          <Form.Item
            label="Đơn vị cung cấp / Cửa hàng (merchant)"
            name="merchant"
            className="flex-1"
          >
            <Input placeholder="Ví dụ: Shopee, Starbucks..." maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Địa điểm (location)"
            name="location"
            className="flex-1"
          >
            <Input placeholder="Ví dụ: Hà Nội, Quận 1..." maxLength={255} />
          </Form.Item>
        </Flex>

        {/* 5. Giao dịch gốc (originalTransactionId) - Dùng khi hoàn tiền */}
        <Form.Item
          label="Giao dịch gốc (originalTransactionId) - Chọn nếu là giao dịch Hoàn tiền"
          name="originalTransactionId"
        >
          <Select
            placeholder="Chọn giao dịch gốc liên quan (nếu có)"
            allowClear
            loading={isLoadingOriginal}
            options={originalTransactions?.data.map((t) => ({
              value: t.id,
              label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
            }))}
          />
        </Form.Item>

        {/* 6. Chi tiết các khoản tạm ứng (financialAdvanceTransactions) */}
        <Form.Item
          label="Chi tiết các khoản (financialAdvanceTransactions)"
          required
          style={{ marginBottom: 12 }}
        >
          <Form.List
            name="financialAdvanceTransactions"
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
                    bodyStyle={{ padding: 12 }}
                  >
                    <Flex gap={8} align="start">
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[
                          { required: true, message: 'Nhập nội dung' },
                          { whitespace: true, message: 'Không để trống' },
                        ]}
                        style={{ flex: 2, marginBottom: 0 }}
                      >
                        <Input placeholder="Nội dung khoản chi tiết" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        rules={[
                          { required: true, message: 'Nhập số tiền' },
                          { type: 'number', min: 0.01, message: 'Phải > 0' },
                        ]}
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
                  onClick={() => add({ description: '', amount: null })}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm hạng mục
                </Button>
              </Flex>
            )}
          </Form.List>
        </Form.Item>

        {/* 7. Tổng tiền (amount) */}
        <Form.Item name="amount" hidden>
          <InputNumber />
        </Form.Item>
        <Card
          size="small"
          style={{
            backgroundColor: '#f6ffed',
            borderColor: '#b7eb8f',
            marginBottom: 16,
          }}
        >
          <Flex justify="space-between" align="center">
            <Text type="secondary">Tổng tiền giao dịch (amount):</Text>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              {calculatedTotalAmount.toLocaleString('vi-VN')} đ
            </Title>
          </Flex>
        </Card>

        {/* 8. Tags & Receipt Image */}
        <Flex gap={12}>
          <Form.Item label="Thẻ (tags)" name="tags" className="flex-1">
            <Select
              mode="tags"
              placeholder="Nhập tag và bấm Enter..."
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Link ảnh hóa đơn (receiptImageUrl)"
            name="receiptImageUrl"
            className="flex-1"
          >
            <Input placeholder="https://..." maxLength={500} />
          </Form.Item>
        </Flex>

        {/* 9. Ngày & Trạng thái (status) */}
        <Flex gap={12}>
          <Form.Item
            label="Ngày thực hiện"
            name="date"
            className="flex-1"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Trạng thái (status)"
            name="status"
            className="flex-1"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                {
                  value: FINANCIAL_TRANSACTION_STATUS.PENDING,
                  label: '⏳ PENDING (Đang chờ)',
                },
                {
                  value: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
                  label: '✅ COMPLETED (Hoàn thành)',
                },
                {
                  value: FINANCIAL_TRANSACTION_STATUS.FAILED,
                  label: '❌ FAILED (Thất bại)',
                },
              ]}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  )
}
