import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography /* thêm */,
} from 'antd'
import dayjs from 'dayjs'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { InputWithComma } from '@/shared/components/input/utils'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface DebtAdjustModalProps {
  open: boolean
  debt: IFinance_Debt | null
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
}

export const DebtAdjustModal: React.FC<DebtAdjustModalProps> = ({
  open,
  debt,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('finance')
  const { mode } = useThemeMode()
  const { colors } = getTokens(mode)

  const [form] = Form.useForm()
  const newOutstandingAmount = Form.useWatch('outstandingAmount', form)

  useEffect(() => {
    if (open && debt) {
      form.setFieldsValue({
        outstandingAmount: Number(debt.outstandingAmount),
        occurredAt: dayjs(),
      })
    }
  }, [open, debt, form])

  if (!debt) return null

  const diff = Number(newOutstandingAmount ?? 0) - debt.outstandingAmount

  const handleFinish = async (values: any) => {
    await onSubmit({
      ...values,
      occurredAt: values.occurredAt.format('YYYY-MM-DD'),
    })
  }

  return (
    <Modal
      title={t('debtForms.adjustTitle', { name: debt.name })}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnHidden
      width={480}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Card size="small" style={{ marginBottom: 16 }}>
          <Flex justify="space-between" align="center">
            <Text type="secondary">{t('debt.currentBalance')}:</Text>
            <Text strong type="danger">
              {convertCurrency(debt.outstandingAmount)}
            </Text>
          </Flex>
        </Card>

        <Form.Item
          name="outstandingAmount"
          label={t('debtForms.newBalance')}
          rules={[
            { required: true, message: 'Vui lòng nhập dư nợ mới' },
            {
              type: 'number',
              min: 0,
              message: 'Dư nợ không thể âm',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('debtForms.amountPlaceholder')}
            precision={2}
            {...InputWithComma}
          />
        </Form.Item>

        {newOutstandingAmount !== undefined && diff !== 0 && (
          <Card
            size="small"
            style={{
              backgroundColor:
                diff > 0 ? colors.error.soft : colors.success.soft,
              borderColor: diff > 0 ? colors.error.base : colors.success.base,
              marginBottom: 16,
            }}
          >
            <Flex justify="space-between" align="center">
              <Text type="secondary">{t('debtForms.difference')}</Text>
              <Text strong style={{ color: diff > 0 ? '#ff4d4f' : '#52c41a' }}>
                {diff > 0 ? '+' : ''}
                {convertCurrency(diff)}
              </Text>
            </Flex>
          </Card>
        )}
        <Form.Item
          name="occurredAt"
          label={t('debtForms.adjustDate')}
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          name="note"
          label={t('debtForms.adjustReason')}
          rules={[
            { required: true, message: 'Vui lòng nhập lý do điều chỉnh' },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder={t('debtForms.adjustReasonPlaceholder')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
