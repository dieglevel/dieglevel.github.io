import { useEffect } from 'react'
import { Flex, Form, Input, InputNumber, Modal, Typography } from 'antd'

import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import { InputWithComma } from '@/shared/components/input/utils'
import { IconPicker } from '@/shared/components/icon-picker'
import ColorPicker from '@/shared/components/color-picker'

const { Text } = Typography

interface CategoryModalProps {
  open: boolean
  mode: 'add' | 'edit'
  category?: IFinance_Category | null
  onCancel: () => void
  onSubmit: (data: Omit<IFinance_Category, 'id'>) => Promise<void>
}

export default function CategoryModal({
  open,
  mode,
  category,
  onCancel,
  onSubmit,
}: CategoryModalProps) {
  const [form] = Form.useForm()
  const watchColor = Form.useWatch('color', form)

  useEffect(() => {
    if (!open) return
    form.setFieldsValue(category)
  }, [category, open, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      open={open}
      title={mode === 'add' ? 'Add Category' : 'Edit Category'}
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter category name',
            },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Flex gap={16} align="center">
          <Form.Item
            label="Monthly Budget"
            name="monthlyBudget"
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              style={{ width: '100%', flex: 1 }}
              {...InputWithComma}
              suffix={'VND'}
            />
          </Form.Item>
          <Form.Item label="Icon" name="icon" shouldUpdate>
            <IconPicker color={watchColor} />
          </Form.Item>
        </Flex>

        <Form.Item hidden name="totalSpent">
          <InputNumber />
        </Form.Item>

        <Form.Item label="Color" shouldUpdate>
          <Form.Item noStyle name="color">
            <ColorPicker />
          </Form.Item>
        </Form.Item>

        <Form.Item name="archived" hidden>
          <Input />
        </Form.Item>

        <Text type="secondary">
          The selected icon will automatically update its background color based
          on the chosen color.
        </Text>
      </Form>
    </Modal>
  )
}
