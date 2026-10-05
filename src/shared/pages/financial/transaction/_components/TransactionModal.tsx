import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  Typography,
  message,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { useGetFinance_Category_List } from '@/shared/api/financial/category/useGetFinance_Category_List'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
  FinancialTransactionTypeHelper,
} from '@/shared/api/financial/transaction/transaction.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { InputWithComma } from '@/shared/components/input/utils'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import BaseModal from '@/shared/components/modal'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'

const { Text, Title } = Typography

interface TransactionModalProps {
  open: boolean
  onClose: () => void
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation('finance')
  const [form] = Form.useForm()

  // API Danh sách Ví & Danh mục
  const { data: wallets, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({
      options: { enabled: open },
    })

  const { data: categories, isLoading: isLoadingCategories } =
    useGetFinance_Category_List({
      options: { enabled: open },
    })

  // API Danh sách Giao dịch gốc
  const { data: originalTransactions, isLoading: isLoadingOriginal } =
    useGetFinance_Transaction_List({
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
        status: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
        date: dayjs(),
        financialAdvanceTransactions: [
          { description: '', amount: null, categoryId: undefined },
        ],
      })
    }
  }, [open, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      message.success(t('common.create'))
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation/API error:', error)
    }
  }

  return (
    <BaseModal
      title={t('transaction.advancedCreate')}
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      destroyOnHidden
      width={720}
      style={{ top: 20 }}
      styles={{
        body: {
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: 8,
        },
      }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* 1. Phân loại giao dịch (type) */}
        <Form.Item name="type">
          <Segmented
            block
            options={FinancialTransactionTypeHelper.getOptions()}
          />
        </Form.Item>

        {/* 2. Wallet select */}
        <Form.Item
          label={t('transaction.walletPayment')}
          name="walletId"
          rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
        >
          <Select
            placeholder={t('transaction.selectWallet')}
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

        {/* 3. Mô tả chung (description) */}
        <Form.Item
          label={t('transaction.transactionDescription')}
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả' },
            { whitespace: true, message: 'Không được chỉ nhập khoảng trắng' },
          ]}
        >
          <Input
            placeholder="Mô tả tổng quan nội dung giao dịch..."
            maxLength={255}
          />
        </Form.Item>

        {/* 4. Merchant & Location */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t('transaction.merchant')}
              name="merchant"
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Shopee, Starbucks..." maxLength={255} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t('transaction.location')}
              name="location"
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Hà Nội, TP.HCM..." maxLength={255} />
            </Form.Item>
          </Col>
        </Row>

        {/* 5. Giao dịch gốc (originalTransactionId) */}
        <Form.Item
          label={t('transaction.originalRefund')}
          name="originalTransactionId"
          style={{ marginTop: 16 }}
        >
          <Select
            placeholder={t('transaction.selectOriginal')}
            allowClear
            loading={isLoadingOriginal}
            options={originalTransactions?.data.data.map((t) => ({
              value: t.id,
              label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
            }))}
          />
        </Form.Item>

        {/* 6. Chi tiết các khoản tạm ứng (financialAdvanceTransactions) */}
        <Form.Item
          label={t('transaction.details')}
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
                    styles={{ body: { padding: 12 } }}
                  >
                    <Row gutter={[8, 8]} align="middle">
                      {/* Nội dung khoản chi tiết */}
                      <Col xs={24} md={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          rules={[
                            { required: true, message: 'Nhập nội dung' },
                            { whitespace: true, message: 'Không để trống' },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder={t('transaction.itemDescription')} />
                        </Form.Item>
                      </Col>

                      {/* Chọn Danh mục riêng cho từng dòng */}
                      <Col xs={24} sm={12} md={6}>
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
                                  <Text style={{ fontSize: 12 }}>{c.name}</Text>
                                </Flex>
                              ),
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      {/* Số tiền */}
                      <Col xs={20} sm={10} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          rules={[
                            { required: true, message: 'Nhập số tiền' },
                            { type: 'number', min: 0.01, message: 'Phải > 0' },
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
                      <Col xs={4} sm={2} md={2} style={{ textAlign: 'right' }}>
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
          <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
            <Text type="secondary">Tổng tiền giao dịch (amount):</Text>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              {calculatedTotalAmount.toLocaleString('vi-VN')} đ
            </Title>
          </Flex>
        </Card>

        {/* 8. Tags & Receipt Image */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item
                          label={t('transaction.tags')}
              name="tags"
              style={{ marginBottom: 0 }}
            >
              <Select
                mode="tags"
                placeholder="Nhập tag và bấm Enter..."
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t('transaction.receipt')}
              name="receiptImageUrl"
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="https://..." maxLength={500} />
            </Form.Item>
          </Col>
        </Row>

        {/* 9. Ngày & Trạng thái (status) */}
        <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t('transaction.performedAt')}
              name="date"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Trạng thái (status)"
              name="status"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                options={[
                  {
                    value: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
                    label: '✅ COMPLETED (Hoàn thành)',
                  },
                  {
                    value: FINANCIAL_TRANSACTION_STATUS.PENDING,
                    label: '⏳ PENDING (Đang chờ)',
                  },
                  {
                    value: FINANCIAL_TRANSACTION_STATUS.FAILED,
                    label: '❌ FAILED (Thất bại)',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseModal>
  )
}
