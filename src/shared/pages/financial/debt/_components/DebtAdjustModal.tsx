import React, { useEffect } from 'react'
import { Card, Flex, Form, Input, InputNumber, Modal, Typography } from 'antd'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { InputWithComma } from '@/shared/components/input/utils'

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
  const [form] = Form.useForm()
  const newOutstandingAmount = Form.useWatch('outstandingAmount', form)

  useEffect(() => {
    if (open && debt) {
      form.resetFields()
      form.setFieldsValue({
        outstandingAmount: debt.outstandingAmount,
      })
    }
  }, [open, debt, form])

  if (!debt) return null

  const diff = Number(newOutstandingAmount ?? 0) - debt.outstandingAmount

  const handleFinish = async (values: any) => {
    await onSubmit(values)
  }

  return (
    <Modal
      title={`Điều chỉnh dư nợ: ${debt.name}`}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnClose
      width={480}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Card
          size="small"
          style={{ backgroundColor: '#fafafa', marginBottom: 16 }}
        >
          <Flex justify="space-between" align="center">
            <Text type="secondary">Dư nợ hiện tại:</Text>
            <Text strong type="danger">
              {convertCurrency(debt.outstandingAmount)}
            </Text>
          </Flex>
        </Card>

        <Form.Item
          name="outstandingAmount"
          label="Dư nợ mới"
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
            placeholder="Nhập dư nợ mới..."
            precision={2}
            {...InputWithComma}
          />
        </Form.Item>

        {newOutstandingAmount !== undefined && diff !== 0 && (
          <Card
            size="small"
            style={{
              backgroundColor: diff > 0 ? '#fff2f0' : '#f6ffed',
              borderColor: diff > 0 ? '#ffccc7' : '#b7eb8f',
              marginBottom: 16,
            }}
          >
            <Flex justify="space-between" align="center">
              <Text type="secondary">Chênh lệch điều chỉnh:</Text>
              <Text strong style={{ color: diff > 0 ? '#ff4d4f' : '#52c41a' }}>
                {diff > 0 ? '+' : ''}
                {convertCurrency(diff)}
              </Text>
            </Flex>
          </Card>
        )}

        <Form.Item
          name="note"
          label="Lý do điều chỉnh"
          rules={[
            { required: true, message: 'Vui lòng nhập lý do điều chỉnh' },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Vd: Sai lệch do tính sai lãi, miễn giảm nợ..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
