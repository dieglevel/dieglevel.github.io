import React, { useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Segmented,
  Select,
  Space,
  Typography,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useRouter } from '@tanstack/react-router'

import type { IMutationTransaction_Create } from '@/shared/api/financial/transaction/transaction.mutation'
import { useGetFinance_Category_Count } from '@/shared/api/financial/category/useGetFinance_Category_Count'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { InputWithComma } from '@/shared/components/input/utils'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'

const { Text, Title } = Typography

export enum FINANCIAL_TRANSACTION_TYPE {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}

export enum FINANCIAL_TRANSACTION_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const CreateTransactionPage: React.FC = () => {
  const [form] = Form.useForm<IMutationTransaction_Create>()
  const router = useRouter()

  // API Danh sách Ví & Danh mục
  const { data: wallets, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const { data: categories, isLoading: isLoadingCategories } =
    useGetFinance_Category_Count({})
  const { data: originalTransactions, isLoading: isLoadingOriginal } =
    useGetFinance_Transaction_List({})

  // Tự động tính tổng tiền từ danh sách financialTransactionItems
  const items = Form.useWatch('financialTransactionItems', form) || []
  const calculatedTotalAmount = items.reduce(
    (sum: number, item: { amount?: number }) =>
      sum + (Number(item.amount) || 0),
    0,
  )

  // Cập nhật giá trị amount chính khi tổng danh sách hạng mục thay đổi
  useEffect(() => {
    if (items.length > 0) {
      form.setFieldValue('amount', calculatedTotalAmount)
    }
  }, [calculatedTotalAmount, items.length, form])

  // Thiết lập giá trị mặc định ban đầu
  useEffect(() => {
    form.setFieldsValue({
      type: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
      status: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
      date: dayjs(),
      financialTransactionItems: [
        { description: '', amount: 0, categoryId: undefined },
      ],
    })
  }, [form])

  const handleBack = () => {
    router.navigate({ to: '/financial/transaction' })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      const payload = {
        description: values.description,
        merchant: values.merchant || '',
        location: values.location || '',
        amount: values.amount,
        type: values.type,
        status: values.status,
        walletId: values.walletId,
        date: dayjs(values.date).format('YYYY-MM-DD'),
        originalTransactionId: values.originalTransactionId || undefined,
        receiptImageUrl: values.receiptImageUrl || '',
        financialTransactionItems: values.financialTransactionItems?.map(
          (item) => ({
            description: item.description,
            amount: item.amount,
            categoryId: item.categoryId,
          }),
        ),
      }

      console.log('Payload Submit:', payload)

      message.success('Tạo giao dịch thành công!')
      handleBack()
    } catch (error) {
      console.error('Validation/API error:', error)
    }
  }

  return (
    <div
      style={{
        padding: '20px 24px 100px 24px',
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Header trang */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Space align="center" size={12}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
          />
          <Title level={3} style={{ margin: 0 }}>
            Tạo Giao Dịch Mới
          </Title>
        </Space>
        <Space>
          <Button onClick={handleBack}>Hủy</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Lưu Giao Dịch
          </Button>
        </Space>
      </Flex>

      <Form form={form} layout="vertical">
        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI: Chi tiết các khoản giao dịch */}
          <Col xs={24} lg={15} xl={16}>
            <Card
              title="Chi tiết các khoản (financialTransactionItems)"
              style={{ height: '100%' }}
            >
              <Form.Item required style={{ marginBottom: 12 }}>
                <Form.List
                  name="financialTransactionItems"
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
                    <Flex vertical gap={12}>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card
                          key={key}
                          size="small"
                          style={{
                            background: '#fafafa',
                            borderColor: '#f0f0f0',
                          }}
                          styles={{ body: { padding: 12 } }}
                        >
                          <Row gutter={[12, 12]} align="middle">
                            {/* Nội dung khoản chi tiết */}
                            <Col xs={24} sm={10}>
                              <Form.Item
                                {...restField}
                                name={[name, 'description']}
                                rules={[
                                  { required: true, message: 'Nhập nội dung' },
                                  {
                                    whitespace: true,
                                    message: 'Không để trống',
                                  },
                                ]}
                                style={{ marginBottom: 0 }}
                              >
                                <Input placeholder="Nội dung chi tiết" />
                              </Form.Item>
                            </Col>

                            {/* Danh mục */}
                            <Col xs={24} sm={7}>
                              <Form.Item
                                {...restField}
                                name={[name, 'categoryId']}
                                style={{ marginBottom: 0 }}
                              >
                                <Select
                                  placeholder="Danh mục"
                                  allowClear
                                  loading={isLoadingCategories}
                                  options={categories?.data.map((c) => ({
                                    value: c.id,
                                    label: (
                                      <Flex align="center" gap={6}>
                                        <IconRenderer iconName={c.icon} />
                                        <Text style={{ fontSize: 12 }}>
                                          {c.name}
                                        </Text>
                                      </Flex>
                                    ),
                                  }))}
                                />
                              </Form.Item>
                            </Col>

                            {/* Số tiền */}
                            <Col xs={18} sm={5}>
                              <Form.Item
                                {...restField}
                                name={[name, 'amount']}
                                rules={[
                                  { required: true, message: 'Nhập số tiền' },
                                  {
                                    type: 'number',
                                    min: 0.01,
                                    message: 'Phải > 0',
                                  },
                                ]}
                                style={{ marginBottom: 0 }}
                              >
                                <InputNumber
                                  style={{ width: '100%' }}
                                  placeholder="Số tiền"
                                  min={0}
                                  precision={2}
                                  {...InputWithComma}
                                />
                              </Form.Item>
                            </Col>

                            {/* Nút xóa */}
                            <Col xs={6} sm={2} style={{ textAlign: 'right' }}>
                              {fields.length > 1 && (
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                />
                              )}
                            </Col>
                          </Row>
                        </Card>
                      ))}

                      <Button
                        type="dashed"
                        onClick={() =>
                          add({
                            description: '',
                            amount: null,
                            categoryId: undefined,
                          })
                        }
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm hạng mục
                      </Button>
                    </Flex>
                  )}
                </Form.List>
              </Form.Item>

              <Form.Item name="amount" hidden>
                <InputNumber />
              </Form.Item>

              <Card
                size="small"
                style={{
                  backgroundColor: '#f6ffed',
                  borderColor: '#b7eb8f',
                  marginTop: 20,
                }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap={8}
                >
                  <Text type="secondary">Tổng tiền giao dịch (amount):</Text>
                  <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                    {calculatedTotalAmount.toLocaleString('vi-VN')} đ
                  </Title>
                </Flex>
              </Card>
            </Card>
          </Col>

          {/* CỘT PHẢI: Thông tin chung & Bổ sung (Fixed ở màn hình Desktop) */}
          <Col xs={24} lg={9} xl={8}>
            <div
              style={{
                position: 'sticky',
                top: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Card 1: Thông tin chính */}
              <Card title="Thông tin chung">
                <Form.Item name="type" label="Loại giao dịch">
                  <Segmented
                    block
                    options={[
                      {
                        label: 'Chi tiêu',
                        value: FINANCIAL_TRANSACTION_TYPE.EXPENSE.toLowerCase(),
                      },
                      {
                        label: 'Thu nhập',
                        value: FINANCIAL_TRANSACTION_TYPE.INCOME.toLowerCase(),
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Ví thanh toán (walletId)"
                  name="walletId"
                  rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
                >
                  <Select
                    placeholder="Chọn ví thanh toán"
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
                  label="Mô tả giao dịch (description)"
                  name="description"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mô tả' },
                    {
                      whitespace: true,
                      message: 'Không được chỉ nhập khoảng trắng',
                    },
                  ]}
                >
                  <Input placeholder="Mô tả tổng quan..." maxLength={255} />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày thực hiện"
                      name="date"
                      rules={[{ required: true, message: 'Chọn ngày' }]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Trạng thái"
                      name="status"
                      rules={[{ required: true }]}
                    >
                      <Select
                        options={[
                          {
                            value:
                              FINANCIAL_TRANSACTION_STATUS.COMPLETED.toLowerCase(),
                            label: '✅ COMPLETED',
                          },
                          {
                            value:
                              FINANCIAL_TRANSACTION_STATUS.PENDING.toLowerCase(),
                            label: '⏳ PENDING',
                          },
                          {
                            value:
                              FINANCIAL_TRANSACTION_STATUS.FAILED.toLowerCase(),
                            label: '❌ FAILED',
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Card 2: Thông tin bổ sung */}
              <Card title="Thông tin bổ sung">
                <Form.Item label="Đơn vị / Cửa hàng (merchant)" name="merchant">
                  <Input placeholder="Shopee, Starbucks..." maxLength={255} />
                </Form.Item>

                <Form.Item label="Địa điểm (location)" name="location">
                  <Input placeholder="Hà Nội, TP.HCM..." maxLength={255} />
                </Form.Item>

                <Form.Item
                  label="Giao dịch gốc (Hoàn tiền)"
                  name="originalTransactionId"
                >
                  <Select
                    placeholder="Chọn giao dịch gốc (nếu có)"
                    allowClear
                    loading={isLoadingOriginal}
                    options={originalTransactions?.data.map((t) => ({
                      value: t.id,
                      label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Link ảnh hóa đơn"
                  name="receiptImageUrl"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="https://..." maxLength={500} />
                </Form.Item>
              </Card>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Action Footer cố định ở dưới màn hình */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          padding: '12px 24px',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)',
          zIndex: 100,
        }}
      >
        <Flex justify="end" gap={12}>
          <Button onClick={handleBack}>Hủy</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Lưu Giao Dịch
          </Button>
        </Flex>
      </div>
    </div>
  )
}
