import React, { useEffect, useMemo, useRef } from 'react'
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
  Spin,
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
  UpsertFinanceTransactionDto,
  UpsertFinanceTransactionItemDto,
} from '@/shared/api/financial/transaction/transaction.mutation'
import { useMutationTransaction } from '@/shared/api/financial/transaction/transaction.mutation'
import { useGetFinance_Category_Count } from '@/shared/api/financial/category/useGetFinance_Category_Count'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useGetFinance_Transaction_View } from '@/shared/api/financial/transaction/useGetFinance_Transaction_View'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'
import { InputWithComma } from '@/shared/components/input/utils'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text, Title } = Typography
const { useBreakpoint } = Grid

interface TransactionUpsertPageProps {
  mode: 'create' | 'update'
  transactionId?: number
}

export const TransactionUpsertPage: React.FC<TransactionUpsertPageProps> = ({
  mode,
  transactionId,
}) => {
  const isUpdateMode = mode === 'update' && Number.isFinite(transactionId)

  const screens = useBreakpoint()
  const isMobile = !screens.sm
  const [form] = Form.useForm<
    UpsertFinanceTransactionDto & { toWalletId?: number }
  >()
  const router = useRouter()

  const { mTransaction_Create, mTransaction_Update } = useMutationTransaction()

  const { data: transactionDetail, isLoading: isLoadingDetail } =
    useGetFinance_Transaction_View({
      pathParams: { id: transactionId ?? 0 },
      options: { enabled: isUpdateMode },
    })

  const { data: wallets, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const { data: categories } = useGetFinance_Category_Count({})
  const { data: originalTransactions, isLoading: isLoadingOriginal } =
    useGetFinance_Transaction_List({})

  const selectedType = Form.useWatch('type', form)
  const selectedWalletId = Form.useWatch('walletId', form)
  const selectedToWalletId = Form.useWatch('toWalletId', form)
  const selectedOriginalId = Form.useWatch('originalTransactionId', form)
  const directAmount = Form.useWatch('amount', form)
  const transferFee = Form.useWatch('transferFee', form) || 0
  const items = Form.useWatch('financialTransactionItems', form) || []

  // Tìm giao dịch gốc khi tạo Hoàn tiền
  const selectedOriginalTx = originalTransactions?.data.find(
    (t) => t.id === selectedOriginalId,
  )

  // Tùy biến giao diện Banner theo loại giao dịch
  const bannerStyle = useMemo(() => {
    switch (selectedType) {
      case FINANCIAL_TRANSACTION_TYPE.INCOME:
      case FINANCIAL_TRANSACTION_TYPE.REFUND:
        return { bg: '#f6ffed', border: '#b7eb8f', color: '#52c41a' } // Xanh lá
      case FINANCIAL_TRANSACTION_TYPE.EXPENSE:
        return { bg: '#fff2f0', border: '#ffccc7', color: '#ff4d4f' } // Đỏ
      default:
        return { bg: '#e6f7ff', border: '#91caff', color: '#1677ff' } // Xanh dương
    }
  }, [selectedType])

  // Lọc danh mục theo loại giao dịch (nếu API category hỗ trợ thuộc tính type)
  const filteredCategories = useMemo(() => {
    if (!categories?.data) return []
    return categories.data.filter(
      (cat: any) => !cat.type || cat.type === selectedType,
    )
  }, [categories?.data, selectedType])

  // Tính tổng số tiền từ danh sách hạng mục
  const calculatedTotalAmount = items.reduce(
    (sum: number, item: { amount?: number }) =>
      sum + (Number(item.amount) || 0),
    0,
  )

  const prevLengthRef = useRef(items.length)
  const prevTypeRef = useRef(selectedType)

  // 1. Xử lý tự động cập nhật Description
  useEffect(() => {
    if (selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER) {
      const fromWallet = wallets?.data.find((w) => w.id === selectedWalletId)
      const toWallet = wallets?.data.find((w) => w.id === selectedToWalletId)

      const fromName = fromWallet?.name || 'Ví A'
      const toName = toWallet?.name || 'Ví B'

      const transferDesc = `Chuyển tiền ${fromName} -> ${toName}`
      form.setFieldValue('description', transferDesc)

      prevTypeRef.current = selectedType
      return
    }

    if (selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT) {
      const selectedWallet = wallets?.data.find(
        (w) => w.id === selectedWalletId,
      )
      const walletName = selectedWallet?.name ? ` (${selectedWallet.name})` : ''
      const currentBalance = selectedWallet?.balance || 0
      const newBalance = currentBalance + (directAmount || 0)

      const adjustmentDesc = `Điều chỉnh số dư cho ví${walletName} | ${convertCurrency(currentBalance)} -> ${convertCurrency(newBalance)}`

      form.setFieldValue('description', adjustmentDesc)
      prevTypeRef.current = selectedType
      return
    }

    if (
      prevTypeRef.current === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT ||
      prevTypeRef.current === FINANCIAL_TRANSACTION_TYPE.TRANSFER
    ) {
      form.setFieldValue('description', '')
      prevTypeRef.current = selectedType
    }

    const prevLength = prevLengthRef.current
    const currentLength = items.length

    if (currentLength === 1) {
      form.setFieldValue('description', items[0]?.description ?? '')
    } else if (prevLength === 1 && currentLength > 1) {
      form.setFieldValue('description', '')
    }

    prevLengthRef.current = currentLength
  }, [
    selectedType,
    selectedWalletId,
    selectedToWalletId,
    wallets?.data,
    directAmount,
    items,
    form,
  ])

  // 2. Xử lý Amount cho các loại giao dịch thông thường
  useEffect(() => {
    if (
      selectedType !== FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT &&
      selectedType !== FINANCIAL_TRANSACTION_TYPE.TRANSFER &&
      items.length > 0
    ) {
      form.setFieldValue('amount', calculatedTotalAmount)
    }
  }, [calculatedTotalAmount, items.length, selectedType, form])

  // Giá trị khởi tạo cho chế độ tạo mới
  useEffect(() => {
    if (isUpdateMode) {
      return
    }

    form.setFieldsValue({
      type: FINANCIAL_TRANSACTION_TYPE.INCOME,
      status: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
      date: dayjs(),
      amount: 0,
      transferFee: 0,
      financialTransactionItems: [
        { description: '', amount: 0, categoryId: undefined },
      ],
    })
  }, [form, isUpdateMode])

  useEffect(() => {
    if (!isUpdateMode || !transactionDetail?.data) {
      return
    }

    const detail = transactionDetail.data
    form.setFieldsValue({
      type: detail.type,
      status: detail.status,
      date: detail.createdAt ? dayjs(detail.createdAt) : dayjs(),
      walletId: detail.wallet?.id,
      amount: detail.amount,
      description: detail.description ?? '',
      merchant: detail.merchant ?? '',
      location: detail.location ?? '',
      receiptImageUrl: detail.receiptImageUrl ?? '',
      originalTransactionId: detail.originalTransactionId,
      financialTransactionItems:
        detail.financialTransactionItems &&
        detail.financialTransactionItems.length > 0
          ? detail.financialTransactionItems.map((item) => ({
              description: item.description,
              amount: item.amount,
              categoryId: item.category?.id ?? item.categoryId,
            }))
          : [{ description: '', amount: 0, categoryId: undefined }],
    })
  }, [form, isUpdateMode, transactionDetail])

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
      let payload: UpsertFinanceTransactionDto

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
      ) => Array<UpsertFinanceTransactionItemDto> = (
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
            transferFee: Number(values.transferFee || 0),
            description: values.description,
            originalTransactionId: values.originalTransactionId,
          }
          break

        default:
          payload = {
            ...basePayload,
            type: selectedType,
          }
      }

      if (isUpdateMode && transactionId) {
        mTransaction_Update.mutate(
          {
            pathParams: { id: String(transactionId) },
            body: payload,
          },
          {
            onSuccess: () => {
              message.success('Cập nhật giao dịch thành công!')
              router.navigate({ to: '/financial/transaction' })
            },
            onError: (error) => {
              console.error('API error:', error)
              message.error('Có lỗi xảy ra khi cập nhật giao dịch.')
            },
          },
        )
        return
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

  if (isUpdateMode && isLoadingDetail) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
        <Spin size="large" tip="Đang tải thông tin giao dịch..." />
      </Flex>
    )
  }

  // Xác định số tiền hiển thị trên Banner
  const displayAmount =
    selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT ||
    selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
      ? (Number(directAmount) || 0) +
        (selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
          ? Number(transferFee)
          : 0)
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
            {isUpdateMode
              ? `Chỉnh Sửa Giao Dịch #${transactionId}`
              : selectedType === FINANCIAL_TRANSACTION_TYPE.INCOME
                ? 'Tạo Giao Dịch Thu Nhập'
                : selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
                  ? 'Tạo Giao Dịch Hoàn Tiền'
                  : selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
                    ? 'Tạo Điều Chỉnh Số Dư'
                    : selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
                      ? 'Tạo Giao Dịch Chuyển Tiền'
                      : 'Tạo Giao Dịch Chi Tiêu'}
          </Title>
        </Space>

        <Flex justify={isMobile ? 'flex-end' : 'flex-start'} gap={8}>
          <Button onClick={handleBack}>Hủy</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={
              isUpdateMode
                ? mTransaction_Update.isPending
                : mTransaction_Create.isPending
            }
          >
            {isUpdateMode ? 'Cập Nhật Giao Dịch' : 'Lưu Giao Dịch'}
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
                { label: 'Thu nhập', value: FINANCIAL_TRANSACTION_TYPE.INCOME },
                {
                  label: 'Chi tiêu',
                  value: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
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
        </Card>

        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI: Chi tiết khoản tiền */}
          <Col xs={24} lg={14} xl={15}>
            <Card title="Chi tiết khoản tiền" style={{ height: '100%' }}>
              {/* Banner Tổng tiền */}
              <Card
                size="small"
                style={{
                  backgroundColor: bannerStyle.bg,
                  borderColor: bannerStyle.border,
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
                    {selectedType === FINANCIAL_TRANSACTION_TYPE.INCOME
                      ? 'Tổng khoản thu nhập:'
                      : selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
                        ? 'Tổng tiền hoàn nhận lại:'
                        : selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
                          ? 'Số tiền điều chỉnh:'
                          : selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
                            ? 'Tổng số tiền trừ ví nguồn (Gồm phí):'
                            : 'Tổng tiền chi tiêu:'}
                  </Text>
                  <Title
                    level={3}
                    style={{ margin: 0, color: bannerStyle.color }}
                  >
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

              {/* Nhập số tiền trực tiếp cho ADJUSTMENT hoặc TRANSFER */}
              {selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT ||
              selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER ? (
                <>
                  <Form.Item
                    name="amount"
                    label={
                      selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
                        ? 'Số tiền chuyển'
                        : 'Số tiền điều chỉnh'
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập số tiền' },
                      {
                        type: 'number',
                        min: 0.01,
                        message: 'Số tiền phải lớn hơn 0',
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

                  {selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER && (
                    <Form.Item
                      name="transferFee"
                      label="Phí chuyển tiền (nếu có)"
                      rules={[
                        {
                          type: 'number',
                          min: 0,
                          message: 'Phí chuyển tiền không thể âm',
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập phí chuyển tiền..."
                        precision={2}
                        {...InputWithComma}
                      />
                    </Form.Item>
                  )}
                </>
              ) : (
                /* Form.List Hạng mục chi tiết cho EXPENSE, INCOME, REFUND */
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
                                      popup: {
                                        root: {
                                          minWidth: 'max-content',
                                        },
                                      },
                                    }}
                                    placeholder="Danh mục"
                                    treeData={filteredCategories}
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

          {/* CỘT PHẢI: Thông tin Ví & Mô tả */}
          <Col xs={24} lg={10} xl={9}>
            <Flex vertical gap={20}>
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
                      : selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND ||
                          selectedType === FINANCIAL_TRANSACTION_TYPE.INCOME
                        ? 'Ví nhận tiền'
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

                {/* Mô tả tổng quan */}
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
                  <Input
                    disabled={
                      selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
                    }
                    placeholder="Mô tả tổng quan..."
                    maxLength={255}
                  />
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

              {/* Thông tin bổ sung */}
              <Card
                title="Thông tin bổ sung"
                style={{
                  display:
                    selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
                      ? 'none'
                      : 'block',
                }}
              >
                <Form.Item label="Đơn vị / Cửa hàng (merchant)" name="merchant">
                  <Input
                    placeholder="Công ty, Shopee, Starbucks..."
                    maxLength={255}
                  />
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
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={
              isUpdateMode
                ? mTransaction_Update.isPending
                : mTransaction_Create.isPending
            }
          >
            {isUpdateMode ? 'Cập Nhật Giao Dịch' : 'Lưu Giao Dịch'}
          </Button>
        </Flex>
      </div>
    </div>
  )
}
