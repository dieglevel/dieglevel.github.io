import React, { useMemo } from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  List,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseOutlined,
  DollarOutlined,
  NodeIndexOutlined,
  StopOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import type { IFinance_TransactionItem } from '@/shared/api/financial/transaction/transaction-item/transaction-item.type'
import { useGetFinance_Category_Transaction } from '@/shared/api/financial/category/useGetFinance_Category_Transaction'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DoubleCardModal } from '@/shared/components/modal/double-modal'
import Table from '@/shared/components/table'

// Component DoubleCardModal đã tạo ở bước trước (đổi đường dẫn cho phù hợp)

const { Text, Title } = Typography

type TransactionRow = Omit<IFinance_TransactionItem, 'category'> & {
  category: Partial<IFinance_Category>
}

interface CategoryDetailModalProps {
  params: {
    startDate: string
    endDate: string
  }
  categoryId: number | null
  open: boolean
  onCancel: () => void
}

export default function CategoryDetailModal({
  params,
  categoryId,
  open,
  onCancel,
}: CategoryDetailModalProps) {
  const { data, isLoading } = useGetFinance_Category_Transaction({
    pathParams: {
      categoryId: categoryId || 0,
    },
    queryParams: params,
  })

  const parentCategory = data?.data.parent
  const childrenCategories = data?.data.children || []
  const transactionItems = data?.data.transactionItems || []
  const overcomeTransactionItems = data?.data.overcomeTransactionItems || []

  // Tính tổng số tiền giao dịch
  const totalAmount = useMemo(() => {
    return transactionItems.reduce((sum, item) => {
      const amount = parseInt(String(item.amount)) || 0
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)
  }, [transactionItems])

  const aboveAvg = useMemo(() => {
    if (transactionItems.length === 0) {
      return { average: 0, items: [] }
    }

    const total = transactionItems.reduce((sum, item) => {
      const amount = parseInt(String(item.amount)) || 0
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)

    const average = total / transactionItems.length

    const itemsAboveAvg = transactionItems.filter(
      (item) => parseInt(String(item.amount)) > average,
    )

    return { average, items: itemsAboveAvg }
  }, [transactionItems])

  // Cấu hình bảng danh sách giao dịch (Table Columns)
  const columns: ColumnsType<TransactionRow> = [
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || 'Không có mô tả',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: IFinance_Category) => (
        <Tag color={category.color || 'blue'}>{category.name || '-'}</Tag>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: string) => {
        const num = parseFloat(amount) || 0
        return (
          <Text
            strong
            style={{
              color: num < 0 ? '#cf1322' : '#3f8600',
            }}
          >
            {convertCurrency(num)}
          </Text>
        )
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
  ]

  /* ------------------------- CARD CHÍNH ------------------------- */
  const main = (
    <>
      <div className="dc-card__header">
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {parentCategory?.name || 'Chi tiết danh mục'}
          </Title>
          {parentCategory?.archived ? (
            <Tag icon={<StopOutlined />} color="error">
              Đã lưu trữ
            </Tag>
          ) : (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Hoạt động
            </Tag>
          )}
        </Space>
        <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
      </div>

      {isLoading || !data ? (
        <Flex justify="center" align="center" style={{ height: 200 }}>
          <Spin />
        </Flex>
      ) : (
        <Space vertical style={{ width: '100%' }}>
          {/* --- KHU VỰC THỐNG KÊ --- */}
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Tổng phát sinh"
                  value={totalAmount}
                  precision={0}
                  suffix="₫"
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Ngân sách tháng"
                  value={parentCategory?.monthlyBudget ?? 0}
                  precision={0}
                  suffix="₫"
                  valueStyle={{
                    color: parentCategory?.monthlyBudget
                      ? '#1890ff'
                      : '#8c8c8c',
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="Số danh mục con"
                  value={childrenCategories.length}
                  prefix={<NodeIndexOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <div>
            <Title level={5}>Danh mục con ({childrenCategories.length})</Title>
            {childrenCategories.length > 0 ? (
              <List
                grid={{ gutter: 12, xs: 1, sm: 2, md: 3 }}
                dataSource={childrenCategories}
                renderItem={(child) => (
                  <List.Item>
                    <Card
                      size="small"
                      style={{ borderRadius: 6 }}
                      styles={{ body: { padding: '4px 4px' } }}
                    >
                      <Space vertical style={{ width: '100%' }}>
                        <Space
                          style={{
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Flex
                            align="center"
                            justify="center"
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              flexShrink: 0,
                              background: `${child.color || '#1677ff'}15`,
                            }}
                          >
                            <IconRenderer
                              iconName={child.icon}
                              color={child.color || '#1677ff'}
                              size={12}
                            />
                          </Flex>
                          <Text strong>{child.name}</Text>
                        </Space>
                        {child.children && child.children.length > 0 && (
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {child.children.length} danh mục cháu
                          </Text>
                        )}
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có danh mục con"
              />
            )}
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {/* --- KHU VỰC BẢNG GIAO DỊCH --- */}
          <div>
            <Title level={5}>
              Danh sách giao dịch ({transactionItems.length})
            </Title>
            <Table<TransactionRow>
              rowKey="id"
              columns={columns}
              dataSource={transactionItems}
              size="small"
              pagination="Scroll"
              bordered={false}
            />
          </div>
        </Space>
      )}
    </>
  )

  /* ------------------------- CARD PHỤ ------------------------- */
  const side = (
    <>
      <Title level={5} style={{ margin: 0 }}>
        Vượt mức trung bình
      </Title>
      <Text type="secondary" style={{ fontSize: 13 }}>
        Trung bình: {convertCurrency(aboveAvg.average)} / giao dịch
      </Text>
      <Divider style={{ margin: '12px 0' }} />

      <List<
        Omit<IFinance_TransactionItem, 'category'> & {
          category: Partial<IFinance_Category>
        }
      >
        loading={isLoading}
        dataSource={overcomeTransactionItems}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có giao dịch vượt mức"
            />
          ),
        }}
        style={{ maxHeight: '600px', overflowY: 'auto' }}
        renderItem={(item) => {
          const overPercent = Math.round(
            ((item.amount - aboveAvg.average) / aboveAvg.average) * 100,
          )
          return (
            <List.Item style={{ padding: '10px 0' }}>
              <Flex vertical gap={2} style={{ width: '100%' }}>
                <Flex justify="space-between" align="center" gap={8}>
                  <Text ellipsis style={{ flex: 1, minWidth: 0 }}>
                    {item.description}
                  </Text>
                  <Text strong style={{ color: '#cf1322', flexShrink: 0 }}>
                    {convertCurrency(item.amount)}
                  </Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.createdAt).format('DD/MM/YYYY')}
                  </Text>
                  <Tag color="volcano" style={{ margin: 0 }}>
                    +{overPercent}% so với TB
                  </Tag>
                </Flex>
              </Flex>
            </List.Item>
          )
        }}
      />
    </>
  )

  return (
    <DoubleCardModal
      open={open}
      onClose={onCancel}
      main={main}
      side={side}
      width={1120}
    />
  )
}
