import React from 'react'
import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Progress,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  CheckCircle2,
  History,
  Pencil,
  Receipt,
  Trash2,
  XCircle,
} from 'lucide-react'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_STATUS_ENUM,
  FinancialDebtDirectionHelper,
  FinancialDebtStatusHelper,
  FinancialDebtTypeHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'

const { Text } = Typography

interface DebtTableProps {
  debts: Array<IFinance_Debt>
  isLoading: boolean
  activeTab: string
  onTabChange: (key: string) => void
  onOpenPayment: (debt: IFinance_Debt) => void
  onOpenAdjust: (debt: IFinance_Debt) => void
  onOpenHistory: (debt: IFinance_Debt) => void
  onSettle: (id: number) => Promise<void>
  onCancel: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export const DebtTable: React.FC<DebtTableProps> = ({
  debts,
  isLoading,
  activeTab,
  onTabChange,
  onOpenPayment,
  onOpenAdjust,
  onOpenHistory,
  onSettle,
  onCancel,
  onDelete,
}) => {
  const columns: ColumnsType<IFinance_Debt> = [
    {
      title: 'Tên khoản nợ / Đối tác',
      key: 'nameInfo',
      ellipsis: true,
      render: (_, record) => (
        <Flex align="center" gap={10}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor:
                record.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
                  ? '#f0fdf4'
                  : '#fff1f2',
              color:
                record.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
                  ? '#16a34a'
                  : '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {record.namePerson.charAt(0).toUpperCase()}
          </div>
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Đối tác:{' '}
              <strong style={{ color: '#475569' }}>{record.namePerson}</strong>
            </Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Phân loại',
      key: 'category',
      width: 170,
      render: (_, record) => (
        <Flex vertical gap={4} align="start">
          <Tag color={FinancialDebtDirectionHelper.getColor(record.direction)}>
            {FinancialDebtDirectionHelper.getLabel(record.direction)}
          </Tag>
          <Tag
            color={FinancialDebtTypeHelper.getColor(record.type)}
            style={{ fontSize: 11 }}
          >
            {FinancialDebtTypeHelper.getLabel(record.type)}
          </Tag>
        </Flex>
      ),
    },
    {
      title: 'Tiến độ thu/trả',
      key: 'progress',
      width: 180,
      render: (_, record) => {
        const paid = Math.max(
          0,
          record.originalAmount - record.outstandingAmount,
        )
        const percent =
          record.originalAmount > 0
            ? Math.round((paid / record.originalAmount) * 100)
            : 0
        return (
          <div style={{ width: '100%' }}>
            <Flex
              justify="space-between"
              style={{ fontSize: 11, marginBottom: 2 }}
            >
              <Text type="secondary">
                Gốc: {convertCurrency(record.originalAmount)}
              </Text>
              <Text strong style={{ color: '#16a34a' }}>
                {percent}%
              </Text>
            </Flex>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeColor={
                record.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
                  ? '#16a34a'
                  : '#3b82f6'
              }
            />
          </div>
        )
      },
    },
    {
      title: 'Dư nợ còn lại',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      align: 'right',
      width: 140,
      sorter: (a, b) => a.outstandingAmount - b.outstandingAmount,
      render: (val: number) => (
        <Text
          strong
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: val > 0 ? '#ef4444' : '#10b981',
          }}
        >
          {convertCurrency(val || 0)}
        </Text>
      ),
    },
    {
      title: 'Thời hạn',
      key: 'dates',
      width: 150,
      render: (_, record) => {
        const isOverdue =
          record.status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE &&
          record.dueDate &&
          dayjs().isAfter(dayjs(record.dueDate))

        return (
          <div style={{ fontSize: 12 }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
              Tạo: {DayjsHelper.formatDate(record.startDate, 'DD/MM/YYYY')}
            </Text>
            {record.dueDate ? (
              <Text
                style={{
                  fontSize: 12,
                  color: isOverdue ? '#ff4d4f' : '#64748b',
                  fontWeight: isOverdue ? 600 : 400,
                }}
              >
                Hạn: {DayjsHelper.formatDate(record.dueDate, 'DD/MM/YYYY')}
                {isOverdue && ' (Quá hạn)'}
              </Text>
            ) : (
              <Text type="secondary" style={{ fontSize: 11 }}>
                Không có hạn
              </Text>
            )}
          </div>
        )
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: FINANCIAL_DEBT_STATUS_ENUM) => (
        <Tag color={FinancialDebtStatusHelper.getColor(status)}>
          {FinancialDebtStatusHelper.getLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      align: 'center',
      render: (_, record) => {
        const isActive = record.status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE

        return (
          <Space size={4}>
            {isActive && (
              <>
                <Tooltip
                  title={
                    record.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
                      ? 'Thu hồi nợ'
                      : 'Thanh toán nợ'
                  }
                >
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<Receipt size={14} />}
                    onClick={() => onOpenPayment(record)}
                  />
                </Tooltip>

                <Tooltip title="Điều chỉnh dư nợ">
                  <Button
                    size="small"
                    icon={<Pencil size={14} />}
                    onClick={() => onOpenAdjust(record)}
                  />
                </Tooltip>

                <Tooltip title="Tất toán / Miễn nợ">
                  <Popconfirm
                    title="Xác nhận tất toán khoản nợ này?"
                    description="Khoản nợ sẽ hoàn thành mà không làm thay đổi số dư ví."
                    onConfirm={() => onSettle(record.id)}
                    okText="Tất toán"
                    cancelText="Hủy"
                  >
                    <Button
                      size="small"
                      icon={<CheckCircle2 size={14} />}
                      style={{ color: '#52c41a' }}
                    />
                  </Popconfirm>
                </Tooltip>

                <Tooltip title="Hủy bỏ">
                  <Popconfirm
                    title="Xác nhận hủy khoản nợ?"
                    description="Khoản nợ sẽ bị đánh dấu hủy."
                    onConfirm={() => onCancel(record.id)}
                    okText="Hủy khoản nợ"
                    cancelText="Quay lại"
                  >
                    <Button size="small" danger icon={<XCircle size={14} />} />
                  </Popconfirm>
                </Tooltip>
              </>
            )}

            <Tooltip title="Xem lịch sử biến động">
              <Button
                size="small"
                icon={<History size={14} />}
                onClick={() => onOpenHistory(record)}
              />
            </Tooltip>

            <Popconfirm
              title="Xóa khoản nợ này?"
              description="Hành động này sẽ xóa hoàn toàn bản ghi khoản nợ."
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                size="small"
                type="text"
                danger
                icon={<Trash2 size={14} />}
              />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  return (
    <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '0 16px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={[
            { key: 'ALL', label: 'Tất cả khoản nợ' },
            ...Object.values(FINANCIAL_DEBT_STATUS_ENUM).map((status) => ({
              key: status,
              label: (
                <Flex align="center" gap={4}>
                  {FinancialDebtStatusHelper.getLabel(status)}
                  {status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({debts.filter((d) => d.status === status).length})
                    </Text>
                  )}
                </Flex>
              ),
            })),
          ]}
        />
      </div>

      <Table<IFinance_Debt>
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={debts}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} khoản nợ`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  )
}
