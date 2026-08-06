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
  Radio,
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
  DeleteOutlined,
  LockOutlined,
  PlusOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import type { IFinance_GoalHistory } from '@/shared/api/financial/goal/goal-history/goal-history.type'
import { FINANCIAL_GOAL_STATUS } from '@/shared/api/financial/goal/goal.enum'

import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useGetFinance_Goal_History_List } from '@/shared/api/financial/goal/goal-history/useGetFinance_Goal_History_List'
import { useMutationGoalHistory } from '@/shared/api/financial/goal/goal-history/goal.mutation'
import {
  FINANCIAL_GOAL_HISTORY_SOURCE,
  FINANCIAL_GOAL_HISTORY_STATUS,
} from '@/shared/api/financial/goal/goal-history/goal-history.enum'

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

  // 1. TanStack Query Hooks
  const { data: historyRes, isLoading: isLoadingHistory } =
    useGetFinance_Goal_History_List({
      pathParams: { goalId: goal?.id || 0 },
      options: { enabled: !!goal?.id },
    })
  const historyList: Array<IFinance_GoalHistory> = historyRes?.data || []

  const { mGoalHistory_Create, mGoalHistory_Delete } = useMutationGoalHistory()

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

  // Handle Tạo Giao dịch Lịch sử Nạp/Rút
  const handleCreateTransaction = async (values: any) => {
    const isDeposit = values.type === 'DEPOSIT'
    const amountVal = Number(values.amount)

    mGoalHistory_Create.mutate(
      {
        body: {
          goalId: goal.id,
          period: dayjs().format('YYYY-MM'),
          plannedAmount: goal.autoContributionAmount || 0,
          amount: isDeposit ? amountVal : -amountVal,
          source: FINANCIAL_GOAL_HISTORY_SOURCE.USER,
          status: FINANCIAL_GOAL_HISTORY_STATUS.COMPLETED,
          note: values.note || (isDeposit ? 'Nạp tiền tích lũy' : 'Rút tiền'),
          completedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          message.success('Cập nhật biến động tiền thành công!')
          form.resetFields()
          setShowAddTransaction(false)
        },
        onError: (err: any) => {
          message.error(err?.message || 'Không thể thực hiện giao dịch!')
        },
      },
    )
  }

  // Handle Xóa lịch sử
  const handleDeleteHistory = (historyId: number) => {
    mGoalHistory_Delete.mutate(
      { pathParams: { id: historyId } },
      {
        onSuccess: () => message.success('Xóa bản ghi lịch sử thành công!'),
        onError: () => message.error('Xóa thất bại!'),
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
      title: '',
      key: 'action',
      width: 50,
      render: (_: any, record: IFinance_GoalHistory) => (
        <Popconfirm
          title="Xóa lịch sử này?"
          onConfirm={() => handleDeleteHistory(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={mGoalHistory_Delete.isPending}
          />
        </Popconfirm>
      ),
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
                        {convertCurrency(remainingAmount)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trích hàng tháng">
                      {monthlySaving > 0
                        ? convertCurrency(monthlySaving)
                        : 'Chưa đặt'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dự kiến hoàn thành" span={2}>
                      <Text strong style={{ color: '#1677ff' }}>
                        {estimatedMonths !== null
                          ? `Còn khoảng ${estimatedMonths} tháng`
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
                      <Form.Item
                        name="type"
                        initialValue="DEPOSIT"
                        rules={[{ required: true }]}
                      >
                        <Radio.Group buttonStyle="solid">
                          <Radio.Button value="DEPOSIT">Nạp vào</Radio.Button>
                          <Radio.Button
                            value="WITHDRAW"
                            disabled={goal.isLocked}
                          >
                            Rút ra {goal.isLocked && '(Đã khóa)'}
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>

                      <Space style={{ display: 'flex' }} align="start">
                        <Form.Item
                          name="amount"
                          label="Số tiền"
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
                          <Input placeholder="Lý do nạp/rút..." />
                        </Form.Item>
                      </Space>

                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={mGoalHistory_Create.isPending}
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
