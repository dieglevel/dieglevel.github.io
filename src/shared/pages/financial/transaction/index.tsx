import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  FloatButton,
  Grid,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { AddTransactionModal } from './_components/AddTransactionModal'
import { TransactionsSummary } from './_components/TransactionsSummary'
import type { ColumnsType } from 'antd/es/table'
import type { IWallet_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import type { IWallet_Category } from '@/shared/api/financial/category/category.type'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { useGetWallet_Transaction_Date } from '@/shared/api/financial/transaction/useGetWallet_Transaction_Date'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const STATUS_TAG: Record<IWallet_Transaction['status'], { color: string }> = {
  completed: { color: 'success' },
  pending: { color: 'warning' },
  failed: { color: 'error' },
}

export function Transactions() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { data: dataTransaction } = useGetWallet_Transaction_Date({})
  const transactions = dataTransaction?.data || []

  // State Tìm kiếm & Bộ lọc
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all',
  )
  const [walletFilter, setWalletFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // State UI Controls
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Array<React.Key>>([])

  // State cho Modal Xem Chi Tiết Transaction
  const [viewTransaction, setViewTransaction] =
    useState<IWallet_Transaction | null>(null)

  // Danh sách Ví cho Select
  const walletOptions = useMemo(() => {
    const map = new Map<string, IWallet_Wallet>()
    transactions.forEach((t) => {
      if (t.wallet?.id) map.set(t.wallet.id, t.wallet)
    })
    return Array.from(map.values()).map((w) => ({
      value: w.id,
      label: w.name,
    }))
  }, [transactions])

  // Danh sách Danh mục cho Select
  const categoryOptions = useMemo(() => {
    const map = new Map<string, IWallet_Category>()
    transactions.forEach((t) => {
      if (t.category?.id) map.set(t.category.id, t.category)
    })
    return Array.from(map.values()).map((c) => ({
      value: c.id,
      label: c.name,
    }))
  }, [transactions])

  // Đếm số lượng bộ lọc nâng cao đang active
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (typeFilter !== 'all') count++
    if (walletFilter !== 'all') count++
    if (catFilter !== 'all') count++
    if (statusFilter !== 'all') count++
    return count
  }, [typeFilter, walletFilter, catFilter, statusFilter])

  // Reset toàn bộ filter
  const handleResetFilter = () => {
    setTypeFilter('all')
    setWalletFilter('all')
    setCatFilter('all')
    setStatusFilter('all')
  }

  // Logic Filter dữ liệu
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (
        search &&
        ![t.description, t.amount.toString()]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (walletFilter !== 'all' && t.wallet?.id !== walletFilter) return false
      if (catFilter !== 'all' && t.category?.id !== catFilter) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      return true
    })
  }, [transactions, search, typeFilter, walletFilter, catFilter, statusFilter])

  const deleteSelected = () => {
    setSelectedKeys([])
  }

  // Cấu hình Cột Bảng
  const columns: ColumnsType<IWallet_Transaction> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 90,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      render: (date: string) => (
        <Text
          type="secondary"
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        >
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: (desc: string) => <Text strong>{desc}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record) => {
        const isIncome = record.type === 'income'
        return (
          <Text
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: isIncome ? '#10b981' : undefined,
              fontWeight: 600,
            }}
          >
            {isIncome ? '+' : '-'}
            {convertCurrency(amount)}
          </Text>
        )
      },
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
      key: 'walletId',
      responsive: ['sm'],
      render: (data?: IWallet_Wallet) => (
        <Flex align="center" gap={8}>
          <div
            style={{
              backgroundColor: `${data?.color || '#ccc'}ff`,
              borderRadius: 6,
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconRenderer iconName={data?.icon} size={12} color={'#ffffff'} />
          </div>
          <Text style={{ fontSize: 13 }}>{data?.name}</Text>
        </Flex>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'categoryId',
      responsive: ['md'],
      render: (data?: IWallet_Category) => (
        <Flex align="center" gap={8}>
          <div
            style={{
              backgroundColor: `${data?.color || '#ccc'}ff`,
              borderRadius: 6,
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconRenderer iconName={data?.icon} size={12} color={'#ffffff'} />
          </div>
          <Text style={{ fontSize: 13 }}>{data?.name || '-'}</Text>
        </Flex>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      responsive: ['lg'],
      render: (type: 'income' | 'expense') => (
        <Tag
          color={type === 'income' ? 'green' : 'volcano'}
          style={{ textTransform: 'capitalize' }}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['md'],
      render: (status: IWallet_Transaction['status']) => (
        <Tag
          color={STATUS_TAG[status].color || 'default'}
          style={{ textTransform: 'capitalize' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation() // Ngăn chặn sự kiện click row trùng lặp
            setViewTransaction(record)
          }}
        />
      ),
    },
  ]

  return (
    <Space
      direction="vertical"
      size={isMobile ? 'small' : 'middle'}
      style={{
        width: '100%',
        padding: isMobile ? 12 : 24,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Flex
        vertical={isMobile}
        justify="space-between"
        align={isMobile ? 'stretch' : 'center'}
        gap={12}
      >
        <div>
          <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
            Transactions
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Showing {filtered.length} of {transactions.length} records
          </Text>
        </div>
        <Space
          style={{ width: isMobile ? '100%' : 'auto' }}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          {selectedKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={deleteSelected}
              style={{ flex: 1 }}
            >
              Delete ({selectedKeys.length})
            </Button>
          )}
          {!isMobile && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAdd(true)}
            >
              Add Transaction
            </Button>
          )}
        </Space>
      </Flex>

      {/* Summary Chart Component */}
      <TransactionsSummary transactions={transactions} />

      {/* Thanh công cụ Tìm kiếm & Nút mở Filter Modal */}
      <Card size="small" bodyStyle={{ padding: 12 }}>
        <Flex gap={10} align="center">
          <Input
            placeholder="Search transactions…"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
            allowClear
          />
          <Badge count={activeFilterCount} color="#1677ff" offset={[-2, 2]}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsFilterModalOpen(true)}
            >
              {!isMobile && 'Filters'}
            </Button>
          </Badge>
        </Flex>

        {/* Chip hiển thị các Filter đang active để xóa nhanh */}
        {activeFilterCount > 0 && (
          <Flex wrap gap={6} style={{ marginTop: 10 }}>
            <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
              Active Filters:
            </Text>

            {typeFilter !== 'all' && (
              <Tag closable onClose={() => setTypeFilter('all')} color="blue">
                Type: {typeFilter}
              </Tag>
            )}
            {walletFilter !== 'all' && (
              <Tag closable onClose={() => setWalletFilter('all')} color="blue">
                Wallet:{' '}
                {walletOptions.find((w) => w.value === walletFilter)?.label}
              </Tag>
            )}
            {catFilter !== 'all' && (
              <Tag closable onClose={() => setCatFilter('all')} color="blue">
                Category:{' '}
                {categoryOptions.find((c) => c.value === catFilter)?.label}
              </Tag>
            )}
            {statusFilter !== 'all' && (
              <Tag closable onClose={() => setStatusFilter('all')} color="blue">
                Status: {statusFilter}
              </Tag>
            )}

            <Button
              type="link"
              size="small"
              onClick={handleResetFilter}
              style={{ padding: 0, fontSize: 12 }}
            >
              Clear all
            </Button>
          </Flex>
        )}
      </Card>

      {/* Main Table */}
      <Card bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden' }}>
        <Table<IWallet_Transaction>
          rowKey="id"
          size={isMobile ? 'small' : 'medium'}
          columns={columns}
          dataSource={filtered}
          onRow={(record) => ({
            onClick: () => setViewTransaction(record),
            style: { cursor: 'pointer' },
          })}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            simple: isMobile,
            showTotal: isMobile
              ? undefined
              : (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* FILTER MODAL */}
      <Modal
        title={
          <Flex
            justify="space-between"
            align="center"
            style={{ paddingRight: 24 }}
          >
            <span>Filter Transactions</span>
            {activeFilterCount > 0 && (
              <Button
                type="link"
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleResetFilter}
              >
                Reset
              </Button>
            )}
          </Flex>
        }
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        onOk={() => setIsFilterModalOpen(false)}
        okText="Apply Filters"
        cancelText="Close"
        centered
        width={420}
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%', marginTop: 16 }}
        >
          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Transaction Type
            </Text>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
            />
          </div>

          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Wallet
            </Text>
            <Select
              value={walletFilter}
              onChange={setWalletFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'All Wallets' },
                ...walletOptions,
              ]}
            />
          </div>

          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Category
            </Text>
            <Select
              value={catFilter}
              onChange={setCatFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'All Categories' },
                ...categoryOptions,
              ]}
            />
          </div>

          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Status
            </Text>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'failed', label: 'Failed' },
              ]}
            />
          </div>
        </Space>
      </Modal>

      {/* VIEW TRANSACTION MODAL */}
      <Modal
        title="Transaction Details"
        open={!!viewTransaction}
        onCancel={() => setViewTransaction(null)}
        footer={[
          <Button key="close" onClick={() => setViewTransaction(null)}>
            Close
          </Button>,
        ]}
        width={560}
        centered
      >
        {viewTransaction && (
          <Space
            direction="vertical"
            style={{ width: '100%', marginTop: 12 }}
            size="large"
          >
            {/* Tổng quan số tiền */}
            <Card
              size="small"
              style={{
                textAlign: 'center',
                backgroundColor:
                  viewTransaction.type === 'income' ? '#f6ffed' : '#fff2f0',
                borderColor:
                  viewTransaction.type === 'income' ? '#b7eb8f' : '#ffccc7',
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                TOTAL AMOUNT
              </Text>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color:
                    viewTransaction.type === 'income' ? '#52c41a' : '#ff4d4f',
                }}
              >
                {viewTransaction.type === 'income' ? '+' : '-'}
                {convertCurrency(viewTransaction.amount)}
              </Title>
            </Card>

            {/* Thông tin cơ bản */}
            <Descriptions column={isMobile ? 1 : 2} bordered size="small">
              <Descriptions.Item label="Description" span={2}>
                <Text strong>{viewTransaction.description}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Type">
                <Tag
                  color={
                    viewTransaction.type === 'income' ? 'green' : 'volcano'
                  }
                >
                  {viewTransaction.type.toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag
                  color={STATUS_TAG[viewTransaction.status].color || 'default'}
                >
                  {viewTransaction.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Wallet">
                <Flex align="center" gap={6}>
                  <IconRenderer
                    iconName={viewTransaction.wallet?.icon}
                    size={14}
                  />
                  <span>{viewTransaction.wallet?.name || '-'}</span>
                </Flex>
              </Descriptions.Item>

              <Descriptions.Item label="Category">
                <Flex align="center" gap={6}>
                  <IconRenderer
                    iconName={viewTransaction.category?.icon}
                    size={14}
                  />
                  <span>{viewTransaction.category?.name || '-'}</span>
                </Flex>
              </Descriptions.Item>

              <Descriptions.Item label="Date" span={2}>
                {new Date(viewTransaction.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Danh sách các chi tiết hạng mục (nếu là Advance Transaction) */}
            {viewTransaction.financialAdvanceTransactions &&
              viewTransaction.financialAdvanceTransactions.length > 0 && (
                <div>
                  <Divider
                    orientation="horizontal"
                    style={{ margin: '12px 0', fontSize: 14 }}
                  >
                    Breakdown Items (
                    {viewTransaction.financialAdvanceTransactions.length})
                  </Divider>

                  <Table
                    size="small"
                    pagination={false}
                    rowKey="id"
                    dataSource={viewTransaction.financialAdvanceTransactions}
                    columns={[
                      {
                        title: 'Item Description',
                        dataIndex: 'description',
                        key: 'description',
                      },
                      {
                        title: 'Amount',
                        dataIndex: 'amount',
                        key: 'amount',
                        align: 'right',
                        render: (amt: number) => convertCurrency(amt),
                      },
                    ]}
                  />
                </div>
              )}
          </Space>
        )}
      </Modal>

      {/* Add Modal */}
      {showAdd && (
        <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAdd(true)}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </Space>
  )
}
