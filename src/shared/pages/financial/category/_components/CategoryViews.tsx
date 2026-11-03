import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Dropdown,
  Empty,
  Flex,
  Grid,
  Progress,
  Segmented,
  Tag,
  Typography,
  theme,
} from 'antd'
import {
  AppstoreOutlined,
  BarsOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  MoreOutlined,
  PlusOutlined,
  ProfileOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'

import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import type { ExtendedFinanceCategory } from '..'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { FinancialCategorySpendingNatureHelper } from '@/shared/api/financial/category/category.enum'

const { Text, Title } = Typography
const { useBreakpoint } = Grid

export type CategoryView = 'tree' | 'grid' | 'remaining' | 'detail'

/** Lấy từ getBudgetSummary. Truyền vào thì thanh thu nhập sẽ hiện, không thì ẩn. */
export interface BudgetIncomeSummary {
  expectedIncome: number | null
  allocatedTotal: number
  unallocated: number | null
}

interface CategoryViewsProps {
  categories: Array<ExtendedFinanceCategory>
  totalBudget: number
  totalSpent: number
  incomeSummary?: BudgetIncomeSummary
  treeContent: ReactNode
  view: CategoryView
  onViewChange: (view: CategoryView) => void
  onAddChild: (id: number) => void
  onAdd: () => void
  onEdit: (category: IFinance_Category) => void
  onArchive: (id: number) => void
  onDelete: (id: number) => void
  onDetail: (id: number) => void
}

/* -------------------------------------------------------------------------- */
/* Logic dùng chung                                                           */
/* -------------------------------------------------------------------------- */

type Tone = 'free' | 'ok' | 'warn' | 'danger'

interface BudgetInfo {
  spent: number
  hasBudget: boolean
  budget: number
  /** Phần trăm thật, có thể > 100 */
  percent: number
  /** Phần trăm để vẽ thanh, tối đa 100 */
  barPercent: number
  /** Có thể âm khi vượt hạn mức */
  remaining: number
  tone: Tone
  isOver: boolean
}

function money(value: number) {
  const sign = value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toLocaleString('vi-VN')} đ`
}

/**
 * null/undefined = không giới hạn, 0 = không được chi.
 * Không được gộp hai trường hợp này như code cũ (budget > 0).
 */
function describe(category: ExtendedFinanceCategory): BudgetInfo {
  const spent = category.totalAmount || 0
  const hasBudget =
    category.monthlyBudget !== null && category.monthlyBudget !== undefined
  const budget = category.monthlyBudget ?? 0

  let rawPercent = 0
  if (typeof category.percent === 'number') {
    rawPercent = category.percent
  } else if (hasBudget) {
    rawPercent = budget > 0 ? (spent / budget) * 100 : spent > 0 ? 100 : 0
  }

  const percent = Math.round(rawPercent)
  const remaining =
    typeof category.remaining === 'number'
      ? category.remaining
      : hasBudget
        ? budget - spent
        : 0

  const tone: Tone = !hasBudget
    ? 'free'
    : percent >= 90
      ? 'danger'
      : percent >= 70
        ? 'warn'
        : 'ok'

  return {
    spent,
    hasBudget,
    budget,
    percent,
    barPercent: Math.min(Math.max(percent, 0), 100),
    remaining,
    tone,
    isOver: hasBudget && remaining < 0,
  }
}

function limitText(info: BudgetInfo) {
  if (!info.hasBudget) return 'Không giới hạn'
  if (info.budget === 0) return 'Không được chi'
  return money(info.budget)
}

function remainingText(info: BudgetInfo) {
  if (!info.hasBudget) return `Đã chi ${money(info.spent)}`
  if (info.isOver) return `Vượt ${money(-info.remaining)}`
  return `Còn ${money(info.remaining)}`
}

/** Danh mục hệ thống "Chưa phân loại" (id = 0) không sửa/xóa/thêm con được. */
function isSystem(category: ExtendedFinanceCategory) {
  return category.id === 0
}

function useToneStyles() {
  const { token } = theme.useToken()
  const color = (tone: Tone) =>
    ({
      free: token.colorTextTertiary,
      ok: token.colorSuccess,
      warn: token.colorWarning,
      danger: token.colorError,
    })[tone]
  const background = (tone: Tone) =>
    tone === 'danger'
      ? token.colorErrorBg
      : tone === 'warn'
        ? token.colorWarningBg
        : undefined
  return { color, background, token }
}

/** Làm cho phần tử không phải button bấm được bằng bàn phím. */
function clickable(onClick: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onClick()
      }
    },
  }
}

/* -------------------------------------------------------------------------- */
/* Thành phần nhỏ                                                             */
/* -------------------------------------------------------------------------- */

function CategoryBadge({
  category,
  subtitle,
  size = 36,
}: {
  category: ExtendedFinanceCategory
  /** Mặc định là nhãn Thiết yếu/Tự do. Truyền null để ẩn. */
  subtitle?: ReactNode
  size?: number
}) {
  const color = category.color || '#1677ff'
  const sub =
    subtitle === undefined
      ? FinancialCategorySpendingNatureHelper.getLabel(category.spendingNature)
      : subtitle

  return (
    <Flex align="center" gap={10} style={{ minWidth: 0 }}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          flexShrink: 0,
          background: `${color}26`,
        }}
      >
        <IconRenderer iconName={category.icon} color={color} />
      </Flex>
      <Flex vertical style={{ minWidth: 0 }}>
        <Text strong ellipsis>
          {category.name}
        </Text>
        {sub ? (
          <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
            {sub}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  )
}

function BudgetBar({
  info,
  size = 'small',
  showPercent = true,
  style,
}: {
  info: BudgetInfo
  size?: 'small' | 'default'
  showPercent?: boolean
  style?: CSSProperties
}) {
  const { color } = useToneStyles()

  if (!info.hasBudget) {
    return (
      <Text type="secondary" style={{ fontSize: 12, ...style }}>
        Không giới hạn
      </Text>
    )
  }

  return (
    <Flex align="center" gap={10} style={style}>
      <Progress
        percent={info.barPercent}
        showInfo={false}
        size={size}
        strokeColor={color(info.tone)}
        style={{ flex: 1, minWidth: 60, margin: 0 }}
      />
      {showPercent && (
        <Text
          type="secondary"
          style={{
            width: 44,
            textAlign: 'right',
            fontSize: 12,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {info.percent}%
        </Text>
      )}
    </Flex>
  )
}

function Stat({
  label,
  value,
  valueColor,
}: {
  label: string
  value: ReactNode
  valueColor?: string
}) {
  return (
    <Flex vertical gap={2} style={{ minWidth: 140 }}>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {label}
      </Text>
      <Text
        strong
        style={{
          fontSize: 20,
          color: valueColor,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Text>
    </Flex>
  )
}

function RowMenu({
  category,
  onEdit,
  onArchive,
  onDelete,
}: Pick<CategoryViewsProps, 'onEdit' | 'onArchive' | 'onDelete'> & {
  category: ExtendedFinanceCategory
}) {
  const items: MenuProps['items'] = [
    { key: 'edit', icon: <EditOutlined />, label: 'Sửa' },
    { key: 'archive', icon: <InboxOutlined />, label: 'Lưu trữ' },
    { type: 'divider' },
    { key: 'delete', icon: <DeleteOutlined />, label: 'Xóa', danger: true },
  ]

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items,
        onClick: ({ key, domEvent }) => {
          domEvent.stopPropagation()
          if (key === 'edit') onEdit(category)
          if (key === 'archive') onArchive(category.id)
          if (key === 'delete') onDelete(category.id)
        },
      }}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        aria-label={`Tùy chọn cho ${category.name}`}
        onClick={(event) => event.stopPropagation()}
      />
    </Dropdown>
  )
}

/* -------------------------------------------------------------------------- */
/* Đầu trang: chuyển chế độ xem + tổng quan                                   */
/* -------------------------------------------------------------------------- */

function ViewSwitcher({
  view,
  onViewChange,
}: Pick<CategoryViewsProps, 'view' | 'onViewChange'>) {
  const screens = useBreakpoint()
  const option = (value: CategoryView, label: string, icon: ReactNode) => ({
    value,
    icon,
    title: label,
    label: screens.md ? label : undefined,
  })

  return (
    <Segmented
      value={view}
      onChange={(value) => onViewChange(value)}
      options={[
        option('tree', 'Cây', <BarsOutlined />),
        option('grid', 'Thẻ', <AppstoreOutlined />),
        option('remaining', 'Còn lại', <WalletOutlined />),
        option('detail', 'Chi tiết', <ProfileOutlined />),
      ]}
    />
  )
}

function SummaryBar({
  totalBudget,
  totalSpent,
  incomeSummary,
}: Pick<CategoryViewsProps, 'totalBudget' | 'totalSpent' | 'incomeSummary'>) {
  const { color, token } = useToneStyles()
  const percent =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const tone: Tone =
    totalBudget <= 0
      ? 'free'
      : percent >= 90
        ? 'danger'
        : percent >= 70
          ? 'warn'
          : 'ok'
  const left = totalBudget - totalSpent

  return (
    <Card styles={{ body: { padding: 20 } }}>
      <Flex vertical gap={16}>
        <Flex wrap="wrap" gap="12px 40px">
          <Stat label="Đã chi tháng này" value={money(totalSpent)} />
          <Stat label="Tổng hạn mức" value={money(totalBudget)} />
          <Stat
            label={left < 0 ? 'Đã vượt' : 'Còn lại để chi'}
            value={money(Math.abs(left))}
            valueColor={left < 0 ? token.colorError : token.colorSuccess}
          />
        </Flex>
        <Flex align="center" gap={12}>
          <Progress
            percent={Math.min(percent, 100)}
            showInfo={false}
            strokeColor={color(tone)}
            style={{ flex: 1, margin: 0 }}
          />
          <Text strong style={{ width: 48, textAlign: 'right' }}>
            {percent}%
          </Text>
        </Flex>
        {incomeSummary && (
          <Flex
            wrap="wrap"
            gap="12px 40px"
            style={{
              paddingTop: 16,
              borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Stat
              label="Thu nhập dự kiến"
              value={
                incomeSummary.expectedIncome === null
                  ? 'Chưa đặt'
                  : money(incomeSummary.expectedIncome)
              }
            />
            <Stat
              label="Đã phân bổ"
              value={money(incomeSummary.allocatedTotal)}
            />
            <Stat
              label="Chưa phân bổ"
              value={
                incomeSummary.unallocated === null
                  ? '—'
                  : money(incomeSummary.unallocated)
              }
              valueColor={
                incomeSummary.unallocated !== null &&
                incomeSummary.unallocated < 0
                  ? token.colorError
                  : undefined
              }
            />
          </Flex>
        )}
      </Flex>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Chế độ Thẻ                                                                 */
/* -------------------------------------------------------------------------- */

const MAX_CHILDREN_IN_CARD = 4

function GridView({
  categories,
  onAddChild,
  onDetail,
}: Pick<CategoryViewsProps, 'categories' | 'onAddChild' | 'onDetail'>) {
  const { color, token } = useToneStyles()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      }}
    >
      {categories.map((category) => {
        const info = describe(category)
        const children = category.children || []
        const shown = children.slice(0, MAX_CHILDREN_IN_CARD)
        const hidden = children.length - shown.length

        return (
          <Card
            key={category.id}
            hoverable
            style={{ height: '100%' }}
            styles={{
              body: {
                padding: 20,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
            {...clickable(() => onDetail(category.id))}
          >
            <Flex justify="space-between" align="center" gap={12}>
              <CategoryBadge category={category} />
              {info.isOver && <Tag color="error">Vượt hạn mức</Tag>}
            </Flex>

            <Flex align="center" gap={20} style={{ margin: '20px 0' }}>
              <Progress
                type="circle"
                percent={info.barPercent}
                size={92}
                strokeColor={color(info.tone)}
                format={() => (info.hasBudget ? `${info.percent}%` : '—')}
              />
              <Flex vertical gap={2} style={{ minWidth: 0 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {info.isOver ? 'Vượt' : 'Còn lại'}
                </Text>
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    color: info.isOver ? token.colorError : undefined,
                  }}
                >
                  {info.hasBudget
                    ? money(Math.abs(info.remaining))
                    : 'Không giới hạn'}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Đã chi {money(info.spent)}
                  {info.hasBudget ? ` / ${limitText(info)}` : ''}
                </Text>
              </Flex>
            </Flex>

            <Flex
              vertical
              gap={10}
              style={{
                flex: 1,
                paddingTop: 14,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              {shown.length === 0 && (
                <Text type="secondary">Chưa có danh mục con</Text>
              )}
              {shown.map((child) => {
                const childInfo = describe(child)
                return (
                  <Flex key={child.id} vertical gap={4}>
                    <Flex justify="space-between" align="center" gap={8}>
                      <CategoryBadge
                        category={child}
                        subtitle={null}
                        size={28}
                      />
                      <Text style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                        {money(childInfo.spent)}
                      </Text>
                    </Flex>
                    {childInfo.hasBudget && (
                      <BudgetBar info={childInfo} showPercent={false} />
                    )}
                  </Flex>
                )
              })}
              {hidden > 0 && (
                <Text type="secondary" style={{ fontSize: 13 }}>
                  +{hidden} danh mục con nữa
                </Text>
              )}
            </Flex>

            {!isSystem(category) && (
              <Button
                block
                type="dashed"
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
                onClick={(event) => {
                  event.stopPropagation()
                  onAddChild(category.id)
                }}
              >
                Thêm danh mục con
              </Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Chế độ Còn lại                                                             */
/* -------------------------------------------------------------------------- */

interface RemainingItem {
  category: ExtendedFinanceCategory
  parent?: ExtendedFinanceCategory
  info: BudgetInfo
}

function RemainingView({
  categories,
  onDetail,
}: Pick<CategoryViewsProps, 'categories' | 'onDetail'>) {
  const { color, background, token } = useToneStyles()

  const groups = useMemo(() => {
    const items: Array<RemainingItem> = []
    for (const category of categories) {
      items.push({ category, info: describe(category) })
      for (const child of category.children || []) {
        items.push({ category: child, parent: category, info: describe(child) })
      }
    }
    return {
      attention: items
        .filter(
          (item) =>
            item.info.hasBudget &&
            (item.info.tone === 'warn' || item.info.tone === 'danger'),
        )
        .sort((a, b) => b.info.percent - a.info.percent),
      steady: items
        .filter((item) => item.info.hasBudget && item.info.tone === 'ok')
        .sort((a, b) => b.info.remaining - a.info.remaining),
      unlimited: items
        .filter((item) => !item.info.hasBudget)
        .sort((a, b) => b.info.spent - a.info.spent),
    }
  }, [categories])

  const renderGroup = (title: string, items: Array<RemainingItem>) => {
    if (items.length === 0) return null
    return (
      <section>
        <Flex align="center" gap={8} style={{ margin: '4px 0 10px 4px' }}>
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          <Tag bordered={false}>{items.length}</Tag>
        </Flex>
        <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden' }}>
          {items.map(({ category, parent, info }, index) => (
            <Flex
              key={category.id}
              align="center"
              justify="space-between"
              gap="8px 20px"
              wrap="wrap"
              {...clickable(() => onDetail(category.id))}
              style={{
                padding: '14px 20px',
                cursor: 'pointer',
                background: background(info.tone),
                borderTop:
                  index === 0
                    ? undefined
                    : `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <CategoryBadge
                  category={category}
                  subtitle={
                    parent
                      ? `trong ${parent.name}`
                      : category.children?.length
                        ? `Cả nhóm · ${category.children.length} danh mục con`
                        : undefined
                  }
                />
              </div>
              <div style={{ flex: '1 1 180px', maxWidth: 260 }}>
                <BudgetBar info={info} />
              </div>
              <Flex
                vertical
                align="end"
                style={{ flex: '0 0 170px', minWidth: 0 }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    color: info.hasBudget ? color(info.tone) : undefined,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {remainingText(info)}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {money(info.spent)} / {limitText(info)}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Card>
      </section>
    )
  }

  const isEmpty =
    groups.attention.length + groups.steady.length + groups.unlimited.length ===
    0

  if (isEmpty) return <Empty description="Chưa có danh mục" />

  return (
    <Flex vertical gap={20}>
      {renderGroup('Cần chú ý', groups.attention)}
      {renderGroup('Đang ổn', groups.steady)}
      {renderGroup('Không giới hạn', groups.unlimited)}
    </Flex>
  )
}

/* -------------------------------------------------------------------------- */
/* Chế độ Chi tiết                                                            */
/* -------------------------------------------------------------------------- */

function DetailView({
  categories,
  onAddChild,
  onEdit,
  onArchive,
  onDelete,
  onDetail,
}: Pick<
  CategoryViewsProps,
  'categories' | 'onAddChild' | 'onEdit' | 'onArchive' | 'onDelete' | 'onDetail'
>) {
  const screens = useBreakpoint()
  const { color, token } = useToneStyles()
  const [selectedId, setSelectedId] = useState(categories[0]?.id)

  if (categories.length === 0) return <Empty description="Chưa có danh mục" />

  const selected =
    categories.find((category) => category.id === selectedId) || categories[0]
  const info = describe(selected)
  const children = selected.children || []
  const system = isSystem(selected)

  // Phân bổ hạn mức cho các con (hạn mức cha là trần của cả nhóm)
  const childrenWithBudget = children.filter(
    (child) => describe(child).hasBudget,
  )
  const childrenBudget = childrenWithBudget.reduce(
    (sum, child) => sum + describe(child).budget,
    0,
  )
  const showAllocation = info.hasBudget && children.length > 0
  const overAllocated = showAllocation && childrenBudget > info.budget
  const noBudgetChildren = children.length - childrenWithBudget.length

  return (
    <Flex gap={16} align="start" wrap="wrap">
      <Card
        style={{ flex: '1 1 270px', maxWidth: '100%' }}
        styles={{ body: { padding: 8 } }}
      >
        <Flex vertical gap={2}>
          {categories.map((category) => {
            const item = describe(category)
            const active = category.id === selected.id
            return (
              <Flex
                key={category.id}
                align="center"
                justify="space-between"
                gap={8}
                {...clickable(() => setSelectedId(category.id))}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: active ? token.colorFillSecondary : undefined,
                }}
              >
                <CategoryBadge category={category} subtitle={null} />
                <Text
                  strong={active}
                  style={{
                    color: item.hasBudget ? color(item.tone) : undefined,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  type={item.hasBudget ? undefined : 'secondary'}
                >
                  {item.hasBudget ? `${item.percent}%` : '—'}
                </Text>
              </Flex>
            )
          })}
        </Flex>
      </Card>

      <Card style={{ flex: '3 1 540px', minWidth: 0 }}>
        <Flex justify="space-between" align="center" gap={12} wrap="wrap">
          <CategoryBadge category={selected} size={44} />
          {!system && (
            <Flex gap={8} wrap="wrap">
              <Button icon={<EditOutlined />} onClick={() => onEdit(selected)}>
                {screens.md ? 'Sửa' : null}
              </Button>
              <Button
                icon={<InboxOutlined />}
                onClick={() => onArchive(selected.id)}
              >
                {screens.md ? 'Lưu trữ' : null}
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(selected.id)}
              >
                {screens.md ? 'Xóa' : null}
              </Button>
            </Flex>
          )}
        </Flex>

        <Flex wrap="wrap" gap="12px 40px" style={{ marginTop: 24 }}>
          <Stat label="Đã chi" value={money(info.spent)} />
          <Stat label="Hạn mức" value={limitText(info)} />
          <Stat
            label={info.isOver ? 'Đã vượt' : 'Còn lại'}
            value={info.hasBudget ? money(Math.abs(info.remaining)) : '—'}
            valueColor={
              info.hasBudget
                ? info.isOver
                  ? token.colorError
                  : token.colorSuccess
                : undefined
            }
          />
        </Flex>
        <BudgetBar info={info} size="default" style={{ marginTop: 16 }} />

        {showAllocation && (
          <Flex
            vertical
            gap={8}
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 12,
              background: token.colorFillQuaternary,
            }}
          >
            <Flex justify="space-between" wrap="wrap" gap={8}>
              <Text>
                Đã phân bổ cho danh mục con{' '}
                <Text strong>{money(childrenBudget)}</Text>
              </Text>
              <Text type={overAllocated ? 'danger' : 'secondary'}>
                {overAllocated
                  ? `Vượt hạn mức nhóm ${money(childrenBudget - info.budget)}`
                  : `Chưa phân bổ ${money(info.budget - childrenBudget)}`}
              </Text>
            </Flex>
            <Progress
              percent={
                info.budget > 0
                  ? Math.min(
                      Math.round((childrenBudget / info.budget) * 100),
                      100,
                    )
                  : 0
              }
              showInfo={false}
              size="small"
              strokeColor={
                overAllocated ? token.colorError : token.colorPrimary
              }
              style={{ margin: 0 }}
            />
            {noBudgetChildren > 0 && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {noBudgetChildren} danh mục con không đặt hạn mức, vẫn tính vào
                hạn mức của nhóm.
              </Text>
            )}
          </Flex>
        )}
        {overAllocated && (
          <Alert
            style={{ marginTop: 12 }}
            type="warning"
            showIcon
            message="Tổng hạn mức các danh mục con lớn hơn hạn mức nhóm. Bạn vẫn lưu được, nhưng nên tăng hạn mức nhóm hoặc giảm hạn mức con."
          />
        )}

        <Title level={5} style={{ marginTop: 28, marginBottom: 4 }}>
          Danh mục con
        </Title>
        {children.length === 0 ? (
          <Text
            type="secondary"
            style={{ display: 'block', padding: '12px 0' }}
          >
            Danh mục này chưa có danh mục con.
          </Text>
        ) : (
          <Flex vertical>
            {children.map((child, index) => {
              const childInfo = describe(child)
              return (
                <Flex
                  key={child.id}
                  align="center"
                  gap="8px 16px"
                  wrap="wrap"
                  {...clickable(() => onDetail(child.id))}
                  style={{
                    padding: '12px 0',
                    cursor: 'pointer',
                    borderTop:
                      index === 0
                        ? undefined
                        : `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                    <CategoryBadge category={child} size={32} />
                  </div>
                  <div style={{ flex: '1 1 140px', maxWidth: 220 }}>
                    <BudgetBar info={childInfo} />
                  </div>
                  <Flex
                    vertical
                    align="end"
                    style={{ flex: '0 0 150px', minWidth: 0 }}
                  >
                    <Text strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {money(childInfo.spent)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      / {limitText(childInfo)}
                    </Text>
                  </Flex>
                  <RowMenu
                    category={child}
                    onEdit={onEdit}
                    onArchive={onArchive}
                    onDelete={onDelete}
                  />
                </Flex>
              )
            })}
          </Flex>
        )}

        {!system && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={{ marginTop: 12 }}
            onClick={() => onAddChild(selected.id)}
          >
            Thêm danh mục con
          </Button>
        )}
      </Card>
    </Flex>
  )
}

/* -------------------------------------------------------------------------- */
/* Component chính                                                            */
/* -------------------------------------------------------------------------- */

export default function CategoryViews({
  categories,
  totalBudget,
  totalSpent,
  incomeSummary,
  treeContent,
  view,
  onViewChange,
  onAddChild,
  onAdd,
  onEdit,
  onArchive,
  onDelete,
  onDetail,
}: CategoryViewsProps) {
  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" gap={12} wrap="wrap">
        <ViewSwitcher view={view} onViewChange={onViewChange} />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm danh mục
        </Button>
      </Flex>

      <SummaryBar
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        incomeSummary={incomeSummary}
      />

      {view === 'tree' ? (
        treeContent
      ) : view === 'grid' ? (
        <GridView
          categories={categories}
          onAddChild={onAddChild}
          onDetail={onDetail}
        />
      ) : view === 'remaining' ? (
        <RemainingView categories={categories} onDetail={onDetail} />
      ) : (
        <DetailView
          categories={categories}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          onDetail={onDetail}
        />
      )}
    </Flex>
  )
}
