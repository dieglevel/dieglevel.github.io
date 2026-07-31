import React, { useEffect } from 'react'
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { IWallet_Goal } from '@/shared/api/financial/goal/goal.type'

const { Text } = Typography

const TYPE_OPTIONS = [
  { label: 'Emergency Fund', value: 'emergency' },
  { label: 'Big Purchase', value: 'bigpurchase' },
  { label: 'Travel', value: 'travel' },
  { label: 'Custom', value: 'custom' },
]

interface GoalModalProps {
  open: boolean
  initial?: IWallet_Goal | null
  onSave: (g: IWallet_Goal) => void
  onClose: () => void
}

export const GoalModal: React.FC<GoalModalProps> = ({
  open,
  initial,
  onSave,
  onClose,
}) => {
  const [form] = Form.useForm()
  const selectedColor = Form.useWatch('color', form) || '#6366f1'

  useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue({
          ...initial,
          deadline: initial.deadline ? dayjs(initial.deadline) : undefined,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initial, form])

  const handleSubmit = (values: any) => {
    // onSave({
    //   id: initial?.id ?? `goal-${Date.now()}`,
    //   name: values.name.trim(),
    //   type: values.type,
    //   targetAmount: values.targetAmount || 0,
    //   currentAmount: values.currentAmount || 0,
    //   deadline: values.deadline
    //     ? values.deadline.format('YYYY-MM-DD')
    //     : undefined,
    // })
  }

  return (
    <Modal
      title={initial ? 'Edit Goal' : 'New Goal'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={initial ? 'Save Changes' : 'Create Goal'}
      cancelText="Cancel"
      destroyOnClose
      okButtonProps={{
        style: { backgroundColor: selectedColor, borderColor: selectedColor },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          icon: '🎯',
          color: '#6366f1',
          type: 'custom',
          currentAmount: 0,
          locked: false,
        }}
      >
        {/* Row Icon & Color selection */}
        <Form.Item label="Icon & Color" required style={{ marginBottom: 12 }}>
          <Space size="large" align="start">
            <Form.Item name="icon" noStyle></Form.Item>
            <Form.Item name="color" noStyle></Form.Item>
          </Space>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter goal name' }]}
        >
          <Input placeholder="Goal name" />
        </Form.Item>

        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select options={TYPE_OPTIONS} />
        </Form.Item>

        <Space style={{ display: 'flex' }} align="start">
          <Form.Item
            name="targetAmount"
            label="Target ($)"
            rules={[{ required: true, message: 'Enter target' }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="10000"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="currentAmount"
            label="Current ($)"
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
          </Form.Item>
        </Space>

        <Space style={{ display: 'flex' }} align="start">
          <Form.Item name="deadline" label="Deadline" style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="autoSave"
            label="Auto-save/mo ($)"
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: '100%' }} placeholder="500" min={0} />
          </Form.Item>
        </Space>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={2} placeholder="Optional notes..." />
        </Form.Item>

        {/* Lock Funds toggle box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid #f0f0f0',
          }}
        >
          <Space>
            <Form.Item name="locked" valuePropName="checked" noStyle>
              <Switch
                checkedChildren={<LockOutlined />}
                unCheckedChildren={<UnlockOutlined />}
              />
            </Form.Item>
            <div>
              <Text style={{ fontWeight: 600, display: 'block' }}>
                Lock funds
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Exclude from spendable balance
              </Text>
            </div>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}
