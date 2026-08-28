import React from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Form,
  InputNumber,
  Row,
  Segmented,
  Spin,
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import { useTransactionUpsertForm } from './upsert/useTransactionUpsertForm'
import { TransactionUpsertHeader } from './upsert/TransactionUpsertHeader'
import { TransactionUpsertBanner } from './upsert/TransactionUpsertBanner'
import { TransactionItemsFormList } from './upsert/TransactionItemsFormList'
import { TransactionGeneralForm } from './upsert/TransactionGeneralForm'
import { TransactionAdditionalForm } from './upsert/TransactionAdditionalForm'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { InputWithComma } from '@/shared/components/input/utils'
import {
  FINANCIAL_TRANSACTION_TYPE,
  FinancialTransactionTypeHelper,
} from '@/shared/api/financial/transaction/transaction.enum'

interface TransactionUpsertPageProps {
  mode: 'create' | 'update'
  transactionId?: number
}

export const TransactionUpsertPage: React.FC<TransactionUpsertPageProps> = ({
  mode,
  transactionId,
}) => {
  const {
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
  } = useTransactionUpsertForm({ mode, transactionId })

  if (isUpdateMode && isLoadingDetail) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
        <Spin size="large" tip="Đang tải thông tin giao dịch..." />
      </Flex>
    )
  }

  const isDirectAmountType =
    selectedType === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT ||
    selectedType === FINANCIAL_TRANSACTION_TYPE.TRANSFER

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
      <TransactionUpsertHeader
        isMobile={isMobile}
        isUpdateMode={isUpdateMode}
        transactionId={transactionId}
        selectedType={selectedType}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onSave={handleSave}
      />

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
              options={FinancialTransactionTypeHelper.getOptions()}
            />
          </Form.Item>
        </Card>

        <Row gutter={[20, 20]}>
          {/* CỘT TRÁI: Chi tiết khoản tiền */}
          <Col xs={24} lg={14} xl={15}>
            <Card title="Chi tiết khoản tiền" style={{ height: '100%' }}>
              {/* Banner Tổng tiền */}
              <TransactionUpsertBanner
                selectedType={selectedType}
                displayAmount={displayAmount}
                bannerStyle={bannerStyle}
              />

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
              {isDirectAmountType ? (
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
                <TransactionItemsFormList
                  fieldName="financialTransactionItems"
                  categories={filteredCategories}
                />
              )}
            </Card>
          </Col>

          {/* CỘT PHẢI: Thông tin Ví & Mô tả */}
          <Col xs={24} lg={10} xl={9}>
            <Flex vertical gap={20}>
              <TransactionGeneralForm
                selectedType={selectedType}
                selectedWalletId={selectedWalletId}
                wallets={wallets?.data}
                isLoadingWallets={isLoadingWallets}
                originalTransactions={originalTransactions?.data.data || []}
                isLoadingOriginal={isLoadingOriginal}
                onSelectOriginalTransaction={handleSelectOriginalTransaction}
              />

              <TransactionAdditionalForm
                selectedType={selectedType}
                originalTransactions={originalTransactions?.data.data || []}
                isLoadingOriginal={isLoadingOriginal}
              />
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
            loading={isSubmitting}
          >
            {isUpdateMode ? 'Cập Nhật Giao Dịch' : 'Lưu Giao Dịch'}
          </Button>
        </Flex>
      </div>
    </div>
  )
}
