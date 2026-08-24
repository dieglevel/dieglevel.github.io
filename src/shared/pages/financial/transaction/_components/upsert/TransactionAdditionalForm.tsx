import React from 'react'
import { Card, Form, Input, Select } from 'antd'
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
  return (
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
        <Input placeholder="Công ty, Shopee, Starbucks..." maxLength={255} />
      </Form.Item>

      <Form.Item label="Địa điểm (location)" name="location">
        <Input placeholder="Hà Nội, TP.HCM..." maxLength={255} />
      </Form.Item>

      {selectedType !== FINANCIAL_TRANSACTION_TYPE.REFUND && (
        <Form.Item label="Giao dịch gốc (nếu có)" name="originalTransactionId">
          <Select
            placeholder="Chọn giao dịch gốc"
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
        label="Link ảnh hóa đơn"
        name="receiptImageUrl"
        style={{ marginBottom: 0 }}
      >
        <Input placeholder="https://..." maxLength={500} />
      </Form.Item>
    </Card>
  )
}
