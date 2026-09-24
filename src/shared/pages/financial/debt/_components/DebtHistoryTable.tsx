import React from 'react'
import { Flex, Table, Tag, Typography } from 'antd'
import { Wallet } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type { IFinance_DebtHistory } from '@/shared/api/financial/debt/debt.type'
import { useGetFinance_Debt_Histories } from '@/shared/api/financial/debt/useGetDebtHistories'
import { FinancialDebtHistoryTypeHelper } from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'

const { Text } = Typography
const mono = "'JetBrains Mono', monospace"

interface Props {
  debtId: number
  pageSize?: number
}

export const DebtHistoryTable: React.FC<Props> = ({ debtId, pageSize = 5 }) => {
  const { data: response, isLoading } = useGetFinance_Debt_Histories({
    id: debtId,
  })

  const columns: ColumnsType<IFinance_DebtHistory> = [
    {
      title: 'Ngày GD',
      dataIndex: 'occurredAt',
      width: 110,
      render: (date: string, record) => (
        <Flex vertical>
          <Text style={{ fontSize: 12, fontFamily: mono }}>
            {DayjsHelper.formatDate(date, 'DD/MM/YYYY')}
          </Text>
          <Text type="secondary" style={{ fontSize: 10 }}>
            Nhập: {DayjsHelper.formatDate(record.createdAt, 'DD/MM HH:mm')}
          </Text>
        </Flex>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'type',
      width: 120,
      render: (type) => (
        <Tag color={FinancialDebtHistoryTypeHelper.getColor(type)}>
          {FinancialDebtHistoryTypeHelper.getLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      align: 'right',
      render: (val: number) => (
        <Text strong style={{ fontFamily: mono }}>
          {convertCurrency(val || 0)}
        </Text>
      ),
    },
    {
      title: 'Dư nợ còn lại',
      align: 'right',
      render: (_, r) => (
        <Flex vertical align="end">
          <Text strong style={{ color: '#1677ff', fontFamily: mono }}>
            {convertCurrency(r.outstandingAmount)}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            (Trước: {convertCurrency(r.previousOutstandingAmount)})
          </Text>
        </Flex>
      ),
    },
    {
      title: 'Ví',
      width: 130,
      render: (_, r) =>
        r.wallet ? (
          <Tag icon={<Wallet size={11} style={{ marginRight: 4 }} />}>
            {r.wallet.name}
          </Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Chỉ ghi sổ
          </Text>
        ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      ellipsis: true,
      render: (note?: string) => note || <Text type="secondary">-</Text>,
    },
  ]

  return (
    <Table<IFinance_DebtHistory>
      rowKey="id"
      loading={isLoading}
      columns={columns}
      dataSource={response?.data || []}
      pagination={{ pageSize, showSizeChanger: false }}
      size="small"
      scroll={{ x: 'max-content' }}
    />
  )
}
