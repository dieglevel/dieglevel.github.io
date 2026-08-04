import { Button, Card, Dropdown, Flex, Progress, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import useConfirm from '@/shared/hooks/use-confirm'

const { Text } = Typography

interface CategoryCardProps {
  category: IFinance_Category
  onEdit: (category: IFinance_Category) => void
  onArchive: (id: number) => void
  onDelete: (id: number) => void
}

export default function CategoryCard({
  category,
  onEdit,
  onArchive,
  onDelete,
}: CategoryCardProps) {
  const { confirm, ConfirmModal } = useConfirm()

  const spent = category.totalAmount ?? 0
  const budget = category.monthlyBudget ?? 0
  const remaining = budget - spent

  // Tính % thực tế đã sử dụng
  const rawPercent = budget > 0 ? (spent / budget) * 100 : 0

  // Tính % còn lại
  const remainingRawPercent = budget > 0 ? (remaining / budget) * 100 : 0
  const remainingDisplayPercent = Math.round(remainingRawPercent)

  const getStatusConfig = () => {
    // 1. Đã chi hết và bị âm (Vượt ngân sách)
    if (remaining < 0) {
      return {
        statusText: `Vượt ${convertCurrency(spent - budget)}`,
        percentTag: `${remainingDisplayPercent}%`, // Ví dụ: -20%
        strokeColor: '#ff4d4f',
        tagColor: 'error',
      }
    }

    // 2. Còn lại ít hơn hoặc bằng 10% (Cảnh báo đỏ)
    if (remainingRawPercent <= 10) {
      return {
        statusText: `Còn ${convertCurrency(remaining)}`,
        percentTag: `Còn ${remainingDisplayPercent}%`,
        strokeColor: '#ff4d4f', // Đỏ
        tagColor: 'error',
      }
    }

    // 3. Còn lại từ 10% đến 25% (Cảnh báo cam)
    if (remainingRawPercent <= 25) {
      return {
        statusText: `Còn ${convertCurrency(remaining)}`,
        percentTag: `Còn ${remainingDisplayPercent}%`,
        strokeColor: '#fa8c16', // Cam
        tagColor: 'warning',
      }
    }

    // 4. Còn lại từ 25% đến 40% (Cảnh báo vàng)
    if (remainingRawPercent <= 40) {
      return {
        statusText: `Còn ${convertCurrency(remaining)}`,
        percentTag: `Còn ${remainingDisplayPercent}%`,
        strokeColor: '#faad14', // Vàng
        tagColor: 'warning',
      }
    }

    // 5. Còn lại > 40% (An toàn)
    return {
      statusText: `Còn ${convertCurrency(remaining)}`,
      percentTag: `Còn ${remainingDisplayPercent}%`,
      strokeColor: '#52c41a',
      tagColor: 'success',
    }
  }

  const status = getStatusConfig()

  // Menu thao tác cho Mobile/Dropdown
  const actionMenuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: () => onEdit(category),
    },
    {
      key: 'archive',
      label: category.archived ? 'Bỏ lưu trữ' : 'Lưu trữ',
      icon: <InboxOutlined />,
      onClick: () => onArchive(category.id),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Xóa danh mục',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: async () => {
        const isConfirmed = await confirm({})
        if (isConfirmed) {
          onDelete(category.id)
        }
      },
    },
  ]

  return (
    <Card
      size="small"
      style={{
        opacity: category.archived ? 0.6 : 1,
        width: '100%',
        borderRadius: 12,
      }}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <ConfirmModal />
      <Flex vertical gap={12}>
        {/* Header: Icon + Tên + Menu Action */}
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={12}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${category.color || '#1677ff'}15`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <IconRenderer
                iconName={category.icon || 'Circle'}
                size={22}
                color={category.color || '#1677ff'}
              />
            </div>

            <Flex vertical>
              <Text strong style={{ fontSize: 15 }}>
                {category.name}
              </Text>
              {category.archived && (
                <Tag
                  color="default"
                  style={{ width: 'fit-content', marginTop: 2, fontSize: 10 }}
                >
                  Đã lưu trữ
                </Tag>
              )}
            </Flex>
          </Flex>

          <Dropdown
            menu={{ items: actionMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined style={{ fontSize: 18 }} />}
            />
          </Dropdown>
        </Flex>

        {/* Ngân sách & Tiến độ */}
        {budget > 0 ? (
          <Flex vertical gap={6}>
            <Flex justify="space-between" align="baseline">
              <Text type="secondary" style={{ fontSize: 12 }}>
                {convertCurrency(spent)}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {convertCurrency(budget)}
              </Text>
            </Flex>

            {/* Thanh Progress */}
            <Progress
              percent={Math.min(rawPercent, 100)}
              showInfo={false}
              strokeColor={status.strokeColor}
              size="small"
              style={{ margin: '2px 0' }}
            />

            {/* Tag trạng thái % và số tiền còn lại / vượt mức */}
            <Flex justify="space-between" align="center">
              <Tag
                color={status.tagColor}
                style={{
                  marginRight: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 4,
                }}
              >
                {status.percentTag}
              </Tag>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: status.strokeColor,
                }}
              >
                {status.statusText}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
            Chưa thiết lập ngân sách
          </Text>
        )}
      </Flex>
    </Card>
  )
}
