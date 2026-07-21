import React, { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Flex,
  FloatButton,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { AddTransactionModal } from './_components/AddTransactionModal'
import { TransactionsSummary } from './_components/TransactionsSummary'
import type { ColumnsType } from 'antd/es/table'
import type { IWallet_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import type { IWallet_Category } from '@/shared/api/financial/category/category.type'
import type { IWallet_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { useGetWallet_Transaction_List } from '@/shared/api/financial/transaction/useGetWallet_Transaction_List'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'

const { Title, Text } = Typography

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    n,
  )

const STATUS_TAG: Record<IWallet_Transaction['status'], { color: string }> = {
  completed: { color: 'success' },
  pending: { color: 'warning' },
  failed: { color: 'error' },
}

export function Transactions() {
  const [selectTransactions, setTransactions] = useState<
    Array<IWallet_Transaction>
  >([])
  const { data: dataTransaction } = useGetWallet_Transaction_List({})
  const transactions = dataTransaction?.data || []
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all',
  )
  const [walletFilter, setWalletFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Array<React.Key>>([])

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    const result = transactions.filter((t) => {
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
    return result
  }, [transactions, search, typeFilter, walletFilter, catFilter, statusFilter])

  const deleteSelected = () => {
    setTransactions((prev) => prev.filter((t) => !selectedKeys.includes(t.id)))
    setSelectedKeys([])
  }

  // Cấu hình cột Table Antd
  const columns: ColumnsType<IWallet_Transaction> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      title: 'Wallet',
      dataIndex: 'wallet',
      key: 'walletId',
      render: (data: IWallet_Wallet) => {
        return (
          <Flex align="center" gap={8}>
            <div
              style={{
                backgroundColor: `${data.color}ff`,
                borderRadius: 8,
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconRenderer iconName={data.icon} size={12} color={'#ffffff'} />
            </div>
            <Text style={{ fontSize: 13 }}>{data.name}</Text>
          </Flex>
        )
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'categoryId',
      render: (data: IWallet_Category) => {
        return (
          <Flex align="center" gap={8}>
            <div
              style={{
                backgroundColor: `${data.color}ff`,
                borderRadius: 8,
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconRenderer iconName={data.icon} size={12} color={'#ffffff'} />
            </div>
            <Text style={{ fontSize: 13 }}>{data.name}</Text>
          </Flex>
        )
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
            {fmt(amount)}
          </Text>
        )
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
      render: (status: IWallet_Transaction['status']) => (
        <Tag
          color={STATUS_TAG[status].color}
          style={{ textTransform: 'capitalize' }}
        >
          {status}
        </Tag>
      ),
    },
  ]

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ width: '100%', padding: 24 }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Transactions
          </Title>
          <Text type="secondary">{transactions.length} total records</Text>
        </div>
        <Space>
          {selectedKeys.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={deleteSelected}>
              Delete ({selectedKeys.length})
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAdd(true)}
          >
            Add Transaction
          </Button>
        </Space>
      </Flex>

      {/* Summary Component */}
      <TransactionsSummary transactions={transactions} />

      {/* Filter Controls */}
      <Card size="small">
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Search transactions…"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 130 }}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
          />
          <Select
            value={walletFilter}
            onChange={setWalletFilter}
            style={{ width: 150 }}
            options={[
              { value: 'all', label: 'All Wallets' },
              ...transactions.map((w) => ({
                value: w.id,
                label: `${w.wallet?.icon} ${w.wallet?.name}`,
              })),
            ]}
          />
          <Select
            value={catFilter}
            onChange={setCatFilter}
            style={{ width: 160 }}
            options={[
              { value: 'all', label: 'All Categories' },
              ...transactions.map((c) => ({
                value: c.id,
                label: `${c.category?.icon} ${c.category?.name}`,
              })),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </Space>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Showing {filtered.length} of {transactions.length} results
          </Text>
        </div>
      </Card>

      {/* Main Table */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table<IWallet_Transaction>
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 768 }}
        />
      </Card>

      {/* Add Modal */}
      {showAdd && (
        <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} />
      )}

      {/* Floating Action Button (Mobile) */}
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowAdd(true)}
        style={{ right: 24, bottom: 24 }}
      />
    </Space>
  )
}
