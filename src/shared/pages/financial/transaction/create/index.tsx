import React, { useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Segmented,
  Select,
  Space,
  Typography,
  message,
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useRouter } from '@tanstack/react-router'

import Income from './_components/Income'
import type { CreateFinanceTransactionDto } from '@/shared/api/financial/transaction/transaction.mutation'
import { useMutationTransaction } from '@/shared/api/financial/transaction/transaction.mutation'
import { useGetFinance_Category_Count } from '@/shared/api/financial/category/useGetFinance_Category_Count'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'

const { Text, Title } = Typography

export const CreateTransactionPage: React.FC = () => {
  const [form] = Form.useForm<CreateFinanceTransactionDto>()
  const router = useRouter()

  const { mTransaction_Create } = useMutationTransaction()

  const { data: wallets, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const { data: categories, isLoading: isLoadingCategories } =
    useGetFinance_Category_Count({})
  const { data: originalTransactions, isLoading: isLoadingOriginal } =
    useGetFinance_Transaction_List({})

  const selectedType = Form.useWatch('type', form)
  const selectedWalletId = Form.useWatch('walletId', form)
  const selectedOriginalId = Form.useWatch('originalTransactionId', form)
  const items = Form.useWatch('financialTransactionItems', form) || []

  // Tìm thông tin giao dịch gốc được chọn
  const selectedOriginalTx = originalTransactions?.data.find(
    (t) => t.id === selectedOriginalId,
  )

  const calculatedTotalAmount = items.reduce(
    (sum: number, item: { amount?: number }) =>
      sum + (Number(item.amount) || 0),
    0,
  )

  useEffect(() => {
    if (items.length > 0) {
      form.setFieldValue('amount', calculatedTotalAmount)
    }
  }, [calculatedTotalAmount, items.length, form])

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

  // Xử lý khi chọn giao dịch gốc trong chế độ Hoàn tiền
  const handleSelectOriginalTransaction = (txId: number) => {
    const tx = originalTransactions?.data.find((t) => t.id === txId)
    if (!tx) return

    form.setFieldsValue({
      description: `Hoàn tiền: ${tx.description ?? ''}`,
      merchant: tx.merchant || '',
      location: tx.location || '',
      walletId: tx.walletId,
      amount: tx.amount,
      financialTransactionItems: tx.financialTransactionItems?.length
        ? tx.financialTransactionItems.map((item) => ({
            description: item.description,
            amount: item.amount,
            categoryId: item.categoryId,
          }))
        : [
            {
              description: tx.description ?? undefined,
              amount: tx.amount,
              categoryId: undefined,
            },
          ],
    })
  }

  const handleBack = () => {
    router.navigate({ to: '/financial/transaction' })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      const payload: CreateFinanceTransactionDto = {
        description: values.description,
        merchant: values.merchant || '',
        location: values.location || '',
        amount: Number(values.amount),
        type: values.type,
        status: values.status,
        walletId: values.walletId,
        toWalletId:
          values.type === FINANCIAL_TRANSACTION_TYPE.TRANSFER
            ? values.toWalletId
            : undefined,
        date: dayjs(values.date),
        originalTransactionId:
          values.type === FINANCIAL_TRANSACTION_TYPE.REFUND
            ? values.originalTransactionId
            : values.originalTransactionId || undefined,
        receiptImageUrl: values.receiptImageUrl || '',
        financialTransactionItems: values.financialTransactionItems?.map(
          (item) => ({
            description: item.description,
            amount: Number(item.amount),
            categoryId: item.categoryId,
          }),
        ),
      }

      mTransaction_Create.mutate(
        { body: payload },
        {
          onSuccess: () => {
            message.success('Giao dịch đã được tạo thành công!')
            router.navigate({ to: '/financial/transaction' })
          },
          onError: (error) => {
            console.error('API error:', error)
            message.error('Có lỗi xảy ra khi tạo giao dịch.')
          },
        },
      )
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
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Space align="center" size={12}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
          />
          <Title level={3} style={{ margin: 0 }}>
            {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
              ? 'Tạo Giao Dịch Hoàn Tiền'
              : 'Tạo Giao Dịch Mới'}
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
        <Form.Item name="type" label="Loại giao dịch">
          <Segmented
            block
            options={[
              {
                label: 'Chi tiêu',
                value: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
              },
              {
                label: 'Thu nhập',
                value: FINANCIAL_TRANSACTION_TYPE.INCOME,
              },
              {
                label: 'Hoàn tiền',
                value: FINANCIAL_TRANSACTION_TYPE.REFUND,
              },
              {
                label: 'Điều chỉnh',
                value: FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT,
              },
              {
                label: 'Chuyển tiền',
                value: FINANCIAL_TRANSACTION_TYPE.TRANSFER,
              },
            ]}
          />
        </Form.Item>
        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI */}
          <Col xs={24} lg={15} xl={8}>
            <Income
              categories={categories?.data}
              isLoadingCategories={isLoadingCategories}
              selectedType={selectedType}
              calculatedTotalAmount={calculatedTotalAmount}
              selectedOriginalTx={selectedOriginalTx}
            />
          </Col>

          {/* CỘT PHẢI */}
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
              <Card title="Thông tin chung">
                {/* Chọn giao dịch gốc (bắt buộc khi chọn REFUND) */}
                {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND && (
                  <Form.Item
                    label="Giao dịch gốc cần hoàn"
                    name="originalTransactionId"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn giao dịch gốc',
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn giao dịch gốc"
                      allowClear
                      loading={isLoadingOriginal}
                      onChange={handleSelectOriginalTransaction}
                      options={originalTransactions?.data
                        .filter(
                          (t) => t.type === FINANCIAL_TRANSACTION_TYPE.EXPENSE,
                        )
                        .map((t) => ({
                          value: t.id,
                          label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
                        }))}
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label={
                    selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
                      ? 'Ví chuyển đi'
                      : selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
                        ? 'Ví nhận tiền hoàn'
                        : 'Ví thanh toán'
                  }
                  name="walletId"
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

                {selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER && (
                  <Form.Item
                    label="Ví nhận tiền (toWalletId)"
                    name="toWalletId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ví nhận' },
                      {
                        validator: async (_, value) => {
                          if (value && value === selectedWalletId) {
                            return Promise.reject(
                              new Error(
                                'Ví nhận không được trùng với ví chuyển đi',
                              ),
                            )
                          }
                        },
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn ví nhận tiền"
                      loading={isLoadingWallets}
                      options={wallets?.data.map((w) => ({
                        value: w.id,
                        disabled: w.id === selectedWalletId,
                        label: (
                          <Flex align="center" gap={8}>
                            <IconRenderer iconName={w.icon} />
                            <Text style={{ fontSize: 13 }}>{w.name}</Text>
                          </Flex>
                        ),
                      }))}
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label="Mô tả giao dịch"
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
                            value: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
                            label: '✅ COMPLETED',
                          },
                          {
                            value: FINANCIAL_TRANSACTION_STATUS.PENDING,
                            label: '⏳ PENDING',
                          },
                          {
                            value: FINANCIAL_TRANSACTION_STATUS.FAILED,
                            label: '❌ FAILED',
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col xs={24} lg={9} xl={8}>
            <Card title="Thông tin bổ sung">
              <Form.Item label="Đơn vị / Cửa hàng (merchant)" name="merchant">
                <Input placeholder="Shopee, Starbucks..." maxLength={255} />
              </Form.Item>

              <Form.Item label="Địa điểm (location)" name="location">
                <Input placeholder="Hà Nội, TP.HCM..." maxLength={255} />
              </Form.Item>

              {selectedType !== FINANCIAL_TRANSACTION_TYPE.REFUND && (
                <Form.Item
                  label="Giao dịch gốc (nếu có)"
                  name="originalTransactionId"
                >
                  <Select
                    placeholder="Chọn giao dịch gốc"
                    allowClear
                    loading={isLoadingOriginal}
                    options={originalTransactions?.data.map((t) => ({
                      value: t.id,
                      label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
                    }))}
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Link ảnh hóa đơn"
                name="receiptImageUrl"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="https://..." maxLength={500} />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>

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
