import {
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Grid,
  Modal,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import Table from '@/shared/components/table'
import {
  FINANCIAL_TRANSACTION_TYPE,
  FinancialTransactionStatusHelper,
} from '@/shared/api/financial/transaction/transaction.enum'
import { useGetFinance_Transaction_View } from '@/shared/api/financial/transaction/useGetFinance_Transaction_View'

const { useBreakpoint } = Grid

interface TransactionDetailProps {
  viewTransaction: number | null
  setViewTransaction: (transaction: number | null) => void
}

export function TransactionDetail({
  viewTransaction,
  setViewTransaction,
}: TransactionDetailProps) {
  const { data: response, isLoading } = useGetFinance_Transaction_View({
    pathParams: {
      id: viewTransaction || 0,
    },
  })

  // Trỏ đúng vào object data bên trong response API
  const transaction = response?.data

  const screens = useBreakpoint()
  const isMobile = !screens.md

  const handleClose = () => setViewTransaction(null)

  const isIncome = transaction?.type === FINANCIAL_TRANSACTION_TYPE.INCOME

  return (
    <Modal
      title="Transaction Details"
      open={!!viewTransaction}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
      width={560}
      centered
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} style={{ marginTop: 16 }} />
      ) : transaction ? (
        <Space
          direction="vertical"
          style={{ width: '100%', marginTop: 12 }}
          size="large"
        >
          {/* Tổng quan số tiền */}
          <Card
            size="small"
            style={{
              textAlign: 'center',
              backgroundColor: isIncome ? '#f6ffed' : '#fff2f0',
              borderColor: isIncome ? '#b7eb8f' : '#ffccc7',
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              TOTAL AMOUNT
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color: isIncome ? '#52c41a' : '#ff4d4f',
              }}
            >
              {isIncome ? '+' : '-'}
              {convertCurrency(transaction.amount)}
            </Title>
          </Card>

          {/* Thông tin cơ bản */}
          <Descriptions column={isMobile ? 1 : 2} bordered size="small">
            <Descriptions.Item label="Description" span={2}>
              <Text strong>{transaction.description || '-'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Type">
              <Tag color={isIncome ? 'green' : 'volcano'}>
                {transaction.type.toUpperCase() || '-'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag
                color={FinancialTransactionStatusHelper.getColor(
                  transaction.status,
                )}
              >
                {transaction.status.toUpperCase() || '-'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Wallet" span={2}>
              <Flex align="center" gap={6}>
                {transaction.wallet?.icon && (
                  <IconRenderer iconName={transaction.wallet.icon} size={14} />
                )}
                <span>{transaction.wallet?.name || '-'}</span>
              </Flex>
            </Descriptions.Item>

            <Descriptions.Item label="Date" span={2}>
              {transaction.createdAt ? (
                <Flex align="center" justify="space-between">
                  <Typography.Text style={{ fontSize: 12 }}>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 12 }}>
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </Typography.Text>
                </Flex>
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>

          {/* Danh sách các chi tiết hạng mục */}
          {transaction.financialTransactionItems &&
            transaction.financialTransactionItems.length > 0 && (
              <div>
                <Divider
                  orientation="horizontal"
                  style={{ margin: '12px 0', fontSize: 14 }}
                >
                  Breakdown Items (
                  {transaction.financialTransactionItems.length})
                </Divider>

                <Table
                  size="small"
                  footer={undefined}
                  rowKey="id"
                  dataSource={transaction.financialTransactionItems}
                  columns={[
                    {
                      title: 'Item Description',
                      dataIndex: 'description',
                      key: 'description',
                    },
                    {
                      title: 'Category',
                      dataIndex: 'category',
                      key: 'category',
                      render: (cat) =>
                        cat ? (
                          <Flex align="center" gap={6}>
                            <IconRenderer iconName={cat.icon} size={12} />
                            <Text style={{ fontSize: 12 }}>{cat.name}</Text>
                          </Flex>
                        ) : (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            -
                          </Text>
                        ),
                    },
                    {
                      title: 'Amount',
                      dataIndex: 'amount',
                      key: 'amount',
                      align: 'right',
                      render: (amt: string | number) =>
                        convertCurrency(Number(amt || 0)),
                    },
                  ]}
                />
              </div>
            )}
        </Space>
      ) : null}
    </Modal>
  )
}
