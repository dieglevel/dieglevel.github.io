import React from 'react'
import { Flex, Modal, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { IFinance_DebtHistory } from '@/shared/api/financial/debt/debt.type'
import { useGetFinance_Debt_Histories } from '@/shared/api/financial/debt/useGetDebtHistories'
import { FinancialDebtHistoryTypeHelper } from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'

const { Text } = Typography

interface DebtHistoryModalProps {
  debtId: number
  debtName?: string
  open: boolean
  onClose: () => void
}

export const DebtHistoryModal: React.FC<DebtHistoryModalProps> = ({
  debtId,
  debtName,
  open,
  onClose,
}) => {
  const { data: response, isLoading } = useGetFinance_Debt_Histories({
    id: debtId,
  })

  const histories = response?.data || []

  const columns: ColumnsType<IFinance_DebtHistory> = [
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => (
        <Text
          type="secondary"
          style={{ fontSize: 12, fontFamily: 'monospace' }}
        >
          {DayjsHelper.formatDate(date, 'DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type) => (
        <Tag color={FinancialDebtHistoryTypeHelper.getColor(type)}>
          {FinancialDebtHistoryTypeHelper.getLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Số tiền tác động',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (val: number) => (
        <Text strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {convertCurrency(val || 0)}
        </Text>
      ),
    },
    {
      title: 'Dư nợ còn lại',
      key: 'outstandingAmount',
      align: 'right',
      render: (_, record) => (
        <Flex vertical align="end">
          <Text strong style={{ color: '#1677ff', fontFamily: 'monospace' }}>
            {convertCurrency(record.outstandingAmount)}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            (Trước: {convertCurrency(record.previousOutstandingAmount)})
          </Text>
        </Flex>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note: string) => note || <Text type="secondary">-</Text>,
    },
  ]

  return (
    <Modal
      title={`Lịch sử biến động: ${debtName || `#${debtId}`}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
    >
      <Table<IFinance_DebtHistory>
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={histories}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        size="small"
        style={{ marginTop: 16 }}
      />
    </Modal>
  )
}
