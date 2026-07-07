import { useEffect } from 'react'
import { Form, Input, InputNumber, Modal, Typography } from 'antd'

import ColorPicker from './ColorPicker'
import IconPicker from './IconPicker'
import { COLORS, EMPTY_CATEGORY, ICONS } from './constants'
import type { Category } from './constants'

const { Text } = Typography

interface CategoryModalProps {
  open: boolean
  mode: 'add' | 'edit'
  category?: Category | null
  onCancel: () => void
  onSubmit: (data: Omit<Category, 'id'>) => void
}

export default function CategoryModal({
  open,
  mode,
  category,
  onCancel,
  onSubmit,
}: CategoryModalProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!open) return

    form.setFieldsValue(category ?? EMPTY_CATEGORY)
  }, [category, open, form])
  console.log(form.getFieldsValue())

  function handleOk() {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
        form.resetFields()
      })
      .catch(() => {})
  }

  return (
    <Modal
      open={open}
      title={mode === 'add' ? 'Add Category' : 'Edit Category'}
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
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
          <Input placeholder="Food" />
        </Form.Item>

        <Form.Item label="Monthly Budget" name="monthlyBudget">
          <InputNumber min={0} style={{ width: '100%' }} addonBefore="$" />
        </Form.Item>

        <Form.Item hidden name="totalSpent">
          <InputNumber />
        </Form.Item>

        <Form.Item label="Icon" shouldUpdate>
          {() => (
            <Form.Item noStyle name="icon">
              <IconPicker
                icons={ICONS}
                value={form.getFieldValue('icon')}
                color={form.getFieldValue('color')}
                onChange={(icon) => form.setFieldValue('icon', icon)}
              />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item label="Color" shouldUpdate>
          {() => (
            <Form.Item noStyle name="color">
              <ColorPicker
                color={COLORS}
                value={form.getFieldValue('color')}
                onChange={(color) => form.setFieldValue('color', color)}
              />
            </Form.Item>
          )}
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
