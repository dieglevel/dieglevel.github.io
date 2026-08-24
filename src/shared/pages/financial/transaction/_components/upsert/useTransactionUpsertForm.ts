import { useEffect, useMemo, useRef } from 'react'
import { Form, Grid, message } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from '@tanstack/react-router'

import type {
  UpsertFinanceTransactionDto,
  UpsertFinanceTransactionItemDto,
} from '@/shared/api/financial/transaction/transaction.mutation'
import { useMutationTransaction } from '@/shared/api/financial/transaction/transaction.mutation'
import { useGetFinance_Category_Count } from '@/shared/api/financial/category/useGetFinance_Category_Count'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useGetFinance_Transaction_View } from '@/shared/api/financial/transaction/useGetFinance_Transaction_View'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { useBreakpoint } = Grid

export interface TransactionUpsertFormValues extends UpsertFinanceTransactionDto {
  toWalletId?: number
}

interface UseTransactionUpsertFormProps {
  mode: 'create' | 'update'
  transactionId?: number
}

export function useTransactionUpsertForm({
  mode,
  transactionId,
}: UseTransactionUpsertFormProps) {
  const isUpdateMode = mode === 'update' && Number.isFinite(transactionId)

  const screens = useBreakpoint()
  const isMobile = !screens.sm
  const [form] = Form.useForm<TransactionUpsertFormValues>()
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

  const selectedType =
    Form.useWatch('type', form) || FINANCIAL_TRANSACTION_TYPE.INCOME
  const selectedWalletId = Form.useWatch('walletId', form)
  const selectedToWalletId = Form.useWatch('toWalletId', form)
  const selectedOriginalId = Form.useWatch('originalTransactionId', form)
  const directAmount = Form.useWatch('amount', form)
  const transferFee = Form.useWatch('transferFee', form) || 0
  const items = Form.useWatch('financialTransactionItems', form) || []

  // Tìm giao dịch gốc khi tạo Hoàn tiền
  const selectedOriginalTx = useMemo(
    () => originalTransactions?.data.find((t) => t.id === selectedOriginalId),
    [originalTransactions?.data, selectedOriginalId],
  )

  // Tùy biến giao diện Banner theo loại giao dịch
  const bannerStyle = useMemo(() => {
    switch (selectedType) {
      case FINANCIAL_TRANSACTION_TYPE.INCOME:
      case FINANCIAL_TRANSACTION_TYPE.REFUND:
        return { bg: '#f6ffed', border: '#b7eb8f', color: '#52c41a' }
      case FINANCIAL_TRANSACTION_TYPE.EXPENSE:
        return { bg: '#fff2f0', border: '#ffccc7', color: '#ff4d4f' }
      default:
        return { bg: '#e6f7ff', border: '#91caff', color: '#1677ff' }
    }
  }, [selectedType])

  // Lọc danh mục theo loại giao dịch
  const filteredCategories = useMemo(() => {
    if (!categories?.data) return []
    return categories.data.filter(
      (cat: any) => !cat.type || cat.type === selectedType,
    )
  }, [categories?.data, selectedType])

  // Tính tổng số tiền từ danh sách hạng mục
  const calculatedTotalAmount = useMemo(
    () =>
      items.reduce(
        (sum: number, item: { amount?: number }) =>
          sum + (Number(item.amount) || 0),
        0,
      ),
    [items],
  )

  const prevLengthRef = useRef(items.length)
  const prevTypeRef = useRef(selectedType)

  // Xử lý tự động cập nhật Description
  useEffect(() => {
    if (selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER) {
      const fromWallet = wallets?.data.find((w) => w.id === selectedWalletId)
      const toWallet = wallets?.data.find((w) => w.id === selectedToWalletId)

      const fromName = fromWallet?.name || 'Ví A'
      const toName = toWallet?.name || 'Ví B'

      form.setFieldValue('description', `Chuyển tiền ${fromName} -> ${toName}`)
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

      form.setFieldValue(
        'description',
        `Điều chỉnh số dư cho ví${walletName} | ${convertCurrency(currentBalance)} -> ${convertCurrency(newBalance)}`,
      )
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

  // Xử lý Amount cho các loại giao dịch thông thường
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
    if (isUpdateMode) return

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

  // Giá trị khởi tạo cho chế độ chỉnh sửa
  useEffect(() => {
    if (!isUpdateMode || !transactionDetail?.data) return

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

      const mapItems = (
        list?: Array<{
          description?: string
          amount?: number
          categoryId?: number | null
        }>,
      ): Array<UpsertFinanceTransactionItemDto> =>
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
              handleBack()
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
            handleBack()
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

  // Xác định số tiền hiển thị trên Banner
  const displayAmount =
    selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT ||
    selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
      ? (Number(directAmount) || 0) +
        (selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER
          ? Number(transferFee)
          : 0)
      : calculatedTotalAmount

  const isSubmitting = isUpdateMode
    ? mTransaction_Update.isPending
    : mTransaction_Create.isPending

  return {
    form,
    isUpdateMode,
    isMobile,
    selectedType,
    selectedWalletId,
    selectedOriginalTx,
    bannerStyle,
    filteredCategories,
    displayAmount,
    wallets,
    isLoadingWallets,
    originalTransactions,
    isLoadingOriginal,
    isLoadingDetail,
    isSubmitting,
    handleSelectOriginalTransaction,
    handleBack,
    handleSave,
  }
}
