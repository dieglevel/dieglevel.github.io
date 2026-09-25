import React from 'react'
import { Button, Card, Flex, Popconfirm, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import {
  FINANCIAL_TRANSACTION_TYPE,
  FinancialTransactionStatusHelper,
  FinancialTransactionTypeHelper,
} from '@/shared/api/financial/transaction/transaction.enum'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'

const { Text } = Typography

interface TransactionsTableProps {
  isFetching: boolean
  dataSource: Array<IFinance_Transaction>
  isMobile: boolean
  selectedKeys: Array<React.Key>
  onSelectChange: (selectedKeys: Array<React.Key>) => void
  onViewDetail: (transaction: IFinance_Transaction) => void
  pagination?: TablePaginationConfig
  onPageChange: (newPage: number) => void
  onDelete: (transactionId: number) => void
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  isFetching,
  dataSource,
  isMobile,
  selectedKeys,
  onSelectChange,
  onViewDetail,
  pagination,
  onPageChange,
  onDelete,
}) => {
  const navigate = useNavigate()

  // Cấu hình Cột Bảng
  const columns: ColumnsType<IFinance_Transaction> = [
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
          {DayjsHelper.formatDate(date, 'DD/MM/YYYY')}
        </Text>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      sorter: (a, b) => {
        if (a.description && b.description) {
          return a.description.localeCompare(b.description)
        }
        return 0
      },
      render: (desc: string) => <Text strong>{desc}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record) => {
        const isIncome = record.type === FINANCIAL_TRANSACTION_TYPE.INCOME
        const isAdjustment =
          record.type === FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT
        return (
          <Text
            style={{
              color: isIncome ? '#10b981' : undefined,
              fontWeight: 600,
            }}
          >
            {isAdjustment ? (
              convertCurrency(amount)
            ) : (
              <>
                {isIncome ? '+' : '-'}
                {convertCurrency(amount)}
              </>
            )}
          </Text>
        )
      },
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
      key: 'walletId',
      responsive: ['sm'],
      render: (data?: IFinance_Wallet) => (
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
      key: 'categories',
      responsive: ['md'],
      render: (_, record) => {
        const advances = record.financialTransactionItems || []
        // Thu thập các categories không bị trùng lặp
        const categories = Array.from(
          new Map(
            advances
              .filter((adv) => adv.category)
              .map((adv) => [adv.category!.id, adv.category!]),
          ).values(),
        )

        if (categories.length === 0) {
          return (
            <Text type="secondary" style={{ fontSize: 13 }}>
              -
            </Text>
          )
        }

        return (
          <Flex wrap gap={4} align="center">
            {categories.map((cat) => (
              <Tag
                key={cat.id}
                color={cat.color || 'blue'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  margin: 0,
                }}
              >
                <IconRenderer iconName={cat.icon} size={16} color={cat.color} />
                {cat.name}
              </Tag>
            ))}
          </Flex>
        )
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      responsive: ['lg'],
      render: (type) => (
        <Tag
          color={type === 'income' ? 'green' : 'volcano'}
          style={{ textTransform: 'capitalize' }}
        >
          {FinancialTransactionTypeHelper.getLabel(type) || type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['md'],
      render: (status: IFinance_Transaction['status']) => (
        <Tag
          color={FinancialTransactionStatusHelper.getColor(status) || 'default'}
          style={{ textTransform: 'capitalize' }}
        >
          {FinancialTransactionStatusHelper.getLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Flex align="center" justify="center">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(record)
            }}
          />
          <Popconfirm
            title="Xóa Transaction"
            description="Bạn có chắc chắn muốn xóa cái này?"
            onConfirm={(e) => {
              e?.stopPropagation()
              onDelete(record.id)
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Flex>
      ),
    },
  ]

  return (
    <Card
      styles={{
        body: { padding: 0 },
      }}
      style={{ overflow: 'hidden' }}
    >
      <Table<IFinance_Transaction>
        loading={isFetching}
        rowKey="id"
        size={isMobile ? 'small' : 'medium'}
        columns={columns}
        dataSource={dataSource}
        onRow={(record) => ({
          onClick: () =>
            navigate({ to: `/financial/transaction/${record.id}` }),
          style: { cursor: 'pointer' },
        })}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: onSelectChange,
        }}
        pagination={{
          onChange: (page) => onPageChange(page),
          total: pagination?.total || 300,
          current: pagination?.current || 1,
          pageSize: pagination?.pageSize || 10,
          showSizeChanger: false,
          simple: isMobile,
          showTotal: isMobile
            ? undefined
            : (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  )
}
