import {
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Grid,
  Modal,
  Space,
  Tag,
  Typography,
} from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import Table from '@/shared/components/table'
import { FINANCIAL_TRANSACTION_STATUS_LABEL } from '@/shared/api/financial/transaction/transaction.enum'

const { useBreakpoint } = Grid

interface TransactionDetailProps {
  viewTransaction: IFinance_Transaction | null
  setViewTransaction: (transaction: IFinance_Transaction | null) => void
}

export function TransactionDetail({
  viewTransaction,
  setViewTransaction,
}: TransactionDetailProps) {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  return (
    <Modal
      title="Transaction Details"
      open={!!viewTransaction}
      onCancel={() => setViewTransaction(null)}
      footer={[
        <Button key="close" onClick={() => setViewTransaction(null)}>
          Close
        </Button>,
      ]}
      width={560}
      centered
    >
      {viewTransaction && (
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
              backgroundColor:
                viewTransaction.type === 'income' ? '#f6ffed' : '#fff2f0',
              borderColor:
                viewTransaction.type === 'income' ? '#b7eb8f' : '#ffccc7',
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              TOTAL AMOUNT
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color:
                  viewTransaction.type === 'income' ? '#52c41a' : '#ff4d4f',
              }}
            >
              {viewTransaction.type === 'income' ? '+' : '-'}
              {convertCurrency(viewTransaction.amount)}
            </Title>
          </Card>

          {/* Thông tin cơ bản */}
          <Descriptions column={isMobile ? 1 : 2} bordered size="small">
            <Descriptions.Item label="Description" span={2}>
              <Text strong>{viewTransaction.description}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Type">
              <Tag
                color={viewTransaction.type === 'income' ? 'green' : 'volcano'}
              >
                {viewTransaction.type.toUpperCase()}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag
                color={
                  FINANCIAL_TRANSACTION_STATUS_LABEL[viewTransaction.status]
                    .color || 'default'
                }
              >
                {viewTransaction.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Wallet" span={2}>
              <Flex align="center" gap={6}>
                <IconRenderer
                  iconName={viewTransaction.wallet?.icon}
                  size={14}
                />
                <span>{viewTransaction.wallet?.name || '-'}</span>
              </Flex>
            </Descriptions.Item>

            <Descriptions.Item label="Date" span={2}>
              <Flex align="center" justify="space-between">
                <Typography.Text style={{ fontSize: 12 }}>
                  {new Date(viewTransaction.createdAt).toLocaleDateString()}
                </Typography.Text>
                <Typography.Text style={{ fontSize: 12 }}>
                  {new Date(viewTransaction.createdAt).toLocaleTimeString()}
                </Typography.Text>
              </Flex>
            </Descriptions.Item>
          </Descriptions>

          {/* Danh sách các chi tiết hạng mục (Advance Transactions) */}
          {viewTransaction.financialAdvanceTransactions &&
            viewTransaction.financialAdvanceTransactions.length > 0 && (
              <div>
                <Divider
                  orientation="horizontal"
                  style={{ margin: '12px 0', fontSize: 14 }}
                >
                  Breakdown Items (
                  {viewTransaction.financialAdvanceTransactions.length})
                </Divider>

                <Table
                  size="small"
                  footer={undefined}
                  rowKey="id"
                  dataSource={viewTransaction.financialAdvanceTransactions}
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
                        convertCurrency(Number(amt)),
                    },
                  ]}
                />
              </div>
            )}
        </Space>
      )}
    </Modal>
  )
}
