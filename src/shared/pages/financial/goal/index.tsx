import React, { useState } from 'react'
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { GoalCard } from './_components/GoalCard'
import { GoalModal } from './_components/GoalModal'
import type { IWallet_Goal } from '@/shared/api/financial/goal/goal.type'
import { useGetWallet_Goal_List } from '@/shared/api/financial/goal/useGetWallet_Category_List'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Title, Text } = Typography

export function Goals() {
  const { data } = useGetWallet_Goal_List({})
  const goals: Array<IWallet_Goal> = data?.data ?? []
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<IWallet_Goal | null>(null)

  // Stats Calculations
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0)
  const completed = goals.filter(
    (g) => g.currentAmount >= g.targetAmount,
  ).length
  const lockedFunds = goals
    .filter((g) => g.isLocked)
    .reduce((s, g) => s + g.currentAmount, 0)
  const overallPct =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  const handleSave = (goal: IWallet_Goal) => {
    if (editingGoal) {
      // setGoals((prev) => prev.map((x) => (x.id === goal.id ? goal : x)))
    } else {
      // setGoals((prev) => [...prev, goal])
    }
    setModalOpen(false)
    setEditingGoal(null)
  }

  const handleDelete = (id: string) => {
    // setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const handleOpenAddModal = () => {
    setEditingGoal(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (goal: IWallet_Goal) => {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  return (
    <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Financial Goals
          </Title>
          <Text type="secondary">
            Track your savings targets and milestones
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAddModal}
          style={{ borderRadius: 10 }}
        >
          New Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic
              title={
                <Space>
                  <Text>💰 Total Saved</Text>
                </Space>
              }
              value={convertCurrency(totalSaved)}
              suffix={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  of {convertCurrency(totalTarget)}
                </Text>
              }
              valueStyle={{ color: '#6366f1', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic
              title={
                <Space>
                  <Text>📈 Overall Progress</Text>
                </Space>
              }
              value={`${overallPct}%`}
              suffix={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  completion
                </Text>
              }
              valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic
              title={
                <Space>
                  <Text>🏆 Goals Completed</Text>
                </Space>
              }
              value={`${completed}/${goals.length}`}
              suffix={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  active goals
                </Text>
              }
              valueStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16 }}>
            <Statistic
              title={
                <Space>
                  <Text>🔒 Locked Funds</Text>
                </Space>
              }
              value={convertCurrency(lockedFunds)}
              suffix={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  emergency
                </Text>
              }
              valueStyle={{ color: '#ef4444', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Goals Grid */}
      <Row gutter={[16, 16]}>
        {goals.map((goal) => (
          <Col xs={24} md={12} key={goal.id}>
            <GoalCard
              goal={goal}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          </Col>
        ))}

        {/* Add Goal Card Placeholder */}
        <Col xs={24} md={12}>
          <Card
            hoverable
            onClick={handleOpenAddModal}
            style={{
              borderRadius: 16,
              borderStyle: 'dashed',
              height: '100%',
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Space vertical align="center" size="small">
              <Button
                type="dashed"
                shape="circle"
                icon={<PlusOutlined />}
                size="large"
              />
              <Text type="secondary" style={{ fontWeight: 500 }}>
                Add New Goal
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Goal Form Modal */}
      <GoalModal
        open={modalOpen}
        initial={editingGoal}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false)
          setEditingGoal(null)
        }}
      />
    </div>
  )
}
