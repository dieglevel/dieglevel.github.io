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
  message,
} from 'antd'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_STATUS,
  FINANCIAL_GOAL_TYPE,
} from '@/shared/api/financial/goal/goal.enum'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'

const { Text } = Typography

const TYPE_OPTIONS = [
  { label: 'Quỹ khẩn cấp', value: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND },
  { label: 'Mua sắm lớn', value: FINANCIAL_GOAL_TYPE.BIG_PURCHASE },
  { label: 'Du lịch', value: FINANCIAL_GOAL_TYPE.TRAVEL },
  { label: 'Khác', value: FINANCIAL_GOAL_TYPE.OTHER },
]

interface GoalModalProps {
  open: boolean
  initial?: IFinance_Goal | null
  onClose: () => void
  onSuccess?: () => void
}

export const GoalModal: React.FC<GoalModalProps> = ({
  open,
  initial,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const { mGoal_Create, mGoal_Update } = useMutationGoal()

  useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue({
          ...initial,
          deadline: initial.deadline ? dayjs(initial.deadline) : undefined,
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          type: FINANCIAL_GOAL_TYPE.OTHER,
          status: FINANCIAL_GOAL_STATUS.ACTIVE,
          currentAmount: 0,
          isLocked: false,
        })
      }
    }
  }, [open, initial, form])

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      deadline: values.deadline ? values.deadline.toDate() : null,
    }

    if (initial?.id) {
      mGoal_Update.mutate(
        { pathParams: { id: initial.id }, body: payload },
        {
          onSuccess: () => {
            message.success('Cập nhật mục tiêu thành công!')
            onSuccess?.()
            onClose()
          },
          onError: () => message.error('Cập nhật thất bại!'),
        },
      )
    } else {
      mGoal_Create.mutate(
        { body: payload },
        {
          onSuccess: () => {
            message.success('Tạo mục tiêu thành công!')
            onSuccess?.()
            onClose()
          },
          onError: () => message.error('Tạo mục tiêu thất bại!'),
        },
      )
    }
  }

  const isLoading = mGoal_Create.isPending || mGoal_Update.isPending

  return (
    <Modal
      title={initial ? 'Chỉnh sửa mục tiêu' : 'Mục tiêu mới'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      okText={initial ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Tên mục tiêu"
          rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}
        >
          <Input placeholder="Tên mục tiêu" />
        </Form.Item>

        <Form.Item name="type" label="Phân loại" rules={[{ required: true }]}>
          <Select options={TYPE_OPTIONS} />
        </Form.Item>

        <Space style={{ display: 'flex' }} align="start">
          <Form.Item
            name="targetAmount"
            label="Mục tiêu (VND)"
            rules={[{ required: true, message: 'Nhập số tiền mục tiêu' }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="10000000"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="currentAmount"
            label="Đã có (VND)"
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
          </Form.Item>
        </Space>

        <Space style={{ display: 'flex' }} align="start">
          <Form.Item name="deadline" label="Hạn chót" style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="autoContributionAmount"
            label="Trích tự động/tháng"
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="500000"
              min={0}
            />
          </Form.Item>
        </Space>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
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
            <Form.Item name="isLocked" valuePropName="checked" noStyle>
              <Switch
                checkedChildren={<LockOutlined />}
                unCheckedChildren={<UnlockOutlined />}
              />
            </Form.Item>
            <div>
              <Text style={{ fontWeight: 600, display: 'block' }}>
                Khóa rút tiền
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Loại trừ khỏi số dư có thể chi tiêu
              </Text>
            </div>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}
