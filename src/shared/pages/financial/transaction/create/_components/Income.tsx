import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  TreeSelect,
  Typography,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { InputWithComma } from '@/shared/components/input/utils'

const { Text, Title } = Typography

interface IncomeProps {
  selectedType: FINANCIAL_TRANSACTION_TYPE
  selectedOriginalTx?: IFinance_Transaction
  isLoadingCategories: boolean
  categories?: Array<IFinance_Category>
  calculatedTotalAmount: number
}

export default function Income({
  selectedType,
  selectedOriginalTx,
  categories,
  calculatedTotalAmount,
}: IncomeProps) {
  return (
    <Card
      title="Chi tiết các khoản (Transaction Items)"
      style={{ height: '100%' }}
    >
      <Card
        size="small"
        style={{
          backgroundColor: '#f6ffed',
          borderColor: '#b7eb8f',
          marginBottom: 20,
        }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
          <Text type="secondary">
            {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND
              ? 'Tổng tiền hoàn nhận lại:'
              : 'Tổng tiền giao dịch:'}
          </Text>
          <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
            {calculatedTotalAmount.toLocaleString('vi-VN')} đ
          </Title>
        </Flex>
      </Card>
      {selectedType === FINANCIAL_TRANSACTION_TYPE.REFUND &&
        selectedOriginalTx && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message={`Đang hoàn tiền cho giao dịch gốc #${selectedOriginalTx.id}`}
            description={`Tổng giá trị ban đầu: ${selectedOriginalTx.amount.toLocaleString('vi-VN')} đ. Bạn có thể điều chỉnh số tiền hoàn cho từng khoản bên dưới.`}
          />
        )}

      <Form.Item required style={{ marginBottom: 12 }}>
        <Form.List
          name="financialTransactionItems"
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length < 1) {
                  return Promise.reject(
                    new Error('Cần ít nhất 1 hạng mục chi tiết'),
                  )
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <Flex vertical gap={12} align="start">
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  style={{
                    background: '#fafafa',
                    borderColor: '#f0f0f0',
                  }}
                  styles={{ body: { padding: 12 } }}
                >
                  <Row gutter={[12, 12]} align="top">
                    <Col xs={24} sm={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[
                          {
                            required: true,
                            message: 'Nhập nội dung',
                          },
                          {
                            whitespace: true,
                            message: 'Không để trống',
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Nội dung chi tiết" />
                      </Form.Item>
                    </Col>

                    <Col xs={18} sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        rules={[
                          {
                            required: true,
                            message: 'Nhập số tiền',
                          },
                          {
                            type: 'number',
                            min: 0.01,
                            message: 'Phải > 0',
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Số tiền"
                          precision={2}
                          {...InputWithComma}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'categoryId']}
                        style={{ marginBottom: 0 }}
                      >
                        <TreeSelect
                          allowClear
                          style={{ width: '100%' }}
                          placeholder="None (Root Category)"
                          treeData={categories}
                          fieldNames={{
                            label: 'name',
                            value: 'id',
                            children: 'children',
                          }}
                          treeTitleRender={(data) => {
                            return (
                              <Flex
                                align="center"
                                gap={8}
                                justify="space-between"
                              >
                                <Flex gap={8} align="center">
                                  <IconRenderer
                                    iconName={data.icon}
                                    size={16}
                                    color={data.color}
                                  />
                                  <Text>{data.name}</Text>
                                </Flex>
                              </Flex>
                            )
                          }}
                          treeDefaultExpandAll
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={6} sm={2} style={{ textAlign: 'right' }}>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      )}
                    </Col>
                  </Row>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() =>
                  add({
                    description: '',
                    amount: 0,
                    categoryId: undefined,
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                Thêm hạng mục
              </Button>
            </Flex>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="amount" hidden>
        <InputNumber />
      </Form.Item>
    </Card>
  )
}
