import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  FloatButton,
  Grid,
  Input,
  Row,
  Segmented,
  Select,
  Spin,
  Typography,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { GoalSummary } from './_components/GoalSummary'
import { AddGoalModal } from './_components/AddGoalModal'
import { GoalCard } from './_components/GoalCard'
import { GoalDetailModal } from './_components/GoalDetailModal'
import { GoalMoneyModal } from './_components/GoalMoneyModal'
import { daysToDeadline } from './goal.utils'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import type { FINANCIAL_GOAL_TYPE } from '@/shared/api/financial/goal/goal.enum'
import {
  FINANCIAL_GOAL_STATUS,
  FinancialGoalStatusHelper,
  FinancialGoalTypeHelper,
} from '@/shared/api/financial/goal/goal.enum'
import { useGetFinance_Goal_List } from '@/shared/api/financial/goal/useGetFinance_Category_List'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

type StatusFilter = 'all' | FINANCIAL_GOAL_STATUS

const STATUS_ORDER: Array<FINANCIAL_GOAL_STATUS> = [
  FINANCIAL_GOAL_STATUS.ACTIVE,
  FINANCIAL_GOAL_STATUS.INACTIVE,
  FINANCIAL_GOAL_STATUS.COMPLETED,
  FINANCIAL_GOAL_STATUS.CANCELLED,
]

/**
 * Đang thực hiện lên trước (hạn gần nhất trước, không hạn xếp sau),
 * rồi tạm dừng → hoàn thành → đã hủy; cùng nhóm thì mới tạo trước.
 */
const compareGoals = (a: IFinance_Goal, b: IFinance_Goal) => {
  const s = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  if (s !== 0) return s
  const da = daysToDeadline(a) ?? Infinity
  const db = daysToDeadline(b) ?? Infinity
  if (da !== db) return da - db
  return String(b.createdAt).localeCompare(String(a.createdAt))
}

export function Goals() {
  const { t } = useTranslation('finance')
  const { message, modal } = App.useApp()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { data: goalData, isLoading } = useGetFinance_Goal_List({})
  const goals: Array<IFinance_Goal> = goalData?.data || []
  const { data: walletRes, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const { mGoal_Delete } = useMutationGoal()

  // Bộ lọc
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<FINANCIAL_GOAL_TYPE | 'all'>(
    'all',
  )
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<IFinance_Goal | null>(null)
  const [detailGoal, setDetailGoal] = useState<IFinance_Goal | null>(null)
  const [contributeGoal, setContributeGoal] = useState<IFinance_Goal | null>(
    null,
  )

  // Lọc theo tìm kiếm + loại trước, đếm theo trạng thái sau
  const baseFiltered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return goals.filter(
      (g) =>
        (typeFilter === 'all' || g.type === typeFilter) &&
        (!keyword ||
          `${g.name} ${g.description ?? ''}`.toLowerCase().includes(keyword)),
    )
  }, [goals, search, typeFilter])

  const visible = useMemo(
    () =>
      baseFiltered
        .filter((g) => statusFilter === 'all' || g.status === statusFilter)
        .sort(compareGoals),
    [baseFiltered, statusFilter],
  )

  const countOf = (s: StatusFilter) =>
    s === 'all'
      ? baseFiltered.length
      : baseFiltered.filter((g) => g.status === s).length

  const openCreate = () => {
    setEditingGoal(null)
    setShowAddModal(true)
  }

  const confirmDelete = (goal: IFinance_Goal) =>
    modal.confirm({
      title: t('goal.deleteTitle'),
      content: t('goal.deleteDescription'),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: async () => {
        await mGoal_Delete.mutateAsync({ pathParams: { id: goal.id } })
        message.success(t('goal.deleteSuccess'))
      },
    })

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <div
      style={{
        padding: isMobile ? 12 : 24,
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-end" gap={12} wrap>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {t('goal.title')}
          </Title>
          <Text type="secondary">{t('goal.subtitle')}</Text>
        </div>
        {!isMobile && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('goal.add')}
          </Button>
        )}
      </Flex>

      <GoalSummary goals={goals} />

      {/* Lọc: trạng thái + tìm kiếm + loại (một hàng) */}
      <Flex justify="space-between" align="center" gap={12} wrap>
        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Segmented<StatusFilter>
            value={statusFilter}
            onChange={setStatusFilter}
            options={(['all', ...STATUS_ORDER] as Array<StatusFilter>).map(
              (s) => ({
                value: s,
                label: `${
                  s === 'all'
                    ? t('goal.allStatuses')
                    : FinancialGoalStatusHelper.getLabel(s)
                } (${countOf(s)})`,
              }),
            )}
          />
        </div>
        <Flex gap={8} wrap style={{ flex: isMobile ? '1 1 100%' : undefined }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={t('goal.searchPlaceholder')}
            aria-label={t('goal.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: isMobile ? '100%' : 260 }}
          />
          <Select
            aria-label={t('goal.type')}
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: isMobile ? '100%' : 180 }}
            options={[
              { value: 'all', label: t('goal.allTypes') },
              ...FinancialGoalTypeHelper.getOptions(),
            ]}
          />
        </Flex>
      </Flex>

      {/* Danh sách */}
      {visible.length === 0 ? (
        <Card>
          <Empty
            description={
              goals.length === 0 ? t('goal.empty') : t('goal.emptyFiltered')
            }
          >
            {goals.length === 0 && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreate}
              >
                {t('goal.add')}
              </Button>
            )}
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {visible.map((goal) => (
            <Col xs={24} sm={12} xl={8} key={goal.id}>
              <GoalCard
                goal={goal}
                onView={setDetailGoal}
                onEdit={(g) => {
                  setEditingGoal(g)
                  setShowAddModal(true)
                }}
                onDelete={confirmDelete}
                onContribute={setContributeGoal}
              />
            </Col>
          ))}
        </Row>
      )}

      <GoalDetailModal
        goal={detailGoal}
        onClose={() => setDetailGoal(null)}
        onEdit={(g) => {
          setDetailGoal(null)
          setEditingGoal(g)
          setShowAddModal(true)
        }}
      />

      {contributeGoal && (
        <GoalMoneyModal
          open
          mode="contribute"
          goal={contributeGoal}
          wallets={walletRes?.data ?? []}
          isLoadingWallets={isLoadingWallets}
          onClose={() => setContributeGoal(null)}
        />
      )}

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

      {isMobile && (
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          aria-label={t('goal.add')}
          onClick={openCreate}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </div>
  )
}
