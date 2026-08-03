import React, { useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  FloatButton,
  Grid,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  FlagOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { GoalSummary } from './_components/GoalSummary'
import { AddGoalModal } from './_components/AddGoalModal'
import { convertCurrency } from '@/shared/utils/helper/format-money'

// Enum khớp với Backend
export enum FINANCIAL_GOAL_TYPE {
  SAVINGS = 'SAVINGS',
  EMERGENCY_FUND = 'EMERGENCY_FUND',
  INVESTMENT = 'INVESTMENT',
  PURCHASE = 'PURCHASE',
  DEBT_PAYOFF = 'DEBT_PAYOFF',
  OTHER = 'OTHER',
}

export enum FINANCIAL_GOAL_STATUS {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export interface IFinancialGoal {
  id: number
  name: string
  description?: string
  type: FINANCIAL_GOAL_TYPE
  status: FINANCIAL_GOAL_STATUS
  targetAmount: number
  currentAmount: number
  deadline?: string | null
  imageUrl?: string | null
  isLocked: boolean
  autoContributionAmount?: number | null
  autoContributionDay?: number | null
}

const { Title, Text, Paragraph } = Typography
const { useBreakpoint } = Grid

export function Goals() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  // MOCK DATA (Gắn hook React Query/Service API tại đây)
  const [goals, setGoals] = useState<Array<IFinancialGoal>>([
    {
      id: 1,
      name: 'Quỹ khẩn cấp 6 tháng',
      description: 'Dự phòng cho rủi ro công việc và y tế',
      type: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND,
      status: FINANCIAL_GOAL_STATUS.ACTIVE,
      targetAmount: 100000000,
      currentAmount: 65000000,
      deadline: '2026-12-31T00:00:00.000Z',
      imageUrl:
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&q=80',
      isLocked: false,
      autoContributionAmount: 5000000,
      autoContributionDay: 10,
    },
    {
      id: 2,
      name: 'Mua xe Macan 2026',
      description: 'Tiết kiệm trả trước 50% xe',
      type: FINANCIAL_GOAL_TYPE.PURCHASE,
      status: FINANCIAL_GOAL_STATUS.ACTIVE,
      targetAmount: 1500000000,
      currentAmount: 450000000,
      deadline: '2027-06-30T00:00:00.000Z',
      imageUrl:
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&q=80',
      isLocked: true,
      autoContributionAmount: 20000000,
      autoContributionDay: 1,
    },
  ])

  // Filters state
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<IFinancialGoal | null>(null)
  const [viewGoal, setViewGoal] = useState<IFinancialGoal | null>(null)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (typeFilter !== 'all') count++
    if (statusFilter !== 'all') count++
    return count
  }, [typeFilter, statusFilter])

  const handleResetFilter = () => {
    setTypeFilter('all')
    setStatusFilter('all')
  }

  const filteredGoals = useMemo(() => {
    return goals.filter((item) => {
      if (
        search &&
        ![item.name, item.description || '']
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false
      }
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      return true
    })
  }, [goals, search, typeFilter, statusFilter])

  // Helper render Tag loại mục tiêu
  const renderTypeTag = (type: FINANCIAL_GOAL_TYPE) => {
    const map = {
      [FINANCIAL_GOAL_TYPE.SAVINGS]: { color: 'green', label: 'Tiết kiệm' },
      [FINANCIAL_GOAL_TYPE.EMERGENCY_FUND]: {
        color: 'red',
        label: 'Quỹ khẩn cấp',
      },
      [FINANCIAL_GOAL_TYPE.INVESTMENT]: { color: 'purple', label: 'Đầu tư' },
      [FINANCIAL_GOAL_TYPE.PURCHASE]: { color: 'blue', label: 'Mua sắm' },
      [FINANCIAL_GOAL_TYPE.DEBT_PAYOFF]: { color: 'orange', label: 'Trả nợ' },
      [FINANCIAL_GOAL_TYPE.OTHER]: { color: 'default', label: 'Khác' },
    }
    const target = map[type] || map[FINANCIAL_GOAL_TYPE.OTHER]
    return <Tag color={target.color}>{target.label}</Tag>
  }

  // Helper render Status Tag
  const renderStatusTag = (status: FINANCIAL_GOAL_STATUS) => {
    switch (status) {
      case FINANCIAL_GOAL_STATUS.ACTIVE:
        return <Tag color="processing">Đang thực hiện</Tag>
      case FINANCIAL_GOAL_STATUS.COMPLETED:
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Hoàn thành
          </Tag>
        )
      case FINANCIAL_GOAL_STATUS.PAUSED:
        return <Tag color="warning">Tạm dừng</Tag>
      case FINANCIAL_GOAL_STATUS.CANCELLED:
        return <Tag color="error">Đã hủy</Tag>
    }
  }

  // Tính toán Projection đơn giản hiển thị trong Modal Detail
  const calculateProjection = (goal: IFinancialGoal) => {
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)
    const rate = goal.autoContributionAmount || 0
    const monthsLeft = rate > 0 ? Math.ceil(remaining / rate) : null
    const pct =
      goal.targetAmount > 0
        ? Number(((goal.currentAmount / goal.targetAmount) * 100).toFixed(1))
        : 0

    return { remaining, rate, monthsLeft, pct }
  }

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
            Mục tiêu Tài chính
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Quản lý và theo dõi tiến độ tích lũy các kế hoạch tài chính
          </Text>
        </div>
        {!isMobile && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingGoal(null)
              setShowAddModal(true)
            }}
          >
            Thêm mục tiêu
          </Button>
        )}
      </Flex>

      {/* Summary Cards */}
      <GoalSummary goals={goals} />

      {/* Toolbar */}
      <Card size="small" styles={{ body: { padding: 12 } }}>
        <Flex gap={10} align="center">
          <Input
            placeholder="Tìm kiếm tên, mô tả mục tiêu..."
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

        {activeFilterCount > 0 && (
          <Flex wrap gap={6} style={{ marginTop: 10 }}>
            <Text type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
              Đang lọc theo:
            </Text>
            {typeFilter !== 'all' && (
              <Tag closable onClose={() => setTypeFilter('all')} color="blue">
                Loại: {typeFilter}
              </Tag>
            )}
            {statusFilter !== 'all' && (
              <Tag closable onClose={() => setStatusFilter('all')} color="blue">
                Trạng thái: {statusFilter}
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

      {/* Goal Cards Grid */}
      <Row gutter={[16, 16]}>
        {filteredGoals.map((goal) => {
          const percent = Math.min(
            Number(((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)),
            100,
          )

          return (
            <Col xs={24} sm={12} lg={8} key={goal.id}>
              <Card
                hoverable
                styles={{ body: { padding: 16 } }}
                actions={[
                  <Button
                    type="text"
                    key="view"
                    icon={<EyeOutlined />}
                    onClick={() => setViewGoal(goal)}
                  >
                    Chi tiết
                  </Button>,
                  <Button
                    type="text"
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingGoal(goal)
                      setShowAddModal(true)
                    }}
                  >
                    Sửa
                  </Button>,
                ]}
              >
                <Flex align="start" gap={12} style={{ marginBottom: 12 }}>
                  <Avatar
                    shape="square"
                    size={54}
                    src={goal.imageUrl}
                    icon={<FlagOutlined />}
                    style={{ flexShrink: 0, backgroundColor: '#1677ff' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Flex justify="space-between" align="start">
                      <Text strong style={{ fontSize: 16 }} ellipsis>
                        {goal.name}
                      </Text>
                      {goal.isLocked && (
                        <LockOutlined
                          style={{ color: '#faad14', marginLeft: 4 }}
                        />
                      )}
                    </Flex>
                    <Space size={4} wrap style={{ marginTop: 2 }}>
                      {renderTypeTag(goal.type)}
                      {renderStatusTag(goal.status)}
                    </Space>
                  </div>
                </Flex>

                {goal.description && (
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2 }}
                    style={{ fontSize: 12, marginBottom: 12, height: 36 }}
                  >
                    {goal.description}
                  </Paragraph>
                )}

                {/* Progress Bar */}
                <div style={{ marginBottom: 12 }}>
                  <Flex justify="space-between" style={{ marginBottom: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tiến độ
                    </Text>
                    <Text strong style={{ fontSize: 12 }}>
                      {percent}%
                    </Text>
                  </Flex>
                  <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  />
                </div>

                {/* Amounts display */}
                <Flex justify="space-between" align="baseline">
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: 11, display: 'block' }}
                    >
                      Đã tích lũy
                    </Text>
                    <Text
                      strong
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#10b981',
                      }}
                    >
                      {convertCurrency(goal.currentAmount)}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'end' }}>
                    <Text
                      type="secondary"
                      style={{ fontSize: 11, display: 'block' }}
                    >
                      Mục tiêu
                    </Text>
                    <Text
                      strong
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {convertCurrency(goal.targetAmount)}
                    </Text>
                  </div>
                </Flex>

                {/* Deadline Footer */}
                {goal.deadline && (
                  <>
                    <Divider style={{ margin: '12px 0 8px 0' }} />
                    <Flex align="center" gap={6}>
                      <CalendarOutlined
                        style={{ fontSize: 12, color: '#8c8c8c' }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Hạn chót: {new Date(goal.deadline).toLocaleDateString()}
                      </Text>
                    </Flex>
                  </>
                )}
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* FILTER MODAL */}
      <Modal
        title="Lọc Mục tiêu Tài chính"
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        onOk={() => setIsFilterModalOpen(false)}
        okText="Áp dụng"
        cancelText="Đóng"
        width={380}
        centered
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
              Phân loại mục tiêu
            </Text>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'Tất cả loại' },
                { value: FINANCIAL_GOAL_TYPE.SAVINGS, label: 'Tiết kiệm' },
                {
                  value: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND,
                  label: 'Quỹ khẩn cấp',
                },
                { value: FINANCIAL_GOAL_TYPE.INVESTMENT, label: 'Đầu tư' },
                { value: FINANCIAL_GOAL_TYPE.PURCHASE, label: 'Mua sắm' },
                { value: FINANCIAL_GOAL_TYPE.DEBT_PAYOFF, label: 'Trả nợ' },
                { value: FINANCIAL_GOAL_TYPE.OTHER, label: 'Khác' },
              ]}
            />
          </div>

          <div>
            <Text
              strong
              style={{ fontSize: 13, display: 'block', marginBottom: 6 }}
            >
              Trạng thái
            </Text>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                {
                  value: FINANCIAL_GOAL_STATUS.ACTIVE,
                  label: 'Đang thực hiện',
                },
                { value: FINANCIAL_GOAL_STATUS.COMPLETED, label: 'Hoàn thành' },
                { value: FINANCIAL_GOAL_STATUS.PAUSED, label: 'Tạm dừng' },
                { value: FINANCIAL_GOAL_STATUS.CANCELLED, label: 'Đã hủy' },
              ]}
            />
          </div>
        </Space>
      </Modal>

      {/* VIEW DETAILS & PROJECTION MODAL */}
      <Modal
        title="Chi tiết & Dự phóng Mục tiêu"
        open={!!viewGoal}
        onCancel={() => setViewGoal(null)}
        footer={[
          <Button key="close" onClick={() => setViewGoal(null)}>
            Đóng
          </Button>,
        ]}
        width={560}
        centered
      >
        {viewGoal &&
          (() => {
            const proj = calculateProjection(viewGoal)

            return (
              <Space
                direction="vertical"
                style={{ width: '100%', marginTop: 12 }}
                size="middle"
              >
                <Card
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundColor: '#f6ffed',
                    borderColor: '#b7eb8f',
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    TIẾN ĐỘ HIỆN TẠI
                  </Text>
                  <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                    {proj.pct}%
                  </Title>
                  <Progress
                    percent={proj.pct}
                    showInfo={false}
                    strokeColor="#52c41a"
                    style={{ marginTop: 8 }}
                  />
                </Card>

                {/* Thống kê Dự phóng (Projection) */}
                <Card
                  size="small"
                  title="Dự phóng hoàn thành (Projection)"
                  style={{ backgroundColor: '#fafafa' }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Còn phải tích lũy">
                      <Text strong style={{ color: '#cf1322' }}>
                        {convertCurrency(proj.remaining)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trích tự động hàng tháng">
                      <Text strong>
                        {proj.rate > 0
                          ? convertCurrency(proj.rate)
                          : 'Không thiết lập'}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian dự kiến còn lại">
                      <Text strong style={{ color: '#1677ff' }}>
                        {proj.monthsLeft !== null
                          ? `${proj.monthsLeft} tháng`
                          : 'Cần cài đặt mức trích hàng tháng'}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Thông tin chi tiết Entity */}
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="Tên mục tiêu" span={2}>
                    <Text strong>{viewGoal.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phân loại">
                    {renderTypeTag(viewGoal.type)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {renderStatusTag(viewGoal.status)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khóa chuyển tiền">
                    {viewGoal.isLocked ? 'Có' : 'Không'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày trích hàng tháng">
                    {viewGoal.autoContributionDay
                      ? `Ngày ${viewGoal.autoContributionDay}`
                      : '-'}
                  </Descriptions.Item>
                  {viewGoal.description && (
                    <Descriptions.Item label="Mô tả" span={2}>
                      {viewGoal.description}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Space>
            )
          })()}
      </Modal>

      {/* MODAL THÊM / SỬA */}
      {showAddModal && (
        <AddGoalModal
          open={showAddModal}
          initialValues={editingGoal}
          onClose={() => {
            setShowAddModal(false)
            setEditingGoal(null)
          }}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingGoal(null)
            setShowAddModal(true)
          }}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </Space>
  )
}
