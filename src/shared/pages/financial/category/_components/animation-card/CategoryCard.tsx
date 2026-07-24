import { Button, Card, Flex, Progress, Space, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons'
import type { IWallet_Category } from '@/shared/api/financial/category/category.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import useConfirm from '@/shared/hooks/use-confirm'

const { Text } = Typography

interface CategoryCardProps {
  category: IWallet_Category
  onEdit: (category: IWallet_Category) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}

export default function CategoryCard({
  category,
  onEdit,
  onArchive,
  onDelete,
}: CategoryCardProps) {
  const { confirm, ConfirmModal } = useConfirm()

  const percent =
    category.monthlyBudget > 0
      ? Math.min(
          ((category.totalAmount ?? 0) / category.monthlyBudget) * 100,
          100,
        )
      : 0

  const overBudget =
    category.monthlyBudget > 0 &&
    (category.totalAmount ?? 0) > category.monthlyBudget

  return (
    <Card
      hoverable
      style={{
        opacity: category.archived ? 0.6 : 1,
        width: '100%',
      }}
    >
      <ConfirmModal />
      <Flex vertical gap={16}>
        <Flex justify="space-between" align="center">
          <Space>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: `${category.color}20`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
              }}
            >
              <IconRenderer
                iconName={category.icon || 'Circle'}
                size={24}
                color={category.color || '#000'}
              />
            </div>

            <div>
              <Text strong>{category.name}</Text>

              {category.archived && (
                <>
                  <br />
                  <Tag color="default">Archived</Tag>
                </>
              )}
            </div>
          </Space>

          <Space>
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(category)}
            />
            <Button
              type="default"
              size="small"
              icon={<InboxOutlined />}
              onClick={() => onArchive(category.id)}
            />

            <Button
              type="default"
              size="small"
              icon={<DeleteOutlined />}
              onClick={async () => {
                const isConfirmed = await confirm({})
                if (isConfirmed) {
                  onDelete(category.id)
                }
              }}
            />
          </Space>
        </Flex>

        {category.monthlyBudget > 0 ? (
          <>
            <Flex justify="space-between">
              <Text type="secondary">
                {convertCurrency(category.totalAmount ?? 0)}
              </Text>

              <Text strong>{convertCurrency(category.monthlyBudget)}</Text>
            </Flex>

            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={overBudget ? '#ff4d4f' : category.color || '#1890ff'}
            />

            {overBudget ? (
              <Tag color="error">
                Over Budget $
                {(category.totalAmount ?? 0 - category.monthlyBudget).toFixed(
                  0,
                )}
              </Tag>
            ) : (
              <Tag color="success">
                {percent.toFixed(0)}% -{' '}
                {convertCurrency(
                  category.monthlyBudget - (category.totalAmount ?? 0),
                )}{' '}
                {'left'}
              </Tag>
            )}
          </>
        ) : (
          <Text type="secondary">No budget set</Text>
        )}
      </Flex>
    </Card>
  )
}
