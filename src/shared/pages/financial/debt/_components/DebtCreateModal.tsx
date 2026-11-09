import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Segmented,
  Select,
  Typography,
} from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { findActiveDebtOfPerson } from '../debt.utils'
import { DEBT_UI_CLASS } from './DebtThemeProvider'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  WalletBalanceSwitch,
  getWalletImpact,
} from '@/shared/components/wallet-balance-switch/WalletBalanceSwitch'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_TYPE_ENUM,
  FinancialDebtDirectionHelper,
  FinancialDebtTypeHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { InputWithComma } from '@/shared/components/input/utils'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text } = Typography
const DATE_FMT = 'YYYY-MM-DD'

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text
    strong
    type="secondary"
    style={{ display: 'block', margin: '4px 0 8px' }}
  >
    {children}
  </Text>
)

/** Giá trị gửi lên khi tạo; có mergeIntoId = cộng vào khoản đang có */
export interface DebtCreateSubmit {
  mergeIntoId?: number
  [key: string]: any
}

interface DebtCreateModalProps {
  open: boolean
  /** Khoản hiện có — để gợi ý cộng dồn khi trùng người + chiều */
  debts: Array<IFinance_Debt>
  isLoadingWallets: boolean
  wallets: Array<IFinance_Wallet>
  onClose: () => void
  onSubmit: (values: DebtCreateSubmit) => Promise<void>
}

export const DebtCreateModal: React.FC<DebtCreateModalProps> = ({
  open,
  debts,
  isLoadingWallets,
  wallets,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('finance')
  const [form] = Form.useForm()

  const selectedDirection = Form.useWatch('direction', form)
  const amount = Number(Form.useWatch('originalAmount', form) || 0)
  const updateWallet: boolean | undefined = Form.useWatch('updateWallet', form)
  const walletId: number | undefined = Form.useWatch('walletId', form)
  const namePerson: string | undefined = Form.useWatch('namePerson', form)
  const existingDebt = findActiveDebtOfPerson(
    debts,
    namePerson,
    selectedDirection,
  )

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({
        direction: FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING,
        type: FINANCIAL_DEBT_TYPE_ENUM.LOAN,
        startDate: dayjs(),
        updateWallet: true,
        addToExisting: true,
      })
    }
  }, [open, form])

  // OUTGOING = mình đi vay → tiền VÀO ví
  // INCOMING = mình cho vay → tiền RA khỏi ví
  const isInflow = selectedDirection === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING
  const { insufficient } = getWalletImpact({
    wallets,
    updateWallet,
    walletId,
    amount,
    isInflow,
  })

  const handleFinish = async (values: any) => {
    const {
      updateWallet: withWallet,
      walletId: wid,
      addToExisting: merge,
      ...rest
    } = values
    await onSubmit({
      ...rest,
      mergeIntoId: existingDebt && merge ? existingDebt.id : undefined,
      startDate: values.startDate.format(DATE_FMT),
      dueDate: values.dueDate ? values.dueDate.format(DATE_FMT) : undefined,
      // Tắt "Cập nhật số dư ví" = chỉ ghi sổ → không gửi walletId
      walletId: withWallet ? wid : undefined,
    })
  }

  return (
    <Modal
      rootClassName={DEBT_UI_CLASS}
      title={t('debtForms.createTitle')}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={t('debtForms.confirm')}
      okButtonProps={{ disabled: insufficient }}
      destroyOnHidden
      width={640}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        style={{ marginTop: 16 }}
      >
        {/* 1. Chiều nợ */}
        <Form.Item name="direction" style={{ marginBottom: 16 }}>
          <Segmented<FINANCIAL_DEBT_DIRECTION_ENUM>
            block
            size="large"
            options={FinancialDebtDirectionHelper.getOptions().map((o) => ({
              value: o.value,
              label: (
                <span>
                  {o.value === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING ? (
                    <ArrowUpOutlined style={{ marginRight: 6 }} />
                  ) : (
                    <ArrowDownOutlined style={{ marginRight: 6 }} />
                  )}
                  {o.label}
                </span>
              ),
            }))}
          />
        </Form.Item>

        {/* 2. Thông tin khoản nợ */}
        <SectionTitle>{t('debtForms.sectionInfo')}</SectionTitle>
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
              name="type"
              label={t('debtForms.type')}
              rules={[{ required: true, message: 'Vui lòng chọn loại nợ' }]}
            >
              <Select options={FinancialDebtTypeHelper.getOptions()} />
            </Form.Item>
          </Col>
        </Row>

        {existingDebt && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message={t('debtForms.existingDebtFound', {
              name: existingDebt.namePerson,
              debt: existingDebt.name,
              amount: convertCurrency(Number(existingDebt.outstandingAmount)),
            })}
            description={
              <Form.Item name="addToExisting" valuePropName="checked" noStyle>
                <Checkbox>{t('debtForms.addToExisting')}</Checkbox>
              </Form.Item>
            }
          />
        )}

        {/* 3. Cập nhật số dư ví hay chỉ ghi sổ */}
        <WalletBalanceSwitch
          title={t('debtForms.updateWallet')}
          hintOff={t('debtForms.alertBookOnly')}
          hintOn={isInflow ? t('debtForms.hintAdd') : t('debtForms.hintDeduct')}
          wallets={wallets}
          isLoadingWallets={isLoadingWallets}
          amount={amount}
          amountField="originalAmount"
          isInflow={isInflow}
        />

        {/* 4. Thời gian & ghi chú */}
        <SectionTitle>{t('debtForms.sectionTime')}</SectionTitle>
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

        <Form.Item
          name="description"
          label={t('debtForms.note')}
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea
            rows={2}
            placeholder={t('debtForms.notePlaceholder')}
          />
        </Form.Item>

        <Text type="secondary">{t('debtForms.description')}</Text>
      </Form>
    </Modal>
  )
}
