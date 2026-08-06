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
  Typography,
  message,
} from 'antd'
import dayjs from 'dayjs'
import type { IFinance_Goal } from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_STATUS,
  FINANCIAL_GOAL_TYPE,
} from '@/shared/api/financial/goal/goal.enum'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'

const { Text } = Typography

interface AddGoalModalProps {
  open: boolean
  initialValues?: IFinance_Goal | null
  onClose: () => void
}

const TYPE_OPTIONS = [
  { value: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND, label: '🚨 Quỹ khẩn cấp' },
  { value: FINANCIAL_GOAL_TYPE.DEBT_PAYMENT, label: '� Trả nợ' },
  { value: FINANCIAL_GOAL_TYPE.INVESTMENT, label: '✈️ Đầu tư' },
  { value: FINANCIAL_GOAL_TYPE.SAVING, label: '💰 Tiết kiệm' },
  { value: FINANCIAL_GOAL_TYPE.OTHER, label: '📌 Khác' },
]

const STATUS_OPTIONS = [
  { value: FINANCIAL_GOAL_STATUS.ACTIVE, label: 'Đang thực hiện' },
  { value: FINANCIAL_GOAL_STATUS.COMPLETED, label: 'Hoàn thành' },
  { value: FINANCIAL_GOAL_STATUS.CANCELLED, label: 'Đã hủy' },
  { value: FINANCIAL_GOAL_STATUS.INACTIVE, label: 'Không hoạt động' },
]

const SAVING_MODE_OPTIONS = [
  {
    value: FINANCIAL_GOAL_SAVING_MODE.MANUAL,
    label: '🖐️ Tự tích lũy thủ công',
  },
  {
    value: FINANCIAL_GOAL_SAVING_MODE.AUTO,
    label: '⚡ Trích tiền tự động hàng tháng',
  },
]

export function AddGoalModal({
  open,
  initialValues,
  onClose,
}: AddGoalModalProps) {
  const [form] = Form.useForm()
  const { mGoal_Create, mGoal_Update } = useMutationGoal()
  const isEditing = !!initialValues?.id
  const isSubmitting = mGoal_Create.isPending || mGoal_Update.isPending

  // Watch savingMode to toggle auto contribution inputs
  const savingMode = Form.useWatch('savingMode', form)
  const isAutoMode = savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO

  useEffect(() => {
    if (open) {
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
          status: FINANCIAL_GOAL_STATUS.ACTIVE,
          savingMode: FINANCIAL_GOAL_SAVING_MODE.MANUAL,
          type: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND,
          isLocked: false,
          targetAmount: 1,
        })
      }
    }
  }, [initialValues, open, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const payload: any = {
        name: values.name,
        description: values.description || undefined,
        status: values.status,
        type: values.type || undefined,
        targetAmount: values.targetAmount,
        deadline: values.deadline ? values.deadline.toDate() : null,
        savingMode: values.savingMode,
        isLocked: !!values.isLocked,
        imageUrl: values.imageUrl || undefined,
        ...(values.savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO && {
          autoContributionAmount: values.autoContributionAmount,
          autoContributionDay: values.autoContributionDay,
        }),
      }

      if (isEditing) {
        mGoal_Update.mutate(
          {
            pathParams: { id: initialValues.id },
            body: payload,
          },
          {
            onSuccess: () => {
              message.success('Cập nhật mục tiêu thành công!')
              onClose()
            },
          },
        )
      } else {
        mGoal_Create.mutate(
          { body: payload },
          {
            onSuccess: () => {
              message.success('Tạo mục tiêu mới thành công!')
              form.resetFields()
              onClose()
            },
          },
        )
      }
    } catch {
      // Form validation failed
    }
  }

  return (
    <Modal
      title={
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          {isEditing ? '✏️ Chỉnh sửa Mục tiêu' : '🎯 Thêm Mục tiêu Mới'}
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      okText={isEditing ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
      cancelText="Hủy"
      width={650}
      centered
      destroyOnClose
      okButtonProps={{ disabled: isSubmitting }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark="optional"
      >
        {/* Basic Info */}
        <Row gutter={16}>
          <Col xs={24} sm={14}>
            <Form.Item
              name="name"
              label={<Text strong>Tên mục tiêu</Text>}
              rules={[
                { required: true, message: 'Vui lòng nhập tên mục tiêu!' },
              ]}
            >
              <Input
                placeholder="Ví dụ: Mua xe, Quỹ tiết kiệm..."
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item name="type" label={<Text strong>Phân loại</Text>}>
              <Select
                placeholder="Chọn loại mục tiêu"
                options={TYPE_OPTIONS}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Amount, Deadline & Status */}
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="targetAmount"
              label={<Text strong>Mục tiêu cần đạt</Text>}
              rules={[
                { required: true, message: 'Nhập số tiền!' },
                { type: 'number', min: 1, message: 'Tối thiểu 1' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                suffix="VND"
                placeholder="100,000,000"
                min={1}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="deadline"
              label={<Text strong>Hạn chót (Deadline)</Text>}
              rules={[{ required: true, message: 'Chọn ngày hạn chót!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                disabledDate={(current) => current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="status"
              label={<Text strong>Trạng thái</Text>}
              rules={[{ required: true, message: 'Chọn trạng thái!' }]}
            >
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        {/* Saving Mode Section */}
        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ⚙️ HÌNH THỨC TÍCH LŨY
          </Text>
        </Divider>

        <Form.Item
          name="savingMode"
          label={<Text strong>Chế độ tích lũy</Text>}
          rules={[
            { required: true, message: 'Vui lòng chọn hình thức tích lũy!' },
          ]}
        >
          <Select options={SAVING_MODE_OPTIONS} />
        </Form.Item>

        {/* Auto Contribution Fields */}
        {isAutoMode && (
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="autoContributionAmount"
                label="Số tiền trích tự động"
                rules={[
                  { required: true, message: 'Nhập số tiền trích!' },
                  { type: 'number', min: 1, message: 'Tối thiểu 1' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(val) =>
                    `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                  suffix="VND"
                  placeholder="5,000,000"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="autoContributionDay"
                label="Ngày trích hàng tháng (1 - 31)"
                rules={[
                  { required: true, message: 'Chọn ngày trích!' },
                  {
                    type: 'number',
                    min: 1,
                    max: 31,
                    message: 'Từ ngày 1 đến 31',
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={31}
                  style={{ width: '100%' }}
                  placeholder="Ví dụ: 5"
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Image & Lock Options */}
        <Row gutter={16}>
          <Col xs={24} sm={18}>
            <Form.Item name="imageUrl" label="URL Ảnh minh họa">
              <Input placeholder="https://example.com/image.jpg" type="url" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              name="isLocked"
              label="Khóa rút tiền"
              valuePropName="checked"
            >
              <Switch
                size="small"
                checkedChildren="Có"
                unCheckedChildren="Không"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Form.Item
          name="description"
          label={<Text strong>Mô tả / Ghi chú</Text>}
        >
          <Input.TextArea
            rows={2}
            placeholder="Chi tiết thêm về mục tiêu này..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
