// @/pages/goals/_components/GoalDetailModal.tsx
import React, { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  LockOutlined,
  PlusOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import type { IFinance_GoalHistory } from '@/shared/api/financial/goal/goal-history/goal-history.type'
import { FINANCIAL_GOAL_STATUS } from '@/shared/api/financial/goal/goal.enum'

import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useGetFinance_Goal_Detail } from '@/shared/api/financial/goal/goal-history/useGetFinance_Goal_Detail'
import { useGetFinance_Goal_Projection } from '@/shared/api/financial/goal/useGetFinance_Goal_Projection'
import { useMutationGoalHistory } from '@/shared/api/financial/goal/goal-history/goal.mutation'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'
import { FINANCIAL_GOAL_HISTORY_STATUS } from '@/shared/api/financial/goal/goal-history/goal-history.enum'

const { Title, Text } = Typography

interface GoalDetailModalProps {
  goal: IFinance_Goal | null
  onClose: () => void
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  // 1. TanStack Query Hooks
  const { data: detailRes, isLoading: isLoadingHistory } =
    useGetFinance_Goal_Detail({
      pathParams: { id: goal?.id || 0 },
      options: { enabled: !!goal?.id },
    })
  const historyList: Array<IFinance_GoalHistory> =
    detailRes?.data.histories || []

  const { data: projectionRes } = useGetFinance_Goal_Projection({
    pathParams: { id: goal?.id || 0 },
    queryParams: {
      monthlySavingRate: goal?.autoContributionAmount ?? 0,
    },
    options: { enabled: !!goal?.id },
  })

  const {
    mGoalHistory_ManualContribution,
    mGoalHistory_Complete,
    mGoalHistory_Skip,
  } = useMutationGoalHistory()
  const { mGoal_Cancel } = useMutationGoal()

  if (!goal) return null

  // Tính toán dự phóng (Projection)
  const targetAmount = Number(goal.targetAmount || 0)
  const currentAmount = Number(goal.currentAmount || 0)
  const remainingAmount = Math.max(targetAmount - currentAmount, 0)
  const monthlySaving = Number(goal.autoContributionAmount || 0)
  const pct =
    targetAmount > 0
      ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
      : 0
  const estimatedMonths =
    monthlySaving > 0 ? Math.ceil(remainingAmount / monthlySaving) : null

  const projection = projectionRes?.data
  const projectionRemaining = projection?.remainingAmount ?? remainingAmount
  const projectionMonthly = projection?.monthlyAmount ?? monthlySaving
  const projectionMonths =
    projection?.estimatedMonthsToTarget ?? estimatedMonths

  const refreshGoalQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['getFinanceGoalDetail', goal.id],
    })
    queryClient.invalidateQueries({
      queryKey: ['getFinanceGoalProjection', goal.id],
    })
    queryClient.invalidateQueries({ queryKey: ['getFinanceGoalList'] })
  }

  // Handle ghi nhận góp thêm vào goal
  const handleCreateTransaction = async (values: any) => {
    const amountVal = Number(values.amount)

    mGoalHistory_ManualContribution.mutate(
      {
        pathParams: { id: goal.id },
        body: {
          amount: amountVal,
          note: values.note || 'Ghi nhận tích lũy',
          period: dayjs().format('YYYY-MM'),
        },
      },
      {
        onSuccess: () => {
          message.success('Cập nhật biến động tiền thành công!')
          form.resetFields()
          setShowAddTransaction(false)
          refreshGoalQueries()
        },
        onError: (err: any) => {
          message.error(err?.message || 'Không thể thực hiện giao dịch!')
        },
      },
    )
  }

  const handleCompleteHistory = (history: IFinance_GoalHistory) => {
    const amount = Number(history.plannedAmount || history.amount || 0)

    if (amount <= 0) {
      message.error('Không có số tiền hợp lệ để hoàn thành.')
      return
    }

    mGoalHistory_Complete.mutate(
      {
        pathParams: { historyId: history.id },
        body: {
          amount,
          note: history.note || 'Hoàn thành từ giao diện',
        },
      },
      {
        onSuccess: () => {
          message.success('Đã hoàn thành khoản tích lũy.')
          refreshGoalQueries()
        },
        onError: () => message.error('Không thể hoàn thành lịch sử này.'),
      },
    )
  }

  const handleSkipHistory = (historyId: number) => {
    mGoalHistory_Skip.mutate(
      {
        pathParams: { historyId },
      },
      {
        onSuccess: () => {
          message.success('Đã bỏ qua lịch sử chờ.')
          refreshGoalQueries()
        },
        onError: () => message.error('Không thể bỏ qua lịch sử này.'),
      },
    )
  }

  const handleCancelGoal = () => {
    mGoal_Cancel.mutate(
      { pathParams: { id: goal.id } },
      {
        onSuccess: () => {
          message.success('Đã hủy mục tiêu.')
          refreshGoalQueries()
        },
        onError: () => message.error('Không thể hủy mục tiêu.'),
      },
    )
  }

  // Column Bảng Lịch sử
  const historyColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) =>
        date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Loại',
      dataIndex: 'amount',
      key: 'type',
      render: (amount: number) =>
        amount >= 0 ? (
          <Tag color="green" icon={<ArrowUpOutlined />}>
            Nạp tiền
          </Tag>
        ) : (
          <Tag color="red" icon={<ArrowDownOutlined />}>
            Rút tiền
          </Tag>
        ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => (
        <Text strong style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {val >= 0 ? '+' : ''}
          {convertCurrency(val)}
        </Text>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (note?: string) => note || <Text type="secondary">-</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: FINANCIAL_GOAL_HISTORY_STATUS) => {
        if (status === FINANCIAL_GOAL_HISTORY_STATUS.PENDING) {
          return <Tag color="gold">Chờ xử lý</Tag>
        }
        if (status === FINANCIAL_GOAL_HISTORY_STATUS.COMPLETED) {
          return <Tag color="green">Hoàn thành</Tag>
        }
        return <Tag color="default">Đã bỏ qua</Tag>
      },
    },
    {
      title: '',
      key: 'action',
      width: 160,
      render: (_: any, record: IFinance_GoalHistory) =>
        record.status === FINANCIAL_GOAL_HISTORY_STATUS.PENDING ? (
          <Space size={4}>
            <Button
              size="small"
              type="primary"
              onClick={() => handleCompleteHistory(record)}
              loading={mGoalHistory_Complete.isPending}
            >
              Hoàn thành
            </Button>
            <Popconfirm
              title="Bỏ qua lịch sử này?"
              onConfirm={() => handleSkipHistory(record.id)}
              okText="Bỏ qua"
              cancelText="Hủy"
            >
              <Button size="small" danger loading={mGoalHistory_Skip.isPending}>
                Bỏ qua
              </Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ]

  return (
    <Modal
      open={!!goal}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      destroyOnClose
      title={
        <Space size="middle">
          <Avatar
            src={goal.imageUrl}
            icon={!goal.imageUrl && <TrophyOutlined />}
            style={{ backgroundColor: '#1677ff20', color: '#1677ff' }}
          />
          <div>
            <Text strong style={{ fontSize: 16 }}>
              {goal.name}
            </Text>
            {goal.isLocked && (
              <LockOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
            )}
          </div>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '📊 Tổng quan & Dự phóng',
            children: (
              <Space
                direction="vertical"
                style={{ width: '100%', marginTop: 8 }}
                size="middle"
              >
                {/* Progress Visual */}
                <Card
                  size="small"
                  style={{ background: '#fafafa', textAlign: 'center' }}
                >
                  <Progress
                    type="circle"
                    percent={pct}
                    strokeColor="#10b981"
                    size={100}
                  />
                  <div style={{ marginTop: 12 }}>
                    <Title level={3} style={{ margin: 0 }}>
                      {convertCurrency(currentAmount)}
                    </Title>
                    <Text type="secondary">
                      Mục tiêu: {convertCurrency(targetAmount)}
                    </Text>
                  </div>
                </Card>

                {/* Projection Statistics */}
                <Card size="small" title="⚡ Dự phóng hoàn thành">
                  <Descriptions column={2} size="small" bordered>
                    <Descriptions.Item label="Còn lại">
                      <Text type="danger" strong>
                        {convertCurrency(projectionRemaining)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trích hàng tháng">
                      {projectionMonthly > 0
                        ? convertCurrency(projectionMonthly)
                        : 'Chưa đặt'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dự kiến hoàn thành" span={2}>
                      <Text strong style={{ color: '#1677ff' }}>
                        {projectionMonths !== null
                          ? `Còn khoảng ${projectionMonths} tháng`
                          : 'Cần cài đặt số tiền trích hàng tháng'}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Details */}
                <Descriptions column={2} size="small" title="Chi tiết cài đặt">
                  <Descriptions.Item label="Phân loại">
                    <Tag color="blue">{goal.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={
                        goal.status === FINANCIAL_GOAL_STATUS.COMPLETED
                          ? 'success'
                          : 'processing'
                      }
                      text={goal.status}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày trích tiền">
                    {goal.autoContributionDay
                      ? `Ngày ${goal.autoContributionDay} hàng tháng`
                      : 'Không'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hạn chót (Deadline)">
                    {goal.deadline
                      ? dayjs(goal.deadline).format('DD/MM/YYYY')
                      : 'Không giới hạn'}
                  </Descriptions.Item>
                </Descriptions>
                {goal.status === FINANCIAL_GOAL_STATUS.ACTIVE && (
                  <Button
                    danger
                    block
                    onClick={handleCancelGoal}
                    loading={mGoal_Cancel.isPending}
                  >
                    Hủy mục tiêu
                  </Button>
                )}
              </Space>
            ),
          },
          {
            key: 'history',
            label: `📜 Lịch sử tích lũy (${historyList.length})`,
            children: (
              <Space
                direction="vertical"
                style={{ width: '100%', marginTop: 8 }}
                size="middle"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text strong>Nhật ký biến động</Text>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddTransaction(!showAddTransaction)}
                  >
                    {showAddTransaction ? 'Hủy' : 'Ghi nhận giao dịch'}
                  </Button>
                </div>

                {/* Deposit / Withdraw Form */}
                {showAddTransaction && (
                  <Card
                    size="small"
                    style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleCreateTransaction}
                    >
                      <Space style={{ display: 'flex' }} align="start">
                        <Form.Item
                          name="amount"
                          label="Số tiền góp thêm"
                          rules={[{ required: true, message: 'Nhập số tiền' }]}
                          style={{ flex: 1 }}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={1000}
                            suffix="VND"
                            formatter={(val) =>
                              `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(val) =>
                              val?.replace(/\$\s?|(,*)/g, '') as any
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          name="note"
                          label="Ghi chú"
                          style={{ flex: 2 }}
                        >
                          <Input placeholder="Lý do góp thêm..." />
                        </Form.Item>
                      </Space>

                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={mGoalHistory_ManualContribution.isPending}
                        block
                      >
                        Xác nhận
                      </Button>
                    </Form>
                  </Card>
                )}

                {/* History Table */}
                <Table
                  dataSource={historyList}
                  columns={historyColumns}
                  rowKey="id"
                  size="small"
                  loading={isLoadingHistory}
                  pagination={{ pageSize: 5 }}
                />
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  )
}
