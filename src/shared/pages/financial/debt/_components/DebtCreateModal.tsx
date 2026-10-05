import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_TYPE_ENUM,
  FinancialDebtDirectionHelper,
  FinancialDebtTypeHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { InputWithComma } from '@/shared/components/input/utils'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography
const DATE_FMT = 'YYYY-MM-DD'

interface DebtCreateModalProps {
  open: boolean
  isLoadingWallets: boolean
  wallets: Array<IFinance_Wallet>
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
}

export const DebtCreateModal: React.FC<DebtCreateModalProps> = ({
  open,
  isLoadingWallets,
  wallets,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('finance')
  const { mode } = useThemeMode()
  const { colors } = getTokens(mode)

  const [form] = Form.useForm()

  const selectedDirection = Form.useWatch('direction', form)
  const originalAmount = Form.useWatch('originalAmount', form)
  const selectedWalletId = Form.useWatch('walletId', form)

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId)

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        direction: FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING,
        type: FINANCIAL_DEBT_TYPE_ENUM.LOAN,
        startDate: dayjs(),
      })
    }
  }, [open, form])

  const walletOptions = wallets.map((w) => ({
    value: w.id,
    label: (
      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
        <Flex align="center" gap={8}>
          <IconRenderer iconName={w.icon} />
          <Text style={{ fontSize: 13 }}>{w.name}</Text>
        </Flex>
        <Text
          type="secondary"
          style={{ fontSize: 12, fontFamily: 'monospace' }}
        >
          {convertCurrency(w.balance)}
        </Text>
      </Flex>
    ),
  }))

  // OUTGOING = mình nợ người khác → tiền VÀO ví
  // INCOMING = người khác nợ mình → tiền RA khỏi ví
  const isBorrowing =
    selectedDirection === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING
  const currentBalance = Number(selectedWallet?.balance || 0)
  const amountNumber = Number(originalAmount || 0)
  const walletChange = isBorrowing ? amountNumber : -amountNumber
  const projectedBalance = currentBalance + walletChange
  const insufficient = !!selectedWallet && projectedBalance < 0

  const alertMessage = !selectedWallet
    ? t('debtForms.alertBookOnly')
    : isBorrowing
      ? t('debtForms.alertBorrow')
      : t('debtForms.alertLend')

  const handleFinish = async (values: any) => {
    await onSubmit({
      ...values,
      startDate: values.startDate.format(DATE_FMT),
      dueDate: values.dueDate ? values.dueDate.format(DATE_FMT) : undefined,
      walletId: values.walletId ?? undefined,
    })
  }

  return (
    <Modal
      title={t('debtForms.createTitle')}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: insufficient }}
      destroyOnHidden
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Alert
          type={selectedWallet ? (isBorrowing ? 'info' : 'warning') : 'info'}
          showIcon
          style={{ marginBottom: 12 }}
          message={alertMessage}
          description={t('debtForms.description')}
        />

        {selectedWallet && amountNumber > 0 && (
          <Card
            size="small"
            style={{
              marginBottom: 16,
              backgroundColor: isBorrowing
                ? colors.success.soft
                : colors.error.soft,
              borderColor: isBorrowing
                ? colors.success.base
                : colors.error.base,
            }}
          >
            <Flex vertical gap={6}>
              <Flex justify="space-between">
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t('debtForms.currentWalletBalance', { name: selectedWallet.name })}
                </Text>
                <Text
                  strong
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {convertCurrency(currentBalance)}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {t('debtForms.walletChange')}
                </Text>
                <Text
                  strong
                  style={{
                    color: isBorrowing ? '#52c41a' : '#ff4d4f',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {isBorrowing ? '+' : '-'}
                  {convertCurrency(amountNumber)}
                </Text>
              </Flex>
              <Flex
                justify="space-between"
                style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 6 }}
              >
                <Text strong style={{ fontSize: 13 }}>
                  {t('debtForms.projectedBalance')}
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: 15,
                    color: insufficient ? '#dc2626' : '#1677ff',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {convertCurrency(projectedBalance)}
                </Text>
              </Flex>
              {insufficient && (
                <Text type="danger" style={{ fontSize: 12 }}>
                  {t('debtForms.insufficient')}
                </Text>
              )}
            </Flex>
          </Card>
        )}

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label={t('debtForms.name')}
              rules={[
                { required: true, message: 'Vui lòng nhập tên khoản nợ' },
              ]}
            >
              <Input placeholder={t('debtForms.namePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="namePerson"
              label={t('debtForms.partner')}
              rules={[{ required: true, message: 'Vui lòng nhập tên đối tác' }]}
            >
              <Input placeholder={t('debtForms.partnerPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="direction"
              label={t('debtForms.direction')}
              rules={[{ required: true, message: 'Vui lòng chọn chiều nợ' }]}
            >
              <Select options={FinancialDebtDirectionHelper.getOptions()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label={t('debtForms.type')}
              rules={[{ required: true, message: 'Vui lòng chọn loại nợ' }]}
            >
              <Select options={FinancialDebtTypeHelper.getOptions()} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="originalAmount"
              label={t('debtForms.originalAmount')}
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền' },
                {
                  type: 'number',
                  min: 0.01,
                  message: 'Số tiền phải lớn hơn 0',
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
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="walletId"
              label={t('debtForms.relatedWallet')}
              tooltip="Bỏ trống nếu chỉ muốn ghi sổ, không thay đổi số dư ví nào."
            >
              <Select
                allowClear
                placeholder={t('debtForms.walletBookOnly')}
                loading={isLoadingWallets}
                options={walletOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="startDate"
              label={t('debtForms.startDate')}
              rules={[
                { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                allowClear={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="dueDate"
              label={t('debtForms.dueDate')}
              dependencies={['startDate']}
              rules={[
                ({ getFieldValue }) => ({
                  validator: (_, v) =>
                    !v ||
                    !getFieldValue('startDate') ||
                    !v.isBefore(getFieldValue('startDate'), 'day')
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('Hạn trả không được trước ngày bắt đầu'),
                        ),
                }),
              ]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={t('debtForms.note')}>
          <Input.TextArea rows={3} placeholder={t('debtForms.notePlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
