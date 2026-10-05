import React from 'react'
import {
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'
import { useTranslation } from 'react-i18next'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'

const { Text } = Typography

interface TransactionGeneralFormProps {
  selectedType: FINANCIAL_TRANSACTION_TYPE
  selectedWalletId?: number
  wallets?: Array<IFinance_Wallet>
  isLoadingWallets?: boolean
  originalTransactions?: Array<IFinance_Transaction>
  isLoadingOriginal?: boolean
  onSelectOriginalTransaction: (txId: number) => void
}

export const TransactionGeneralForm: React.FC<TransactionGeneralFormProps> = ({
  selectedType,
  selectedWalletId,
  wallets,
  isLoadingWallets,
  originalTransactions,
  isLoadingOriginal,
  onSelectOriginalTransaction,
}) => {
  const { t } = useTranslation('finance')
  const getWalletLabel = () => {
    switch (selectedType) {
      case FINANCIAL_TRANSACTION_TYPE.TRANSFER:
        return t('wallet.from')
      case FINANCIAL_TRANSACTION_TYPE.REFUND:
      case FINANCIAL_TRANSACTION_TYPE.INCOME:
        return t('wallet.to')
      default:
        return t('common.wallet')
    }
  }

  const walletOptions = wallets?.map((w) => ({
    value: w.id,
    label: (
      <Flex align="center" gap={8}>
        <IconRenderer iconName={w.icon} />
        <Text style={{ fontSize: 13 }}>{w.name}</Text>
      </Flex>
    ),
  }))

  return (
    <Card title={t('common.description')}>
      {/* Chọn giao dịch gốc (bắt buộc khi REFUND) */}
      {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND && (
        <Form.Item
          label={t('transaction.detail')}
          name="originalTransactionId"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn giao dịch gốc',
            },
          ]}
        >
          <Select
            placeholder={t('transaction.detail')}
            allowClear
            loading={isLoadingOriginal}
            onChange={onSelectOriginalTransaction}
            options={originalTransactions
              ?.filter((t) => t.type === FINANCIAL_TRANSACTION_TYPE.EXPENSE)
              .map((t) => ({
                value: t.id,
                label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
              }))}
          />
        </Form.Item>
      )}

      {/* Ví chính */}
      <Form.Item
        label={getWalletLabel()}
        name="walletId"
        rules={[{ required: true, message: 'Vui lòng chọn ví' }]}
      >
        <Select
          placeholder={t('common.wallet')}
          loading={isLoadingWallets}
          options={walletOptions}
        />
      </Form.Item>

      {/* Ví nhận (dành riêng cho TRANSFER) */}
      {selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER && (
        <Form.Item
          label={t('wallet.to')}
          name="toWalletId"
          rules={[
            { required: true, message: 'Vui lòng chọn ví nhận' },
            {
              validator: async (_, value) => {
                if (value && value === selectedWalletId) {
                  return Promise.reject(
                    new Error('Ví nhận không được trùng với ví chuyển đi'),
                  )
                }
              },
            },
          ]}
        >
          <Select
            placeholder={t('wallet.to')}
            loading={isLoadingWallets}
            options={wallets?.map((w) => ({
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
        label={t('common.description')}
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
          disabled={selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT}
          placeholder={t('common.description')}
          maxLength={255}
        />
      </Form.Item>

      {/* Ngày & Trạng thái */}
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={t('common.date')}
            name="date"
            rules={[{ required: true, message: 'Chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('common.status')}
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
  )
}
