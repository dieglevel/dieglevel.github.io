import React, { useEffect } from 'react'
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
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
import { useTranslation } from 'react-i18next'
import type {
  IFinance_Goal,
  UpsertFinanceGoalDto,
} from '@/shared/api/financial/goal/goal.type'
import {
  FINANCIAL_GOAL_SAVING_MODE,
  FINANCIAL_GOAL_TYPE,
  FinancialGoalSavingModeHelper,
  FinancialGoalTypeHelper,
} from '@/shared/api/financial/goal/goal.enum'
import { useMutationGoal } from '@/shared/api/financial/goal/goal.mutation'
import { useGetFinance_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography

interface AddGoalModalProps {
  open: boolean
  initialValues?: IFinance_Goal | null
  onClose: () => void
}

// Trạng thái không sửa ở form — đổi qua Tạm dừng / Tiếp tục / Hủy trong chi tiết mục tiêu

export function AddGoalModal({
  open,
  initialValues,
  onClose,
}: AddGoalModalProps) {
  const { t } = useTranslation('finance')
  const [form] = Form.useForm()
  const { mGoal_Create, mGoal_Update } = useMutationGoal()
  const isEditing = !!initialValues?.id
  const isSubmitting = mGoal_Create.isPending || mGoal_Update.isPending
  const { data: walletRes, isLoading: isLoadingWallets } =
    useGetFinance_Wallet_List({})
  const walletOptions = (walletRes?.data ?? []).map((w) => ({
    value: w.id,
    label: `${w.name} · ${convertCurrency(w.balance)}`,
  }))

  // Watch savingMode to toggle auto contribution inputs
  const savingMode = Form.useWatch('savingMode', form)
  const isAutoMode = savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO

  const watchImageUrl = Form.useWatch('imageUrl', form)

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

      const isAuto = values.savingMode === FINANCIAL_GOAL_SAVING_MODE.AUTO
      const payload: UpsertFinanceGoalDto = {
        name: values.name,
        description: values.description || undefined,
        type: values.type || undefined,
        targetAmount: values.targetAmount,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        savingMode: values.savingMode,
        isLocked: !!values.isLocked,
        imageUrl: values.imageUrl || undefined,
        // MANUAL: BE tự xóa cấu hình tự động; gửi null để sửa từ AUTO → MANUAL
        autoContributionAmount: isAuto ? values.autoContributionAmount : null,
        autoContributionDay: isAuto ? values.autoContributionDay : null,
        walletId: isAuto ? (values.walletId ?? null) : null,
      }

      if (isEditing) {
        mGoal_Update.mutate(
          {
            pathParams: { id: initialValues.id },
            body: payload,
          },
          {
            onSuccess: () => {
              message.success(t('goal.updateSuccess'))
              onClose()
            },
          },
        )
      } else {
        mGoal_Create.mutate(
          { body: payload },
          {
            onSuccess: () => {
              message.success(t('goal.addSuccess'))
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
      title={isEditing ? t('common.edit') : t('goal.add')}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      okText={isEditing ? t('common.save') : t('goal.add')}
      cancelText={t('common.cancel')}
      width={650}
      centered
      destroyOnHidden
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
              label={<Text strong>{t('goal.name')}</Text>}
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
            <Form.Item name="type" label={<Text strong>{t('goal.type')}</Text>}>
              <Select
                placeholder={t('goal.selectType')}
                options={FinancialGoalTypeHelper.getOptions()}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Amount, Deadline & Status */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="targetAmount"
              label={<Text strong>{t('goal.target')}</Text>}
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
          <Col xs={24} sm={12}>
            <Form.Item
              name="deadline"
              label={<Text strong>{t('goal.deadline')}</Text>}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder={t('goal.selectDate')}
                disabledDate={(current) => current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Saving Mode Section */}
        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary">{t('goal.savingMode')}</Text>
        </Divider>

        <Form.Item
          name="savingMode"
          label={<Text strong>{t('goal.savingMode')}</Text>}
          rules={[
            { required: true, message: 'Vui lòng chọn hình thức tích lũy!' },
          ]}
        >
          <Select options={FinancialGoalSavingModeHelper.getOptions()} />
        </Form.Item>

        {/* Auto Contribution Fields */}
        {isAutoMode && (
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="autoContributionAmount"
                label={t('goal.autoContribution')}
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
                label={t('goal.contributionDay')}
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
            <Col xs={24}>
              <Form.Item
                name="walletId"
                label={t('goal.defaultWallet')}
                extra={t('goal.defaultWalletHelp')}
              >
                <Select
                  allowClear
                  loading={isLoadingWallets}
                  placeholder={t('goal.noWallet')}
                  options={walletOptions}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Image & Lock Options */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="imageUrl" label={t('goal.imageUrl')}>
              <Input placeholder="https://example.com/image.jpg" type="url" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {watchImageUrl && (
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={watchImageUrl}
                  alt="Goal Image"
                  style={{
                    objectFit: 'cover',
                    borderRadius: 8,
                    height: 80,
                    width: 80,
                  }}
                  fallback="https://via.placeholder.com/80?text=No+Image"
                />
              </div>
            )}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={18}>
            <Form.Item
              name="isLocked"
              label={t('goal.locked')}
              extra={t('goal.lockedHelp')}
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
          label={
            <Text strong>
              {t('goal.description')} / {t('goal.note')}
            </Text>
          }
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
