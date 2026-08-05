import React, { useEffect } from 'react'
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  message,
} from 'antd'
import dayjs from 'dayjs'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_STATUS,
  FINANCIAL_GOAL_TYPE,
} from '@/shared/api/financial/goal/goal.enum'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'

interface AddGoalModalProps {
  open: boolean
  initialValues?: IFinance_Goal | null
  onClose: () => void
  onSuccess?: () => void
}

export function AddGoalModal({
  open,
  initialValues,
  onClose,
  onSuccess,
}: AddGoalModalProps) {
  const [form] = Form.useForm()
  const { mGoal_Create, mGoal_Update } = useMutationGoal()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        deadline: initialValues.deadline
          ? dayjs(initialValues.deadline)
          : undefined,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        type: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND,
        status: FINANCIAL_GOAL_STATUS.ACTIVE,
        currentAmount: 0,
        isLocked: false,
      })
    }
  }, [initialValues, open, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        deadline: values.deadline ? values.deadline.toDate() : null,
      }

      if (initialValues?.id) {
        // Cập nhật
        mGoal_Update.mutate(
          {
            pathParams: {
              id: initialValues.id,
            },
            body: payload,
          },

          {
            onSuccess: () => {
              message.success('Cập nhật mục tiêu thành công!')
              onSuccess?.()
              onClose()
            },
            onError: () => {
              message.error('Cập nhật thất bại!')
            },
          },
        )
      } else {
        // Tạo mới
        mGoal_Create.mutate(
          { body: payload },
          {
            onSuccess: () => {
              message.success('Tạo mục tiêu thành công!')
              onSuccess?.()
              onClose()
            },
            onError: () => {
              message.error('Tạo mục tiêu thất bại!')
            },
          },
        )
      }
    } catch (err) {
      // Validate failed
    }
  }

  const isSubmitting = mGoal_Create.isPending || mGoal_Update.isPending

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa Mục tiêu' : 'Thêm Mục tiêu Mới'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      okText={initialValues ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
      cancelText="Hủy"
      width={600}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Tên & Loại */}
        <Row gutter={16}>
          <Col xs={24} sm={14}>
            <Form.Item
              name="name"
              label="Tên mục tiêu"
              rules={[
                { required: true, message: 'Vui lòng nhập tên mục tiêu!' },
              ]}
            >
              <Input placeholder="Ví dụ: Mua xe, Quỹ tiết kiệm..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item
              name="type"
              label="Phân loại"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  {
                    value: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND,
                    label: 'Quỹ khẩn cấp',
                  },
                  {
                    value: FINANCIAL_GOAL_TYPE.BIG_PURCHASE,
                    label: 'Mua sắm lớn',
                  },
                  { value: FINANCIAL_GOAL_TYPE.TRAVEL, label: 'Du lịch' },
                  { value: FINANCIAL_GOAL_TYPE.OTHER, label: 'Khác' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Số tiền Target & Current */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="targetAmount"
              label="Số tiền mục tiêu"
              rules={[{ required: true, message: 'Nhập số tiền mục tiêu!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                suffix="VND"
                placeholder="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="currentAmount" label="Số tiền đã có">
              <InputNumber
                style={{ width: '100%' }}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                suffix="VND"
                placeholder="0"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="deadline" label="Hạn chót (Deadline)">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  {
                    value: FINANCIAL_GOAL_STATUS.ACTIVE,
                    label: 'Đang thực hiện',
                  },
                  {
                    value: FINANCIAL_GOAL_STATUS.COMPLETED,
                    label: 'Hoàn thành',
                  },
                  { value: FINANCIAL_GOAL_STATUS.PAUSED, label: 'Tạm dừng' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }}>
          Tự động trích tiền & Cấu hình
        </Divider>

        {/* Auto Contribution Fields */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="autoContributionAmount"
              label="Số tiền tự động trích/tháng"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                suffix="VND"
                placeholder="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="autoContributionDay"
              label="Ngày trích trong tháng (1-31)"
            >
              <InputNumber
                min={1}
                max={31}
                style={{ width: '100%' }}
                placeholder="Ngày 1-31"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={16}>
            <Form.Item name="imageUrl" label="URL Ảnh minh họa">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="isLocked"
              label="Khóa rút tiền"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả / Ghi chú">
          <Input.TextArea rows={2} placeholder="Chi tiết ngắn về mục tiêu..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
