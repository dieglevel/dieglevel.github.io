import { Button, Flex, Grid, Popconfirm, Progress, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import type { ExtendedFinanceCategory } from '..'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import {
  FinancialCategorySpendingNatureHelper,
  FinancialCategoryTypeHelper,
} from '@/shared/api/financial/category/category.enum'

const { Text } = Typography
const { useBreakpoint } = Grid

interface CategoryTreeNodeProps {
  node: ExtendedFinanceCategory
  onAddChild: (id: number) => void
  onEdit: (category: IFinance_Category) => void
  onArchive: (id: number) => void
  onDelete: (id: number) => void
}

export default function CategoryTreeNode({
  node,
  onAddChild,
  onEdit,
  onArchive,
  onDelete,
}: CategoryTreeNodeProps) {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const spent = node.totalAmount || 0
  const isHaveMonthlyBudget =
    node.monthlyBudget === null || node.monthlyBudget > 0
  const budget = isHaveMonthlyBudget ? node.monthlyBudget || 0 : 0
  const percent =
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0
  const isOverBudget = budget > 0 && spent > budget

  const totalMonthlyBudget = node.children?.reduce(
    (acc, child) => acc + (child.monthlyBudget || 0),
    0,
  )

  // Action Buttons Group
  const renderActions = () => (
    <Flex
      align="center"
      gap={2}
      style={{
        flexShrink: 0,
        borderLeft: isMobile ? 'none' : '1px solid #f0f0f0',
        paddingLeft: isMobile ? 0 : 4,
      }}
    >
      <Button
        type="text"
        size="small"
        icon={<PlusOutlined />}
        onClick={(e) => {
          e.stopPropagation()
          onAddChild(node.id)
        }}
      />

      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={(e) => {
          e.stopPropagation()
          onEdit(node)
        }}
      />

      <Button
        type="text"
        size="small"
        icon={<InboxOutlined />}
        onClick={(e) => {
          e.stopPropagation()
          onArchive(node.id)
        }}
      />

      <Popconfirm
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này?"
        onConfirm={(e) => {
          e?.stopPropagation()
          onDelete(node.id)
        }}
        onCancel={(e) => e?.stopPropagation()}
        okText="Có"
        cancelText="Không"
      >
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => e.stopPropagation()}
        />
      </Popconfirm>
    </Flex>
  )

  // Layout Mobile (< 768px)
  if (isMobile) {
    return (
      <Flex
        vertical
        gap={8}
        className="category-tree-node"
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          background: '#fff',
          transition: 'all 0.2s ease',
          opacity: node.archived ? 0.5 : 1,
          border: '1px solid #f0f0f0',
        }}
      >
        {/* Hàng 1: Icon + Tên + Nhãn + Action Buttons */}
        <Flex
          align="center"
          justify="space-between"
          gap={8}
          style={{ width: '100%' }}
        >
          <Flex align="center" gap={10} style={{ minWidth: 0, flex: 1 }}>
            <Flex
              align="center"
              justify="center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                flexShrink: 0,
                background: `${node.color || '#1677ff'}15`,
              }}
            >
              <IconRenderer
                iconName={node.icon}
                color={node.color || '#1677ff'}
              />
            </Flex>

            <Flex vertical style={{ minWidth: 0, flex: 1 }}>
              <Text
                ellipsis
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: '20px',
                }}
              >
                {node.name}
              </Text>
              <Flex gap={4} wrap="wrap" style={{ marginTop: 2 }}>
                <Tag
                  color={FinancialCategoryTypeHelper.getColor(node.type)}
                  style={{
                    fontSize: 10,
                    marginRight: 0,
                    padding: '0 4px',
                    lineHeight: '16px',
                  }}
                >
                  {FinancialCategoryTypeHelper.getLabel(node.type)}
                </Tag>
                <Tag
                  color={FinancialCategorySpendingNatureHelper.getColor(
                    node.spendingNature,
                  )}
                  style={{
                    fontSize: 10,
                    marginRight: 0,
                    padding: '0 4px',
                    lineHeight: '16px',
                  }}
                >
                  {FinancialCategorySpendingNatureHelper.getLabel(
                    node.spendingNature,
                  )}
                </Tag>
              </Flex>
            </Flex>
          </Flex>

          {renderActions()}
        </Flex>

        {/* Hàng 2: Chi tiết ngân sách & Tiến độ */}
        {(budget > 0 || node.monthlyBudget) && (
          <Flex
            vertical
            gap={4}
            style={{
              paddingTop: 6,
              borderTop: '1px stroke #f5f5f5',
            }}
          >
            <Flex justify="space-between" align="center">
              <Text style={{ fontSize: 12, fontWeight: 600 }}>
                {spent.toLocaleString()} đ
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {budget > 0
                  ? `/ ${budget.toLocaleString()} đ`
                  : 'Không hạn mức'}
              </Text>
            </Flex>

            {budget > 0 && (
              <Flex align="center" gap={8}>
                <Progress
                  percent={percent}
                  size="small"
                  showInfo={false}
                  status={isOverBudget ? 'exception' : 'normal'}
                  strokeColor={
                    isOverBudget ? '#ff4d4f' : node.color || '#1677ff'
                  }
                  style={{ flex: 1, margin: 0 }}
                />
                <Text
                  type="secondary"
                  style={{ fontSize: 10, whiteSpace: 'nowrap' }}
                >
                  {percent}%
                </Text>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    )
  }

  // Layout Desktop (>= 768px)
  return (
    <Flex
      align="center"
      gap={12}
      className="category-tree-node"
      style={{
        width: '100%',
        minHeight: 48,
        padding: '6px 8px',
        borderRadius: 8,
        transition: 'all 0.2s ease',
        opacity: node.archived ? 0.5 : 1,
      }}
    >
      <Flex
        align="center"
        justify="center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          flexShrink: 0,
          background: `${node.color || '#1677ff'}15`,
        }}
      >
        <IconRenderer iconName={node.icon} color={node.color || '#1677ff'} />
      </Flex>

      {/* Tên & Ngân sách bar */}
      <Flex
        align="center"
        gap={12}
        style={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Text
          ellipsis
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            width: 140,
            flexShrink: 0,
          }}
        >
          {node.name}
        </Text>

        {budget > 0 && (
          <Flex align="center" gap={6} style={{ flex: 1, minWidth: 80 }}>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              status={isOverBudget ? 'exception' : 'normal'}
              strokeColor={isOverBudget ? '#ff4d4f' : node.color || '#1677ff'}
              style={{ width: '100%' }}
            />
            <Text
              type="secondary"
              style={{
                fontSize: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {percent}%
            </Text>
          </Flex>
        )}
      </Flex>

      {/* Hiển thị số tiền */}
      <Flex
        vertical
        align="end"
        style={{
          width: 110,
          flexShrink: 0,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: '18px',
          }}
        >
          {spent.toLocaleString()} đ
        </Text>

        <Text type="secondary" style={{ fontSize: 11 }}>
          {budget > 0 || (totalMonthlyBudget && totalMonthlyBudget > 0)
            ? `/ ${(budget || totalMonthlyBudget!).toLocaleString()} đ`
            : 'Không hạn mức'}
        </Text>
      </Flex>

      {/* Nhãn loại danh mục */}
      <Tag
        color={FinancialCategorySpendingNatureHelper.getColor(
          node.spendingNature,
        )}
        style={{
          fontSize: 10,
          fontWeight: 500,
          lineHeight: '16px',
          textTransform: 'capitalize',
          width: 90,
          textAlign: 'center',
          marginRight: 0,
          flexShrink: 0,
        }}
      >
        {FinancialCategorySpendingNatureHelper.getLabel(node.spendingNature)}
      </Tag>

      <Tag
        color={FinancialCategoryTypeHelper.getColor(node.type)}
        style={{
          fontSize: 10,
          fontWeight: 500,
          lineHeight: '16px',
          textTransform: 'capitalize',
          width: 65,
          textAlign: 'center',
          marginRight: 0,
          flexShrink: 0,
        }}
      >
        {FinancialCategoryTypeHelper.getLabel(node.type)}
      </Tag>

      {/* Nút thao tác */}
      {renderActions()}
    </Flex>
  )
}
