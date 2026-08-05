import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  FloatButton,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  CheckCircleOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { GoalSummary } from './_components/GoalSummary'
import { AddGoalModal } from './_components/AddGoalModal'
import { GoalCard } from './_components/GoalCard' // Import GoalCard mới
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import {
  FINANCIAL_GOAL_STATUS,
  FINANCIAL_GOAL_TYPE,
} from '@/shared/api/financial/goal/goal.enum'
import { useGetFinance_Goal_List } from '@/shared/api/financial/goal/useGetFinance_Category_List'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

export function Goals() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  // 1. TanStack Query Hooks
  const { data: goalData, isLoading } = useGetFinance_Goal_List({})
  const goals: Array<IFinance_Goal> = goalData?.data || []

  const { mGoal_Delete } = useMutationGoal()

  // Filters state
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<IFinance_Goal | null>(null)
  const [viewGoal, setViewGoal] = useState<IFinance_Goal | null>(null)

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

  const handleDelete = (id: number) => {
    mGoal_Delete.mutate(
      {
        pathParams: {
          id,
        },
      },
      {
        onSuccess: () => {
          message.success('Xóa mục tiêu thành công!')
        },
        onError: () => {
          message.error('Có lỗi xảy ra khi xóa!')
        },
      },
    )
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

  // Helper Tag Loại mục tiêu
  const renderTypeTag = (type: FINANCIAL_GOAL_TYPE) => {
    const map: Record<FINANCIAL_GOAL_TYPE, { color: string; label: string }> = {
      [FINANCIAL_GOAL_TYPE.EMERGENCY_FUND]: {
        color: 'red',
        label: 'Quỹ khẩn cấp',
      },
      [FINANCIAL_GOAL_TYPE.BIG_PURCHASE]: {
        color: 'blue',
        label: 'Mua sắm lớn',
      },
      [FINANCIAL_GOAL_TYPE.TRAVEL]: { color: 'green', label: 'Du lịch' },
      [FINANCIAL_GOAL_TYPE.OTHER]: { color: 'default', label: 'Khác' },
    }
    const target = map[type]
    return <Tag color={target.color}>{target.label}</Tag>
  }

  // Helper Status Tag
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
    }
  }

  // Tính toán Projection khớp với logic FinancialGoalService backend
  const calculateProjection = (goal: IFinance_Goal) => {
    const targetAmount = Number(goal.targetAmount)
    const currentAmount = Number(goal.currentAmount)
    const remainingAmount = Math.max(targetAmount - currentAmount, 0)
    const monthlySavingRate = Number(goal.autoContributionAmount ?? 0)

    const estimatedMonthsToComplete =
      monthlySavingRate > 0
        ? Math.ceil(remainingAmount / monthlySavingRate)
        : null

    const progressPercentage =
      targetAmount > 0
        ? Number(((currentAmount / targetAmount) * 100).toFixed(2))
        : 0

    return {
      remainingAmount,
      monthlySavingRate,
      estimatedMonthsToComplete,
      progressPercentage,
    }
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </Flex>
    )
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

      {/* Goal Cards Grid sử dụng GoalCard Component mới */}
      <Row gutter={[16, 16]}>
        {filteredGoals.map((goal) => (
          <Col xs={24} sm={12} lg={8} key={goal.id}>
            <GoalCard
              goal={goal}
              onEdit={(item) => {
                setEditingGoal(item)
                setShowAddModal(true)
              }}
              onDelete={(id) => handleDelete(Number(id))}
            />
          </Col>
        ))}
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
                {
                  value: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND,
                  label: 'Quỹ khẩn cấp',
                },
                {
                  value: FINANCIAL_GOAL_TYPE.BIG_PURCHASE,
                  label: 'Mua sắm lớn',
                },
                { value: FINANCIAL_GOAL_TYPE.TRAVEL, label: 'Du lịch' },
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
                    {proj.progressPercentage}%
                  </Title>
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
                        {convertCurrency(proj.remainingAmount)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trích tự động hàng tháng">
                      <Text strong>
                        {proj.monthlySavingRate > 0
                          ? convertCurrency(proj.monthlySavingRate)
                          : 'Không thiết lập'}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian dự kiến còn lại">
                      <Text strong style={{ color: '#1677ff' }}>
                        {proj.estimatedMonthsToComplete !== null
                          ? `${proj.estimatedMonthsToComplete} tháng`
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
