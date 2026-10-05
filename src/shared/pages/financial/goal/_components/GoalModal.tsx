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
import { useTranslation } from 'react-i18next'

const { Text } = Typography

const TYPE_OPTIONS = [
  { label: 'Quỹ khẩn cấp', value: FINANCIAL_GOAL_TYPE.EMERGENCY_FUND },
  { label: 'Tiết kiệm', value: FINANCIAL_GOAL_TYPE.SAVING },
  { label: 'Đầu tư', value: FINANCIAL_GOAL_TYPE.INVESTMENT },
  { label: 'Trả nợ', value: FINANCIAL_GOAL_TYPE.DEBT_PAYMENT },
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
  const { t } = useTranslation('finance')
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
            message.success(t('goal.updateSuccess'))
            onSuccess?.()
            onClose()
          },
          onError: () => message.error(t('goal.error')),
        },
      )
    } else {
      mGoal_Create.mutate(
        { body: payload },
        {
          onSuccess: () => {
            message.success(t('goal.addSuccess'))
            onSuccess?.()
            onClose()
          },
          onError: () => message.error(t('goal.error')),
        },
      )
    }
  }

  const isLoading = mGoal_Create.isPending || mGoal_Update.isPending

  return (
    <Modal
      title={initial ? t('common.edit') : t('goal.add')}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      okText={initial ? t('common.save') : t('goal.add')}
      cancelText={t('common.cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label={t('goal.name')}
          rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}
        >
          <Input placeholder={t('goal.name')} />
        </Form.Item>

        <Form.Item name="type" label={t('goal.type')} rules={[{ required: true }]}>
          <Select options={TYPE_OPTIONS} />
        </Form.Item>

        <Space style={{ display: 'flex' }} align="start">
          <Form.Item
            name="targetAmount"
            label={t('goal.target')}
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
            label={t('goal.current')}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
          </Form.Item>
        </Space>

        <Space style={{ display: 'flex' }} align="start">
          <Form.Item name="deadline" label={t('goal.deadline')} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="autoContributionAmount"
            label={t('goal.autoContribution')}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="500000"
              min={0}
            />
          </Form.Item>
        </Space>

        <Form.Item name="description" label={t('goal.description')}>
          <Input.TextArea rows={2} placeholder={t('goal.note')} />
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
