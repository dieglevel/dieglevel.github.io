import { Button, Card, Flex, Progress, Space, Tag, Typography } from 'antd'
import { EditOutlined, InboxOutlined } from '@ant-design/icons'
import type { IWallet_Category } from '@/shared/api/wallet/category/category.type'

const { Text } = Typography

interface CategoryCardProps {
  category: IWallet_Category
  onEdit: (category: IWallet_Category) => void
  onArchive: (id: number) => void
}

export default function CategoryCard({
  category,
  onEdit,
  onArchive,
}: CategoryCardProps) {
  const percent =
    category.monthlyBudget > 0
      ? Math.min((category.totalSpent / category.monthlyBudget) * 100, 100)
      : 0

  const overBudget =
    category.monthlyBudget > 0 && category.totalSpent > category.monthlyBudget

  return (
    <Card
      hoverable
      style={{
        opacity: category.archived ? 0.6 : 1,
      }}
    >
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
              {category.icon}
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
          </Space>
        </Flex>

        {category.monthlyBudget > 0 ? (
          <>
            <Flex justify="space-between">
              <Text type="secondary">
                ${category.totalSpent.toFixed(0)} spent
              </Text>

              <Text strong>${category.monthlyBudget}</Text>
            </Flex>

            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={overBudget ? '#ff4d4f' : category.color}
            />

            {overBudget ? (
              <Tag color="error">
                Over Budget $
                {(category.totalSpent - category.monthlyBudget).toFixed(0)}
              </Tag>
            ) : (
              <Tag color="success">
                {percent.toFixed(0)}% Used · $
                {(category.monthlyBudget - category.totalSpent).toFixed(0)}{' '}
                Remaining
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
