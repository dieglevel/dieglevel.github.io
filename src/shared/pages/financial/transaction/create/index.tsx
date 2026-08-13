import React, { useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Row,
  Segmented,
  Select,
  Space,
  TreeSelect,
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

import type {
  CreateFinanceTransactionDto,
  CreateFinanceTransactionItemDto,
} from '@/shared/api/financial/transaction/transaction.mutation'
import { useMutationTransaction } from '@/shared/api/financial/transaction/transaction.mutation'
import { useGetFinance_Category_Count } from '@/shared/api/financial/category/useGetFinance_Category_Count'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'
import { InputWithComma } from '@/shared/components/input/utils'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text, Title } = Typography
const { useBreakpoint } = Grid

export const CreateTransactionPage: React.FC = () => {
  const screens = useBreakpoint()
  const isMobile = !screens.sm
  const [form] = Form.useForm<
    CreateFinanceTransactionDto & { toWalletId?: number }
  >()
  const router = useRouter()

  const { mTransaction_Create } = useMutationTransaction()

  const { data: wallets, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const { data: categories } = useGetFinance_Category_Count({})
  const { data: originalTransactions, isLoading: isLoadingOriginal } =
    useGetFinance_Transaction_List({})

  const selectedType = Form.useWatch('type', form)
  const selectedWalletId = Form.useWatch('walletId', form)
  const selectedOriginalId = Form.useWatch('originalTransactionId', form)
  const directAmount = Form.useWatch('amount', form)
  const items = Form.useWatch('financialTransactionItems', form) || []

  // Tìm giao dịch gốc khi tạo Hoàn tiền
  const selectedOriginalTx = originalTransactions?.data.find(
    (t) => t.id === selectedOriginalId,
  )

  // Tính tổng số tiền từ danh sách hạng mục
  const calculatedTotalAmount = items.reduce(
    (sum: number, item: { amount?: number }) =>
      sum + (Number(item.amount) || 0),
    0,
  )

  // Cập nhật giá trị amount khi có thay đổi ở danh sách hạng mục (trừ ADJUSTMENT)
  useEffect(() => {
    if (
      selectedType !== FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT &&
      items.length > 0
    ) {
      form.setFieldValue('amount', calculatedTotalAmount)
    }
  }, [calculatedTotalAmount, items.length, selectedType, form])

  // Giá trị khởi tạo
  useEffect(() => {
    form.setFieldsValue({
      type: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
      status: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
      date: dayjs(),
      amount: 0,
      financialTransactionItems: [
        { description: '', amount: 0, categoryId: undefined },
      ],
    })
  }, [form])

  // Xử lý khi chọn giao dịch gốc cho Hoàn tiền
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
      let payload: CreateFinanceTransactionDto

      const basePayload = {
        amount: Number(values.amount),
        status: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
        walletId: values.walletId,
        date: values.date,
        receiptImageUrl: values.receiptImageUrl,
      }

      const mapItems: (
        list?: Array<{
          description?: string
          amount?: number
          categoryId?: number | null
        }>,
      ) => Array<CreateFinanceTransactionItemDto> = (
        list?: Array<{
          description?: string
          amount?: number
          categoryId?: number | null
        }>,
      ) =>
        list?.map((item) => ({
          description: item.description ?? '',
          amount: Number(item.amount),
          categoryId: item.categoryId ?? undefined,
        })) ?? []

      switch (selectedType) {
        case FINANCIAL_TRANSACTION_TYPE.INCOME:
        case FINANCIAL_TRANSACTION_TYPE.EXPENSE:
          payload = {
            ...basePayload,
            type: selectedType,
            description: values.description,
            merchant: values.merchant,
            location: values.location,
            financialTransactionItems: mapItems(
              values.financialTransactionItems,
            ),
          }
          break

        case FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT:
          payload = {
            ...basePayload,
            type: FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT,
            description: values.description,
            merchant: values.merchant,
            location: values.location,
          }
          break

        case FINANCIAL_TRANSACTION_TYPE.REFUND:
          payload = {
            ...basePayload,
            type: FINANCIAL_TRANSACTION_TYPE.REFUND,
            originalTransactionId: values.originalTransactionId,
            description: values.description,
            merchant: values.merchant,
            location: values.location,
            financialTransactionItems: mapItems(
              values.financialTransactionItems,
            ),
          }
          break

        case FINANCIAL_TRANSACTION_TYPE.TRANSFER:
          payload = {
            ...basePayload,
            type: FINANCIAL_TRANSACTION_TYPE.TRANSFER,
            toWalletId: values.toWalletId,
            description: values.description,
            financialTransactionItems: mapItems(
              values.financialTransactionItems,
            ),
            originalTransactionId: values.originalTransactionId,
          }
          break

        default:
          payload = {
            ...basePayload,
            type: selectedType,
          }
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
      console.error('Validation error:', error)
    }
  }

  const displayAmount =
    selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
      ? Number(directAmount) || 0
      : calculatedTotalAmount

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
      {/* Header */}
      <Flex
        vertical={isMobile}
        justify={isMobile ? 'flex-start' : 'space-between'}
        align={isMobile ? 'stretch' : 'center'}
        gap={isMobile ? 12 : 0}
        style={{ marginBottom: 20 }}
      >
        <Space align="center" size={12}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
          />
          <Title
            level={isMobile ? 4 : 3}
            style={{
              margin: 0,
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              wordBreak: 'break-word',
            }}
          >
            {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
              ? 'Tạo Giao Dịch Hoàn Tiền'
              : selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
                ? 'Tạo Điều Chỉnh Số Dư'
                : 'Tạo Giao Dịch Mới'}
          </Title>
        </Space>

        <Flex justify={isMobile ? 'flex-end' : 'flex-start'} gap={8}>
          <Button onClick={handleBack}>Hủy</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Lưu Giao Dịch
          </Button>
        </Flex>
      </Flex>

      <Form form={form} layout="vertical">
        {/* Chọn loại giao dịch */}
        <Card style={{ marginBottom: 20 }}>
          <Form.Item
            name="type"
            label="Loại giao dịch"
            style={{ marginBottom: 0 }}
          >
            <Segmented
              block
              options={[
                {
                  label: 'Chi tiêu',
                  value: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
                },
                { label: 'Thu nhập', value: FINANCIAL_TRANSACTION_TYPE.INCOME },
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
        </Card>

        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI: Chi tiết khoản tiền / Hạng mục */}
          <Col xs={24} lg={14} xl={15}>
            <Card title="Chi tiết khoản tiền" style={{ height: '100%' }}>
              {/* Tổng tiền Banner */}
              <Card
                size="small"
                style={{
                  backgroundColor: '#f6ffed',
                  borderColor: '#b7eb8f',
                  marginBottom: 20,
                }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap={8}
                >
                  <Text type="secondary">
                    {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
                      ? 'Tổng tiền hoàn nhận lại:'
                      : selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
                        ? 'Số tiền điều chỉnh:'
                        : 'Tổng tiền giao dịch:'}
                  </Text>
                  <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                    {convertCurrency(displayAmount)}
                  </Title>
                </Flex>
              </Card>

              {/* Thông báo nếu là REFUND */}
              {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND &&
                selectedOriginalTx && (
                  <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={`Đang hoàn tiền cho giao dịch gốc #${selectedOriginalTx.id}`}
                    description={`Tổng giá trị ban đầu: ${convertCurrency(selectedOriginalTx.amount)}. Bạn có thể điều chỉnh số tiền hoàn cho từng khoản bên dưới.`}
                  />
                )}

              {/* Nhập số tiền trực tiếp cho ADJUSTMENT */}
              {selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT ? (
                <Form.Item
                  name="amount"
                  label="Số tiền điều chỉnh"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tiền' },
                    { type: 'number', min: 0.01, message: 'Số tiền phải > 0' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập số tiền..."
                    precision={2}
                    {...InputWithComma}
                  />
                </Form.Item>
              ) : (
                /* Form.List Hạng mục chi tiết cho EXPENSE, INCOME, REFUND, TRANSFER */
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
                      <Flex vertical gap={12} align="stretch">
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
                            <Row gutter={[12, 12]} align="top">
                              <Col xs={24} sm={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'description']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Nhập nội dung',
                                    },
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

                              <Col xs={16} sm={6}>
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
                                    precision={2}
                                    {...InputWithComma}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={20} sm={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'categoryId']}
                                  style={{ marginBottom: 0 }}
                                >
                                  <TreeSelect
                                    allowClear
                                    style={{ width: '100%' }}
                                    styles={{
                                      popup: { root: { width: 'max-content' } },
                                    }}
                                    placeholder="Danh mục"
                                    treeData={categories?.data}
                                    fieldNames={{
                                      label: 'name',
                                      value: 'id',
                                      children: 'children',
                                    }}
                                    treeTitleRender={(data) => (
                                      <Flex align="center" gap={8}>
                                        <IconRenderer
                                          iconName={data.icon}
                                          size={16}
                                          color={data.color}
                                        />
                                        <Text>{data.name}</Text>
                                      </Flex>
                                    )}
                                    treeDefaultExpandAll
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={4} sm={2} style={{ textAlign: 'right' }}>
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
                              amount: 0,
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
              )}
            </Card>
          </Col>

          {/* CỘT PHẢI: Thông tin Ví, Mô tả & Bổ sung */}
          <Col xs={24} lg={10} xl={9}>
            <Flex vertical gap={20}>
              {/* Card 1: Thông tin giao dịch & Ví */}
              <Card title="Thông tin chung">
                {/* Chọn giao dịch gốc (bắt buộc khi REFUND) */}
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

                {/* Ví chính */}
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

                {/* Ví nhận (dành riêng cho TRANSFER) */}
                {selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER && (
                  <Form.Item
                    label="Ví nhận tiền"
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

                {/* Mô tả */}
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

                {/* Ngày & Trạng thái */}
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
                        disabled
                        options={[
                          {
                            value: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
                            label: 'Hoàn tất',
                          },
                          {
                            value: FINANCIAL_TRANSACTION_STATUS.PENDING,
                            label: 'Chờ xử lý',
                          },
                          {
                            value: FINANCIAL_TRANSACTION_STATUS.FAILED,
                            label: 'Thất bại',
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
            </Flex>
          </Col>
        </Row>
      </Form>

      {/* Fixed Footer Bar */}
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
