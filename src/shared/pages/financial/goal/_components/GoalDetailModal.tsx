import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  App,
  Avatar,
  Badge,
  Button,
  Col,
  Descriptions,
  Empty,
  Flex,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  EditOutlined,
  LockOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  canCancel,
  canContribute,
  canWithdraw,
  goalAmounts,
} from '../goal.utils'
import { GoalMoneyModal } from './GoalMoneyModal'
import { GoalCancelModal } from './GoalCancelModal'
import type { GoalMoneyMode } from './GoalMoneyModal'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import type { IFinance_GoalHistory } from '@/shared/api/financial/goal/goal-history/goal-history.type'
import {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_STATUS,
  FinancialGoalSavingModeHelper,
  FinancialGoalStatusHelper,
  FinancialGoalTypeHelper,
} from '@/shared/api/financial/goal/goal.enum'
import {
  FINANCIAL_GOAL_HISTORY_SOURCE,
  FINANCIAL_GOAL_HISTORY_STATUS,
  FINANCIAL_GOAL_HISTORY_TYPE,
  FinancialGoalHistoryStatusHelper,
  FinancialGoalHistoryTypeHelper,
} from '@/shared/api/financial/goal/goal-history/goal-history.enum'
import { useGetFinance_Goal_Detail } from '@/shared/api/financial/goal/goal-history/useGetFinance_Goal_Detail'
import { useGetFinance_Goal_Projection } from '@/shared/api/financial/goal/useGetFinance_Goal_Projection'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'
import { useMutationGoalHistory } from '@/shared/api/financial/goal/goal-history/goal.mutation'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Title, Text } = Typography

/** Số dòng lịch sử hiện sẵn trước khi bấm "Xem thêm" */
const HISTORY_PAGE = 8

/** Ô thông số nhỏ trong phần Tổng quan */
const StatTile: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => {
  const { mode } = useThemeMode()
  const { radius, border } = getTokens(mode)
  return (
    <div
      style={{
        height: '100%',
        padding: '12px 14px',
        borderRadius: radius.md,
        border: `1px solid ${border.light}`,
      }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
        {label}
      </Text>
      {children}
    </div>
  )
}

interface GoalDetailModalProps {
  /** Mục tiêu được chọn từ danh sách — chỉ dùng id + hiển thị tạm khi đang tải */
  goal: IFinance_Goal | null
  onClose: () => void
  /** Mở form sửa (đóng modal chi tiết ở phía cha nếu cần) */
  onEdit?: (goal: IFinance_Goal) => void
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal: selected,
  onClose,
  onEdit,
}) => {
  const { t } = useTranslation('finance')
  const { message } = App.useApp()
  const { mode } = useThemeMode()
  const { colors, radius, border, state } = getTokens(mode)

  const [activeTab, setActiveTab] = useState('overview')
  const [moneyMode, setMoneyMode] = useState<GoalMoneyMode | null>(null)
  const [pending, setPending] = useState<IFinance_GoalHistory | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [historyLimit, setHistoryLimit] = useState(HISTORY_PAGE)

  const goalId = selected?.id || 0
  const { data: detailRes, isLoading } = useGetFinance_Goal_Detail({
    pathParams: { id: goalId },
    options: { enabled: !!goalId },
  })
  // Dự phóng theo đúng cấu hình mục tiêu (không ép monthlySavingRate)
  const { data: projectionRes } = useGetFinance_Goal_Projection({
    pathParams: { id: goalId },
    options: { enabled: !!goalId },
  })
  const { data: walletRes, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const { mGoal_Pause, mGoal_Resume } = useMutationGoal()
  const { mGoalHistory_Skip } = useMutationGoalHistory()

  if (!selected) return null

  // Luôn hiển thị dữ liệu mới nhất từ API chi tiết (sau góp/rút/xác nhận)
  const goal = detailRes?.data.goal ?? selected
  const histories = detailRes?.data.histories ?? []
  const pendingList = histories.filter(
    (h) => h.status === FINANCIAL_GOAL_HISTORY_STATUS.PENDING,
  )
  const otherHistories = histories.filter(
    (h) => h.status !== FINANCIAL_GOAL_HISTORY_STATUS.PENDING,
  )
  const wallets = walletRes?.data ?? []
  const projection = projectionRes?.data
  const { current, target, remaining, percent } = goalAmounts(goal)
  const isPaused = goal.status === FINANCIAL_GOAL_STATUS.INACTIVE
  const done = goal.status === FINANCIAL_GOAL_STATUS.COMPLETED
  const accent = done ? colors.success : colors.primary
  const isAuto = goal.savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO

  const openMoney = (
    m: GoalMoneyMode,
    history: IFinance_GoalHistory | null = null,
  ) => {
    setPending(history)
    setMoneyMode(m)
  }

  const togglePause = async () => {
    if (isPaused) {
      await mGoal_Resume.mutateAsync({ pathParams: { id: goal.id } })
      message.success(t('goal.resumeSuccess'))
    } else {
      await mGoal_Pause.mutateAsync({ pathParams: { id: goal.id } })
      message.success(t('goal.pauseSuccess'))
    }
  }

  const skip = async (history: IFinance_GoalHistory) => {
    await mGoalHistory_Skip.mutateAsync({
      pathParams: { historyId: history.id },
    })
    message.success(t('goal.skipSuccess'))
  }

  const estimateTile = () => {
    if (!projection) return <Text>-</Text>
    if (projection.remainingAmount === 0)
      return <Text strong>{t('goal.achieved')}</Text>
    if (
      projection.estimatedMonthsToTarget === null ||
      !projection.estimatedCompletionDate
    ) {
      return <Text type="secondary">{t('goal.noEstimate')}</Text>
    }
    return (
      <>
        <Text strong style={{ display: 'block' }}>
          {dayjs(projection.estimatedCompletionDate).format('MM/YYYY')}
        </Text>
        <Text type="secondary">
          {t('goal.monthsShort', {
            months: projection.estimatedMonthsToTarget,
          })}
        </Text>
      </>
    )
  }

  const deadlineTile = () => {
    if (!goal.deadline) return <Text>{t('goal.noDeadline')}</Text>
    const showPace =
      projection &&
      projection.requiredMonthlyAmount !== null &&
      projection.remainingAmount > 0
    return (
      <>
        <Flex align="center" gap={6} wrap>
          <Text strong>{dayjs(goal.deadline).format('DD/MM/YYYY')}</Text>
          {showPace && projection.onTrack !== null && (
            <Tag
              color={projection.onTrack ? 'success' : 'warning'}
              style={{ margin: 0 }}
            >
              {projection.onTrack ? t('goal.onTrack') : t('goal.offTrack')}
            </Tag>
          )}
        </Flex>
        {showPace && (
          <Text type="secondary">
            {t('goal.needMonthly', {
              amount: convertCurrency(projection.requiredMonthlyAmount ?? 0),
            })}
          </Text>
        )}
      </>
    )
  }

  // ───────── Tổng quan ─────────
  const withdrawDisabled = !canWithdraw(goal) || goal.isLocked
  const withdrawButton = (
    <Button disabled={withdrawDisabled} onClick={() => openMoney('withdraw')}>
      {t('goal.withdraw')}
    </Button>
  )

  const overview = (
    <Space vertical size="middle" style={{ width: '100%', marginTop: 4 }}>
      {pendingList.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={t('goal.pendingAlert', { count: pendingList.length })}
          action={
            <Button size="small" onClick={() => setActiveTab('history')}>
              {t('goal.viewPending')}
            </Button>
          }
        />
      )}
      {isPaused && (
        <Alert type="info" showIcon message={t('goal.pausedHint')} />
      )}

      {/* Khối tiến độ */}
      <div
        style={{
          padding: 20,
          borderRadius: radius.lg,
          background: state.hover,
        }}
      >
        <Flex justify="space-between" align="baseline" gap={12} wrap>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {convertCurrency(current)}
            </Title>
            <Text type="secondary">
              {t('goal.ofTarget', { target: convertCurrency(target) })}
            </Text>
          </div>
          <Title level={3} style={{ margin: 0, color: accent.text }}>
            {Math.round(percent)}%
          </Title>
        </Flex>
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          aria-label={goal.name}
          style={{
            height: 10,
            margin: '12px 0 8px',
            borderRadius: 5,
            background: accent.soft,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              borderRadius: 5,
              background: accent.base,
            }}
          />
        </div>
        <Text type={remaining === 0 ? 'success' : 'secondary'}>
          {remaining === 0
            ? t('goal.achieved')
            : t('goal.remaining', { amount: convertCurrency(remaining) })}
        </Text>
      </div>

      {/* Thao tác */}
      <Flex gap={8} wrap>
        <Button
          type="primary"
          disabled={!canContribute(goal)}
          onClick={() => openMoney('contribute')}
        >
          {t('goal.contribute')}
        </Button>
        {goal.isLocked && canWithdraw(goal) ? (
          <Tooltip title={t('goal.lockedHint')}>{withdrawButton}</Tooltip>
        ) : (
          withdrawButton
        )}
        {(goal.status === FINANCIAL_GOAL_STATUS.ACTIVE || isPaused) && (
          <Button
            loading={mGoal_Pause.isPending || mGoal_Resume.isPending}
            onClick={togglePause}
          >
            {isPaused ? t('goal.resume') : t('goal.pause')}
          </Button>
        )}
        {onEdit && (
          <Button icon={<EditOutlined />} onClick={() => onEdit(goal)}>
            {t('common.edit')}
          </Button>
        )}
        {canCancel(goal) && (
          <Button
            danger
            type="text"
            style={{ marginLeft: 'auto' }}
            onClick={() => setCancelOpen(true)}
          >
            {t('goal.cancelGoal')}
          </Button>
        )}
      </Flex>

      {/* Thông số */}
      <Row gutter={[12, 12]}>
        <Col xs={12} md={6}>
          <StatTile label={t('goal.remainingLabel')}>
            <Text strong>{convertCurrency(remaining)}</Text>
          </StatTile>
        </Col>
        <Col xs={12} md={6}>
          <StatTile label={t('goal.monthlyLabel')}>
            {isAuto && goal.autoContributionAmount ? (
              <>
                <Text strong style={{ display: 'block' }}>
                  {convertCurrency(goal.autoContributionAmount)}
                </Text>
                {goal.autoContributionDay && (
                  <Text type="secondary">
                    {t('goal.dayValue', { day: goal.autoContributionDay })}
                  </Text>
                )}
              </>
            ) : (
              <Text type="secondary">{t('goal.notSet')}</Text>
            )}
          </StatTile>
        </Col>
        <Col xs={12} md={6}>
          <StatTile label={t('goal.estimated')}>{estimateTile()}</StatTile>
        </Col>
        <Col xs={12} md={6}>
          <StatTile label={t('goal.deadline')}>{deadlineTile()}</StatTile>
        </Col>
      </Row>

      {/* Thiết lập */}
      <Descriptions
        title={t('goal.settings')}
        column={{ xs: 1, sm: 2 }}
        size="small"
      >
        <Descriptions.Item label={t('goal.type')}>
          {FinancialGoalTypeHelper.getLabel(goal.type)}
        </Descriptions.Item>
        <Descriptions.Item label={t('goal.modeLabel')}>
          {FinancialGoalSavingModeHelper.getLabel(goal.savingMode)}
        </Descriptions.Item>
        {isAuto && (
          <Descriptions.Item label={t('goal.defaultWallet')}>
            {goal.wallet?.name ?? t('goal.noWallet')}
          </Descriptions.Item>
        )}
        <Descriptions.Item label={t('goal.locked')}>
          {goal.isLocked ? t('goal.yes') : t('goal.none')}
        </Descriptions.Item>
        {goal.description && (
          <Descriptions.Item label={t('goal.description')} span={2}>
            {goal.description}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Space>
  )

  // ───────── Lịch sử (dạng danh sách) ─────────
  const renderHistoryRow = (h: IFinance_GoalHistory, i: number) => {
    const isPending = h.status === FINANCIAL_GOAL_HISTORY_STATUS.PENDING
    const isOut = h.type === FINANCIAL_GOAL_HISTORY_TYPE.WITHDRAWAL
    const tone = isPending
      ? colors.warning
      : isOut
        ? colors.neutral
        : colors.success
    const Icon = isPending
      ? ClockCircleOutlined
      : isOut
        ? ArrowDownOutlined
        : ArrowUpOutlined
    const meta = [
      dayjs(h.completedAt ?? h.createdAt).format('DD/MM/YYYY'),
      h.wallet?.name ?? t('goal.bookOnly'),
      h.note,
    ]
      .filter(Boolean)
      .join(' · ')

    return (
      <li
        key={h.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 0',
          borderTop: i === 0 ? 'none' : `1px solid ${border.light}`,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: radius.md,
            display: 'grid',
            placeItems: 'center',
            background: tone.soft,
            color: tone.text,
          }}
        >
          <Icon />
        </span>

        <div style={{ minWidth: 0, flex: 1 }}>
          <Flex align="center" gap={6} wrap>
            <Text strong>
              {FinancialGoalHistoryTypeHelper.getLabel(h.type)}
            </Text>
            {h.source === FINANCIAL_GOAL_HISTORY_SOURCE.SYSTEM && (
              <Tag style={{ margin: 0 }}>{t('goal.auto')}</Tag>
            )}
            {h.status !== FINANCIAL_GOAL_HISTORY_STATUS.COMPLETED && (
              <Tag
                color={FinancialGoalHistoryStatusHelper.getColor(h.status)}
                style={{ margin: 0 }}
              >
                {FinancialGoalHistoryStatusHelper.getLabel(h.status)}
              </Tag>
            )}
          </Flex>
          <Text
            type="secondary"
            ellipsis={{ tooltip: meta }}
            style={{ display: 'block' }}
          >
            {meta}
          </Text>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {isPending ? (
            <>
              <Text type="secondary" style={{ display: 'block' }}>
                {convertCurrency(h.plannedAmount)} ({t('goal.planned')})
              </Text>
              <Space size={4} style={{ marginTop: 4 }}>
                <Popconfirm
                  title={t('goal.skipConfirm')}
                  onConfirm={() => skip(h)}
                  okText={t('goal.skip')}
                  cancelText={t('common.cancel')}
                >
                  <Button size="small">{t('goal.skip')}</Button>
                </Popconfirm>
                <Button
                  size="small"
                  type="primary"
                  disabled={!canContribute(goal)}
                  onClick={() => openMoney('confirm', h)}
                >
                  {t('goal.confirm')}
                </Button>
              </Space>
            </>
          ) : (
            <Text
              strong
              type={
                h.status === FINANCIAL_GOAL_HISTORY_STATUS.SKIPPED
                  ? 'secondary'
                  : undefined
              }
            >
              {h.status === FINANCIAL_GOAL_HISTORY_STATUS.SKIPPED
                ? '—'
                : `${isOut ? '−' : '+'}${convertCurrency(h.amount)}`}
            </Text>
          )}
        </div>
      </li>
    )
  }

  const historyList = (
    <div style={{ marginTop: 4 }}>
      {histories.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('goal.historyEmpty')}
        />
      ) : (
        <>
          {/* Khoản chờ xác nhận ghim lên đầu */}
          {pendingList.length > 0 && (
            <div
              style={{
                padding: '0 12px',
                marginBottom: 12,
                borderRadius: radius.md,
                border: `1px solid ${colors.warning.base}`,
                background: colors.warning.soft,
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {pendingList.map(renderHistoryRow)}
              </ul>
            </div>
          )}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {otherHistories.slice(0, historyLimit).map(renderHistoryRow)}
          </ul>
          {otherHistories.length > historyLimit && (
            <Flex justify="center" style={{ marginTop: 8 }}>
              <Button
                type="text"
                onClick={() => setHistoryLimit((n) => n + HISTORY_PAGE)}
              >
                {t('goal.showMore', {
                  count: otherHistories.length - historyLimit,
                })}
              </Button>
            </Flex>
          )}
        </>
      )}
    </div>
  )

  return (
    <Modal
      open={!!selected}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnHidden
      title={
        <Flex align="center" gap={12}>
          <Avatar
            shape="square"
            size={44}
            src={goal.imageUrl || undefined}
            icon={!goal.imageUrl && <TrophyOutlined />}
            style={{
              flexShrink: 0,
              borderRadius: radius.md,
              background: accent.soft,
              color: accent.text,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <Flex align="center" gap={6} wrap>
              <Text strong ellipsis={{ tooltip: goal.name }}>
                {goal.name}
              </Text>
              {goal.isLocked && (
                <Tooltip title={t('goal.locked')}>
                  <LockOutlined aria-label={t('goal.locked')} />
                </Tooltip>
              )}
              <Tag
                color={FinancialGoalStatusHelper.getColor(goal.status)}
                style={{ margin: 0 }}
              >
                {FinancialGoalStatusHelper.getLabel(goal.status)}
              </Tag>
            </Flex>
            <Text type="secondary" style={{ fontWeight: 400 }}>
              {FinancialGoalTypeHelper.getLabel(goal.type)}
            </Text>
          </div>
        </Flex>
      }
    >
      <Spin spinning={isLoading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'overview', label: t('goal.overview'), children: overview },
            {
              key: 'history',
              label: (
                <Badge count={pendingList.length} size="small" offset={[8, 0]}>
                  {t('goal.history')} ({histories.length})
                </Badge>
              ),
              children: historyList,
            },
          ]}
        />
      </Spin>

      {moneyMode && (
        <GoalMoneyModal
          open
          mode={moneyMode}
          goal={goal}
          pending={pending}
          wallets={wallets}
          isLoadingWallets={isLoadingWallets}
          onClose={() => setMoneyMode(null)}
        />
      )}
      <GoalCancelModal
        open={cancelOpen}
        goal={goal}
        wallets={wallets}
        isLoadingWallets={isLoadingWallets}
        onClose={() => setCancelOpen(false)}
      />
    </Modal>
  )
}
