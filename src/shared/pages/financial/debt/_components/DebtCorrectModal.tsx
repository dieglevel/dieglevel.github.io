import React, { useEffect } from 'react'
import {
  Alert,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
} from 'antd'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import { FINANCIAL_DEBT_DIRECTION_ENUM } from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { InputWithComma } from '@/shared/components/input/utils'

const { Text } = Typography

interface Props {
  open: boolean
  debt: IFinance_Debt | null
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
}

export const DebtCorrectModal: React.FC<Props> = ({
  open,
  debt,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm()
  const newOriginal = Form.useWatch('originalAmount', form)

  useEffect(() => {
    if (open && debt) {
      form.resetFields()
      form.setFieldsValue({ originalAmount: Number(debt.originalAmount) })
    }
  }, [open, debt, form])

  if (!debt) return null

  const paid = Number(debt.originalAmount) - Number(debt.outstandingAmount)
  const diff =
    Number(newOriginal ?? debt.originalAmount) - Number(debt.originalAmount)
  const newOutstanding = Number(newOriginal ?? 0) - paid
  const isBorrowing = debt.direction === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING
  const walletChange = isBorrowing ? diff : -diff

  return (
    <Modal
      title={`Sửa số tiền gốc: ${debt.name}`}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: diff === 0 || newOutstanding < 0 }}
      destroyOnClose
      width={480}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ marginTop: 16 }}
      >
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 12 }}
          message="Dùng khi nhập sai số tiền lúc tạo. Số đã thu/trả được giữ nguyên, ví (nếu có dùng lúc tạo) sẽ tự bù chênh lệch."
        />

        <Card
          size="small"
          style={{ backgroundColor: '#fafafa', marginBottom: 16 }}
        >
          <Flex vertical gap={4}>
            <Flex justify="space-between">
              <Text type="secondary">Gốc hiện tại:</Text>
              <Text strong>{convertCurrency(debt.originalAmount)}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text type="secondary">Đã thu/trả:</Text>
              <Text strong>{convertCurrency(paid)}</Text>
            </Flex>
          </Flex>
        </Card>

        <Form.Item
          name="originalAmount"
          label="Số tiền gốc đúng"
          rules={[
            { required: true, message: 'Vui lòng nhập số tiền' },
            { type: 'number', min: 0.01, message: 'Số tiền phải lớn hơn 0' },
            {
              type: 'number',
              min: paid,
              message: 'Không được nhỏ hơn số đã thu/trả',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            precision={2}
            {...InputWithComma}
          />
        </Form.Item>

        {diff !== 0 && newOutstanding >= 0 && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Flex vertical gap={4}>
              <Flex justify="space-between">
                <Text type="secondary">Dư nợ mới:</Text>
                <Text strong style={{ color: '#1677ff' }}>
                  {convertCurrency(newOutstanding)}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">Bù vào ví lúc tạo (nếu có):</Text>
                <Text
                  strong
                  style={{ color: walletChange > 0 ? '#52c41a' : '#ff4d4f' }}
                >
                  {walletChange > 0 ? '+' : ''}
                  {convertCurrency(walletChange)}
                </Text>
              </Flex>
            </Flex>
          </Card>
        )}

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea
            rows={2}
            maxLength={500}
            placeholder="Vd: Nhập nhầm dư một số 0"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
