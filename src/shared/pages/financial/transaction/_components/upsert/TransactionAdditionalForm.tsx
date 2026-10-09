import React, { useState, useMemo } from 'react'
import { Card, Form, Input, Button, Modal, Space, Grid } from 'antd'
import { useTranslation } from 'react-i18next'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'
import { TransactionsTable } from '../TransactionsTable'
import { useGetFinance_Transaction_List } from '@/shared/api/financial/transaction/useGetFinance_Transaction_List'
import { CloseOutlined, SelectOutlined } from '@ant-design/icons'
import { TransactionSearch } from '../TransactionSearch'
import { TransactionFilterModal } from '../TransactionFilterModal'

const { useBreakpoint } = Grid

interface TransactionAdditionalFormProps {
  selectedType: FINANCIAL_TRANSACTION_TYPE
  originalTransactions?: Array<IFinance_Transaction>
  isLoadingOriginal?: boolean
}

export const TransactionAdditionalForm: React.FC<
  TransactionAdditionalFormProps
> = ({ selectedType, originalTransactions, isLoadingOriginal }) => {
  const { t } = useTranslation('finance')
  const screens = useBreakpoint()
  const isMobile = !screens.sm

  const form = Form.useFormInstance()
  const originalTransactionId = Form.useWatch('originalTransactionId', form)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  // Search & Filter State
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | FINANCIAL_TRANSACTION_TYPE>('all')
  const [walletFilter, setWalletFilter] = useState<number | 'all'>('all')
  const [catFilter, setCatFilter] = useState<number | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (typeFilter !== 'all') count++
    if (walletFilter !== 'all') count++
    if (catFilter !== 'all') count++
    if (statusFilter !== 'all') count++
    return count
  }, [typeFilter, walletFilter, catFilter, statusFilter])

  const handleResetFilter = () => {
    setTypeFilter('all')
    setWalletFilter('all')
    setCatFilter('all')
    setStatusFilter('all')
  }

  const { data: listData, isFetching } = useGetFinance_Transaction_List({
    queryParams: {
      page,
      limit: 10,
      search: search || undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
      walletId: walletFilter !== 'all' ? walletFilter : undefined,
    },
    options: {
      enabled: isModalOpen,
    },
  })

  const transactions = listData?.data?.data || []

  const walletOptions = useMemo(() => {
    const map = new Map<number, any>()
    transactions.forEach((t) => {
      if (t.wallet?.id) map.set(t.wallet.id, t.wallet)
    })
    return Array.from(map.values()).map((w) => ({ value: w.id, label: w.name }))
  }, [transactions])

  const categoryOptions = useMemo(() => {
    const map = new Map<number, any>()
    transactions.forEach((t) => {
      t.financialTransactionItems?.forEach((item) => {
        if (item.category?.id) map.set(item.category.id, item.category)
      })
    })
    return Array.from(map.values()).map((c) => ({ value: c.id, label: c.name }))
  }, [transactions])

  const handleSelectOriginal = (transaction: IFinance_Transaction) => {
    form.setFieldValue('originalTransactionId', transaction.id)
    setIsModalOpen(false)
  }

  const selectedTx =
    (originalTransactionId &&
      listData?.data?.data?.find((tx) => tx.id === originalTransactionId)) ||
    originalTransactions?.find((tx) => tx.id === originalTransactionId)

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
        <Form.Item label={t('transaction.detail')}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              readOnly
              placeholder={t('transaction.detail')}
              value={
                selectedTx
                  ? `#${selectedTx.id} - ${selectedTx.description} (${selectedTx.amount.toLocaleString('vi-VN')} đ)`
                  : ''
              }
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: 'pointer' }}
            />
            <Button
              icon={<SelectOutlined />}
              onClick={() => setIsModalOpen(true)}
            />
            {originalTransactionId && (
              <Button
                icon={<CloseOutlined />}
                onClick={() =>
                  form.setFieldValue('originalTransactionId', undefined)
                }
              />
            )}
          </Space.Compact>
        </Form.Item>
      )}

      {/* Hidden input for form value */}
      <Form.Item name="originalTransactionId" hidden>
        <Input />
      </Form.Item>

      <Form.Item
        label={t('common.description')}
        name="receiptImageUrl"
        style={{ marginBottom: 0 }}
      >
        <Input placeholder="https://..." maxLength={500} />
      </Form.Item>

      <Modal
        title={t('transaction.detail')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
        destroyOnClose
        styles={{ body: { padding: '16px 0 0 0' } }}
      >
        <div style={{ padding: '0 24px 16px 24px' }}>
          <TransactionSearch
            isMobile={isMobile}
            search={search}
            onSearchChange={setSearch}
            activeFilterCount={activeFilterCount}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
            typeFilter={typeFilter}
            walletFilter={walletFilter}
            catFilter={catFilter}
            statusFilter={statusFilter}
            walletOptions={walletOptions}
            categoryOptions={categoryOptions}
            onClearType={() => setTypeFilter('all')}
            onClearWallet={() => setWalletFilter('all')}
            onClearCat={() => setCatFilter('all')}
            onClearStatus={() => setStatusFilter('all')}
            onResetAll={handleResetFilter}
          />
        </div>

        <TransactionFilterModal
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          activeFilterCount={activeFilterCount}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          walletFilter={walletFilter}
          setWalletFilter={setWalletFilter}
          catFilter={catFilter}
          setCatFilter={setCatFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          walletOptions={walletOptions}
          categoryOptions={categoryOptions}
          onResetFilter={handleResetFilter}
        />

        <TransactionsTable
          isFetching={isFetching}
          dataSource={transactions}
          isMobile={isMobile}
          selectedKeys={originalTransactionId ? [originalTransactionId] : []}
          onSelectChange={(keys) => {
            if (keys.length > 0) {
              form.setFieldValue('originalTransactionId', keys[0])
              setIsModalOpen(false)
            }
          }}
          onViewDetail={handleSelectOriginal}
          pagination={listData?.data?.meta}
          onPageChange={setPage}
          onDelete={() => {}}
          onRowClick={handleSelectOriginal}
        />
      </Modal>
    </Card>
  )
}
