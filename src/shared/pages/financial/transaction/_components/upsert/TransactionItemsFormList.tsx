import React from 'react'
import {
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
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { InputWithComma } from '@/shared/components/input/utils'

const { Text } = Typography

interface TransactionItemsFormListProps {
  fieldName?: string
  categories?: Array<IFinance_Category>
}

export const TransactionItemsFormList: React.FC<
  TransactionItemsFormListProps
> = ({ fieldName = 'financialTransactionItems', categories = [] }) => {
  return (
    <Form.Item required style={{ marginBottom: 12 }}>
      <Form.List
        name={fieldName}
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
          <Flex vertical gap={12} align="stretch">
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

                  <Col xs={16} sm={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[
                        { required: true, message: 'Nhập số tiền' },
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

                  <Col xs={20} sm={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'categoryId']}
                      style={{ marginBottom: 0 }}
                    >
                      <TreeSelect
                        allowClear
                        style={{ width: '100%' }}
                        styles={{
                          popup: {
                            root: {
                              minWidth: 'max-content',
                            },
                          },
                        }}
                        placeholder="Danh mục"
                        treeData={categories}
                        fieldNames={{
                          label: 'name',
                          value: 'id',
                          children: 'children',
                        }}
                        treeTitleRender={(data) => (
                          <Flex align="center" gap={8}>
                            <IconRenderer
                              iconName={data.icon}
                              size={16}
                              color={data.color}
                            />
                            <Text>{data.name}</Text>
                          </Flex>
                        )}
                        treeDefaultExpandAll
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={4} sm={2} style={{ textAlign: 'right' }}>
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
  )
}
