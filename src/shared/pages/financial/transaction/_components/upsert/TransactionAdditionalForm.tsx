import React from 'react'
import { Card, Form, Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'

interface TransactionAdditionalFormProps {
  selectedType: FINANCIAL_TRANSACTION_TYPE
  originalTransactions?: Array<IFinance_Transaction>
  isLoadingOriginal?: boolean
}

export const TransactionAdditionalForm: React.FC<
  TransactionAdditionalFormProps
> = ({ selectedType, originalTransactions, isLoadingOriginal }) => {
  const { t } = useTranslation('finance')
  return (
    <Card
      title={t('common.description')}
      style={{
        display:
          selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
            ? 'none'
            : 'block',
      }}
    >
      <Form.Item label={t('common.description')} name="merchant">
        <Input placeholder="Công ty, Shopee, Starbucks..." maxLength={255} />
      </Form.Item>

      <Form.Item label={t('common.description')} name="location">
        <Input placeholder="Hà Nội, TP.HCM..." maxLength={255} />
      </Form.Item>

      {selectedType !== FINANCIAL_TRANSACTION_TYPE.REFUND && (
        <Form.Item label={t('transaction.detail')} name="originalTransactionId">
          <Select
            placeholder={t('transaction.detail')}
            allowClear
            loading={isLoadingOriginal}
            options={originalTransactions?.map((t) => ({
              value: t.id,
              label: `#${t.id} - ${t.description} (${t.amount.toLocaleString('vi-VN')} đ)`,
            }))}
          />
        </Form.Item>
      )}

      <Form.Item
        label={t('common.description')}
        name="receiptImageUrl"
        style={{ marginBottom: 0 }}
      >
        <Input placeholder="https://..." maxLength={500} />
      </Form.Item>
    </Card>
  )
}
