import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Flex,
  FloatButton,
  Grid,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  BellOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  RobotOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { RecurringSummary } from './_components/RecurringSummary'
import { AddRecurringModal } from './_components/AddRecurringModal'
import type { ColumnsType } from 'antd/es/table'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'

// Type định nghĩa dựa theo Entity Backend (FinanceRecurringEntity)
export interface IFinanceRecurring {
  id: number
  name: string
  recurringType: 'BILL' | 'SUBSCRIPTION' | 'SALARY' | 'OTHER'
  frequency: 'WEEKLY' | 'MONTHLY' | 'EVERY_N_DAYS'
  transactionType: 'income' | 'expense'
  amount: number
  description?: string
  merchant?: string
  location?: string
  tags?: Array<string>
  dayOfMonth?: number
  intervalDays?: number
  nextRunAt: string
  lastRunAt?: string
  isActive: boolean
  isAutoCreate: boolean
  reminderOnly: boolean
  walletId: number
  wallet?: { id: string; name: string; icon?: string; color?: string }
  categoryId?: number
  category?: { id: string; name: string; icon?: string; color?: string }
}

const { Title, Text } = Typography
const { useBreakpoint } = Grid

export function RecurringTransactions() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  // MOCK DATA (Thay thế bằng hook React Query từ API backend của bạn)
  const [recurringRules, setRecurringRules] = useState<
    Array<IFinanceRecurring>
  >([
    {
      id: 1,
      name: 'Tiền thuê nhà',
      recurringType: 'BILL',
      frequency: 'MONTHLY',
      transactionType: 'expense',
      amount: 6000000,
      dayOfMonth: 5,
      nextRunAt: '2026-08-05T00:00:00.000Z',
      lastRunAt: '2026-07-05T00:00:00.000Z',
      isActive: true,
      isAutoCreate: true,
      reminderOnly: false,
      walletId: 1,
      wallet: { id: 'w1', name: 'Ví VCB', color: '#10b981', icon: 'wallet' },
      category: { id: 'c1', name: 'Nhà ở', color: '#f59e0b', icon: 'home' },
      tags: ['Cố định', 'Nhà ở'],
    },
    {
      id: 2,
      name: 'Lương hàng tháng',
      recurringType: 'SALARY',
      frequency: 'MONTHLY',
      transactionType: 'income',
      amount: 25000000,
      dayOfMonth: 1,
      nextRunAt: '2026-09-01T00:00:00.000Z',
      isActive: true,
      isAutoCreate: false,
      reminderOnly: true,
      walletId: 1,
      wallet: { id: 'w1', name: 'Ví VCB', color: '#10b981', icon: 'wallet' },
      category: {
        id: 'c2',
        name: 'Thu nhập',
        color: '#3b82f6',
        icon: 'dollar',
      },
      tags: ['Công ty'],
    },
  ])

  // State Tìm kiếm & Bộ lọc
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all',
  )
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all')
  const [recurringTypeFilter, setRecurringTypeFilter] = useState<string>('all')

  // State UI Controls
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRule, setEditingRule] = useState<IFinanceRecurring | null>(
    null,
  )
  const [selectedKeys, setSelectedKeys] = useState<Array<React.Key>>([])
  const [loadingRunDue, setLoadingRunDue] = useState(false)

  // State xem chi tiết Modal
  const [viewRule, setViewRule] = useState<IFinanceRecurring | null>(null)

  // Đếm filter active
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (typeFilter !== 'all') count++
    if (frequencyFilter !== 'all') count++
    if (recurringTypeFilter !== 'all') count++
    return count
  }, [typeFilter, frequencyFilter, recurringTypeFilter])

  const handleResetFilter = () => {
    setTypeFilter('all')
    setFrequencyFilter('all')
    setRecurringTypeFilter('all')
  }

  // Filter Dữ liệu
  const filteredData = useMemo(() => {
    return recurringRules.filter((r) => {
      if (
        search &&
        ![r.name, r.amount.toString(), r.description || '']
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false
      }
      if (typeFilter !== 'all' && r.transactionType !== typeFilter) return false
      if (frequencyFilter !== 'all' && r.frequency !== frequencyFilter)
        return false
      if (
        recurringTypeFilter !== 'all' &&
        r.recurringType !== recurringTypeFilter
      )
        return false
      return true
    })
  }, [recurringRules, search, typeFilter, frequencyFilter, recurringTypeFilter])

  // Chạy quét thủ công lịch đến hạn
  const handleRunDue = async () => {
    setLoadingRunDue(true)
    try {
      // Gọi API financialRecurringService.runDueForAccount() ở đây
      await new Promise((resolve) => setTimeout(resolve, 800))
    } finally {
      setLoadingRunDue(false)
    }
  }

  const toggleStatus = (id: number, isActive: boolean) => {
    setRecurringRules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive } : item)),
    )
  }

  // Cấu hình Cột Bảng chuẩn Layout của bạn
  const columns: ColumnsType<IFinanceRecurring> = [
    {
      title: 'Tên & Phân loại',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{name}</Text>
          <Space size={4} wrap>
            <Tag color="blue">{record.recurringType}</Tag>
            {record.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record) => {
        const isIncome = record.transactionType === 'income'
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
      title: 'Chu kỳ',
      key: 'frequency',
      responsive: ['sm'],
      render: (_, record) => {
        let label: string = record.frequency
        if (record.frequency === 'MONTHLY')
          label = `Hàng tháng (Ngày ${record.dayOfMonth || 1})`
        if (record.frequency === 'WEEKLY') label = 'Hàng tuần'
        if (record.frequency === 'EVERY_N_DAYS')
          label = `Mỗi ${record.intervalDays} ngày`
        return <Tag icon={<ClockCircleOutlined />}>{label}</Tag>
      },
    },
    {
      title: 'Chế độ',
      key: 'mode',
      responsive: ['md'],
      render: (_, record) =>
        record.reminderOnly ? (
          <Tag color="warning" icon={<BellOutlined />}>
            Nhắc nhở
          </Tag>
        ) : (
          <Tag color="processing" icon={<RobotOutlined />}>
            {record.isAutoCreate ? 'Tự động tạo' : 'Thủ công'}
          </Tag>
        ),
    },
    {
      title: 'Lần chạy tiếp',
      dataIndex: 'nextRunAt',
      key: 'nextRunAt',
      responsive: ['lg'],
      sorter: (a, b) => a.nextRunAt.localeCompare(b.nextRunAt),
      render: (date: string) => (
        <Text
          type="secondary"
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        >
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 90,
      align: 'center',
      render: (isActive: boolean, record) => (
        <Switch
          size="small"
          checked={isActive}
          onChange={(checked) => toggleStatus(record.id, checked)}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              setViewRule(record)
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              setEditingRule(record)
              setShowAddModal(true)
            }}
          />
        </Space>
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
            Giao dịch Định kỳ
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Hiển thị {filteredData.length} trên tổng số {recurringRules.length}{' '}
            cấu hình
          </Text>
        </div>
        <Space
          style={{ width: isMobile ? '100%' : 'auto' }}
          direction={isMobile ? 'vertical' : 'horizontal'}
        >
          {selectedKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedKeys.length} mục đã chọn?`}>
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{ width: '100%' }}
              >
                Xóa ({selectedKeys.length})
              </Button>
            </Popconfirm>
          )}
          <Button
            icon={<PlayCircleOutlined />}
            loading={loadingRunDue}
            onClick={handleRunDue}
          >
            Quét khoản đến hạn
          </Button>
          {!isMobile && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRule(null)
                setShowAddModal(true)
              }}
            >
              Thêm định kỳ
            </Button>
          )}
        </Space>
      </Flex>

      {/* Summary Chart Component */}
      <RecurringSummary rules={recurringRules} />

      {/* Toolbar & Filter Card */}
      <Card size="small" styles={{ body: { padding: 12 } }}>
        <Flex gap={10} align="center">
          <Input
            placeholder="Tìm kiếm giao dịch định kỳ..."
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
              {!isMobile && 'Bộ lọc'}
            </Button>
          </Badge>
        </Flex>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <Flex wrap gap={6} style={{ marginTop: 10 }}>
            <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
              Bộ lọc đang dùng:
            </Text>

            {typeFilter !== 'all' && (
              <Tag closable onClose={() => setTypeFilter('all')} color="blue">
                Loại: {typeFilter}
              </Tag>
            )}
            {frequencyFilter !== 'all' && (
              <Tag
                closable
                onClose={() => setFrequencyFilter('all')}
                color="blue"
              >
                Tần suất: {frequencyFilter}
              </Tag>
            )}
            {recurringTypeFilter !== 'all' && (
              <Tag
                closable
                onClose={() => setRecurringTypeFilter('all')}
                color="blue"
              >
                Phân loại: {recurringTypeFilter}
              </Tag>
            )}

            <Button
              type="link"
              size="small"
              onClick={handleResetFilter}
              style={{ padding: 0, fontSize: 12 }}
            >
              Xóa tất cả
            </Button>
          </Flex>
        )}
      </Card>

      {/* Main Table */}
      <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden' }}>
        <Table<IFinanceRecurring>
          rowKey="id"
          size={isMobile ? 'small' : 'medium'}
          columns={columns}
          dataSource={filteredData}
          onRow={(record) => ({
            onClick: () => setViewRule(record),
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
              : (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
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
            <span>Bộ lọc định kỳ</span>
            {activeFilterCount > 0 && (
              <Button
                type="link"
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleResetFilter}
              >
                Đặt lại
              </Button>
            )}
          </Flex>
        }
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        onOk={() => setIsFilterModalOpen(false)}
        okText="Áp dụng"
        cancelText="Đóng"
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
              Thu / Chi
            </Text>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'income', label: 'Thu nhập' },
                { value: 'expense', label: 'Chi phí' },
              ]}
            />
          </div>

          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Tần suất (Frequency)
            </Text>
            <Select
              value={frequencyFilter}
              onChange={setFrequencyFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'Tất cả tần suất' },
                { value: 'MONTHLY', label: 'Hàng tháng' },
                { value: 'WEEKLY', label: 'Hàng tuần' },
                { value: 'EVERY_N_DAYS', label: 'Tùy chỉnh số ngày' },
              ]}
            />
          </div>

          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Phân loại (Recurring Type)
            </Text>
            <Select
              value={recurringTypeFilter}
              onChange={setRecurringTypeFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'Tất cả loại' },
                { value: 'BILL', label: 'Hóa đơn (Bill)' },
                { value: 'SUBSCRIPTION', label: 'Gói dịch vụ (Subscription)' },
                { value: 'SALARY', label: 'Lương (Salary)' },
                { value: 'OTHER', label: 'Khác (Other)' },
              ]}
            />
          </div>
        </Space>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal
        title="Chi tiết Cấu hình Định kỳ"
        open={!!viewRule}
        onCancel={() => setViewRule(null)}
        footer={[
          <Button key="close" onClick={() => setViewRule(null)}>
            Đóng
          </Button>,
        ]}
        width={560}
        centered
      >
        {viewRule && (
          <Space
            direction="vertical"
            style={{ width: '100%', marginTop: 12 }}
            size="large"
          >
            <Card
              size="small"
              style={{
                textAlign: 'center',
                backgroundColor:
                  viewRule.transactionType === 'income' ? '#f6ffed' : '#fff2f0',
                borderColor:
                  viewRule.transactionType === 'income' ? '#b7eb8f' : '#ffccc7',
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                SỐ TIỀN MỖI KỲ
              </Text>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color:
                    viewRule.transactionType === 'income'
                      ? '#52c41a'
                      : '#ff4d4f',
                }}
              >
                {viewRule.transactionType === 'income' ? '+' : '-'}
                {convertCurrency(viewRule.amount)}
              </Title>
            </Card>

            <Descriptions column={isMobile ? 1 : 2} bordered size="small">
              <Descriptions.Item label="Tên cấu hình" span={2}>
                <Text strong>{viewRule.name}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Loại">
                <Tag
                  color={
                    viewRule.transactionType === 'income' ? 'green' : 'volcano'
                  }
                >
                  {viewRule.transactionType.toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Phân loại">
                <Tag color="blue">{viewRule.recurringType}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ví liên kết">
                <Flex align="center" gap={6}>
                  <IconRenderer iconName={viewRule.wallet?.icon} size={14} />
                  <span>{viewRule.wallet?.name || '-'}</span>
                </Flex>
              </Descriptions.Item>

              <Descriptions.Item label="Danh mục">
                <Flex align="center" gap={6}>
                  <IconRenderer iconName={viewRule.category?.icon} size={14} />
                  <span>{viewRule.category?.name || '-'}</span>
                </Flex>
              </Descriptions.Item>

              <Descriptions.Item label="Chế độ chạy" span={2}>
                {viewRule.reminderOnly
                  ? 'Chỉ gửi nhắc nhở'
                  : viewRule.isAutoCreate
                    ? 'Tự động tạo giao dịch'
                    : 'Tạo thủ công'}
              </Descriptions.Item>

              <Descriptions.Item label="Lần thực thi tiếp">
                <Text style={{ fontSize: 12 }}>
                  {new Date(viewRule.nextRunAt).toLocaleString()}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Lần thực thi cuối">
                <Text style={{ fontSize: 12 }}>
                  {viewRule.lastRunAt
                    ? new Date(viewRule.lastRunAt).toLocaleString()
                    : 'Chưa chạy'}
                </Text>
              </Descriptions.Item>

              {viewRule.merchant && (
                <Descriptions.Item label="Merchant" span={2}>
                  {viewRule.merchant}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Space>
        )}
      </Modal>

      {/* Modal Add / Edit */}
      {showAddModal && (
        <AddRecurringModal
          open={showAddModal}
          initialValues={editingRule}
          onClose={() => {
            setShowAddModal(false)
            setEditingRule(null)
          }}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRule(null)
            setShowAddModal(true)
          }}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </Space>
  )
}
