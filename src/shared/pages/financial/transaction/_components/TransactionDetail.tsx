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

  const transaction = response?.data
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const handleClose = () => setViewTransaction(null)

  // 1. Phân loại chính xác các type thuộc nhóm "Dòng tiền vào" (Income / Refund)
  const isPositiveFlow =
    transaction?.type === FINANCIAL_TRANSACTION_TYPE.INCOME ||
    transaction?.type === FINANCIAL_TRANSACTION_TYPE.REFUND

  return (
    <Modal
      title="Chi tiết giao dịch"
      open={!!viewTransaction}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Đóng
        </Button>,
      ]}
      width={580}
      centered
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 7 }} style={{ marginTop: 16 }} />
      ) : transaction ? (
        <Space
          direction="vertical"
          style={{ width: '100%', marginTop: 12 }}
          size="medium"
        >
          {/* Card Tổng quan số tiền */}
          <Card
            size="small"
            style={{
              textAlign: 'center',
              backgroundColor: isPositiveFlow ? '#f6ffed' : '#fff2f0',
              borderColor: isPositiveFlow ? '#b7eb8f' : '#ffccc7',
            }}
          >
            <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.5 }}>
              TỔNG SỐ TIỀN
            </Text>
            <Title
              level={2}
              style={{
                margin: '2px 0 0 0',
                color: isPositiveFlow ? '#52c41a' : '#ff4d4f',
              }}
            >
              {isPositiveFlow ? '+' : '-'}
              {convertCurrency(transaction.amount)}
            </Title>
          </Card>

          {/* Thông tin chi tiết */}
          <Descriptions column={isMobile ? 1 : 2} bordered size="small">
            <Descriptions.Item label="Ghi chú" span={2}>
              <Text strong>{transaction.description || '-'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Loại giao dịch">
              <Tag color={isPositiveFlow ? 'green' : 'volcano'}>
                {transaction.type}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              <Tag
                color={FinancialTransactionStatusHelper.getColor(
                  transaction.status,
                )}
              >
                {FinancialTransactionStatusHelper.getLabel(transaction.status)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ví thanh toán">
              <Flex align="center" gap={6}>
                {transaction.wallet?.icon && (
                  <IconRenderer
                    iconName={transaction.wallet.icon}
                    size={14}
                    color={transaction.wallet.color}
                  />
                )}
                <Text>{transaction.wallet?.name || '-'}</Text>
              </Flex>
            </Descriptions.Item>

            <Descriptions.Item label="Đối tác / Merchant">
              <Text>{transaction.merchant || '-'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Thời gian" span={2}>
              {transaction.createdAt ? (
                <Flex align="center" justify="space-between">
                  <Text style={{ fontSize: 12 }}>
                    {new Date(transaction.createdAt).toLocaleDateString(
                      'vi-VN',
                    )}
                  </Text>
                  <Text style={{ fontSize: 12 }} type="secondary">
                    {new Date(transaction.createdAt).toLocaleTimeString(
                      'vi-VN',
                    )}
                  </Text>
                </Flex>
              ) : (
                '-'
              )}
            </Descriptions.Item>

            {/* Hiển thị thông tin giao dịch gốc nếu đây là đơn Hoàn tiền (REFUND) */}
            {transaction.originalTransaction && (
              <Descriptions.Item label="Giao dịch gốc" span={2}>
                <Flex align="center" justify="space-between">
                  <Text>
                    #{transaction.originalTransaction.id} -{' '}
                    {transaction.originalTransaction.description}
                  </Text>
                  <Tag color="red">
                    -{convertCurrency(transaction.originalTransaction.amount)}
                  </Tag>
                </Flex>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Danh sách các Item chi tiết */}
          {transaction.financialTransactionItems &&
            transaction.financialTransactionItems.length > 0 && (
              <div>
                <Divider style={{ margin: '16px 0 8px 0', fontSize: 13 }}>
                  Danh sách hạng mục (
                  {transaction.financialTransactionItems.length})
                </Divider>

                <Table
                  size="small"
                  rowKey="id"
                  dataSource={transaction.financialTransactionItems}
                  columns={[
                    {
                      title: 'Mô tả',
                      dataIndex: 'description',
                      key: 'description',
                    },
                    {
                      title: 'Danh mục',
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
                            Chưa phân loại
                          </Text>
                        ),
                    },
                    {
                      title: 'Số tiền',
                      dataIndex: 'amount',
                      key: 'amount',
                      align: 'right',
                      render: (amt: string | number) => (
                        <Text strong style={{ fontSize: 12 }}>
                          {convertCurrency(Number(amt || 0))}
                        </Text>
                      ),
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
