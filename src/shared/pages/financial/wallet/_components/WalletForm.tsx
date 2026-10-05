import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  Card,
  Col,
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
import { CopyOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import {
  FINANCIAL_WALLET_TYPE,
  FinancialWalletTypeHelper,
} from '@/shared/api/financial/wallet/wallet.enum'
import ColorPicker from '@/shared/components/color-picker'
import { IconPicker } from '@/shared/components/icon-picker'
import { InputWithComma } from '@/shared/components/input/utils'
import { useMutationWallet } from '@/shared/api/financial/wallet/wallet.mutation'

const { Text } = Typography

interface WalletModalProps {
  open: boolean
  wallet?: IFinance_Wallet | null
  onCancel: () => void
  onSubmit: (data: Partial<IFinance_Wallet>) => Promise<void>
}

export function WalletModal({
  open,
  wallet,
  onCancel,
  onSubmit,
}: WalletModalProps) {
  const { t } = useTranslation('finance')
  const [form] = Form.useForm()
  const watchColor = Form.useWatch('color', form)
  const watchType = Form.useWatch('type', form)

  const { mWallet_ApiKey } = useMutationWallet()

  const isCreditCard = watchType === FINANCIAL_WALLET_TYPE.E_WALLET
  const isBankOrEwallet =
    watchType === FINANCIAL_WALLET_TYPE.BANK ||
    watchType === FINANCIAL_WALLET_TYPE.E_WALLET

  useEffect(() => {
    if (!open) return

    if (wallet) {
      form.setFieldsValue(wallet)
    } else {
      form.setFieldsValue({
        name: '',
        type: FINANCIAL_WALLET_TYPE.BANK,
        balance: 0,
        color: '#5b5fef',
        icon: 'wallet',
        institutionName: '',
        accountNumberMasked: '',
        creditLimit: 0,
        currentDebt: 0,
        statementDay: 1,
        dueDay: 15,
        isLockedForDailySpending: false,
      })
    }
  }, [open, wallet, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
      form.resetFields()
    } catch {
      // Validation error
    }
  }

  const handleGenerateApiKey = async () => {
    if (!wallet?.id) {
      message.error(t('common.save'))
      return
    }

    try {
      await mWallet_ApiKey.mutateAsync({
        pathParams: { id: wallet.id.toString() },
      })
      message.success(t('common.create'))
    } catch (error) {
      message.error(t('common.noData'))
    }
  }

  const handleCopyApiKey = () => {
    if (wallet?.apiKey) {
      navigator.clipboard.writeText(wallet.apiKey)
      message.success(t('common.save'))
    }
  }

  return (
    <Modal
      open={open}
      title={wallet ? t('common.edit') : t('wallet.add')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden
      width={560}
      centered
    >
      <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
        {/* API Key Box if editing */}
        {wallet && wallet.apiKey && (
          <Alert
            style={{ marginBottom: 16, borderRadius: 10 }}
            type="info"
            showIcon
            icon={<KeyOutlined style={{ color: '#2563eb' }} />}
            message={
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong style={{ fontSize: 13 }}>
                    {t('wallet.apiKey')}
                  </Text>
                </Col>
                <Col>
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<CopyOutlined />}
                    onClick={handleCopyApiKey}
                  >
                    {t('wallet.copy')}
                  </Button>
                </Col>
              </Row>
            }
          />
        )}

        {wallet && !wallet.apiKey && (
          <Alert
            style={{ marginBottom: 16, borderRadius: 10 }}
            type="warning"
            showIcon
            message={
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong style={{ fontSize: 13 }}>
                    {t('wallet.apiKey')}
                  </Text>
                </Col>
                <Col>
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<KeyOutlined />}
                    onClick={handleGenerateApiKey}
                  >
                    {t('wallet.generate')}
                  </Button>
                </Col>
              </Row>
            }
          />
        )}

        {/* Tên ví & Loại ví */}
        <Row gutter={12}>
          <Col span={14}>
            <Form.Item
              label={t('wallet.name')}
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên ví' }]}
            >
              <Input placeholder="Ví dụ: Techcombank Chi Tiêu" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label={t('wallet.typeLabel')}
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn loại ví' }]}
            >
              <Select options={FinancialWalletTypeHelper.getOptions()} />
            </Form.Item>
          </Col>
        </Row>

        {/* Số dư ban đầu / hiện tại */}
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('wallet.balance')}
              name="balance"
              rules={[{ required: true, message: 'Vui lòng nhập số dư' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0"
                {...InputWithComma}
                suffix="VND"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={16}>
            <Form.Item label={t('wallet.color')} name="color">
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('wallet.icon')} name="icon">
              <IconPicker color={watchColor} />
            </Form.Item>
          </Col>
        </Row>

        {/* Thông tin tổ chức tài chính / Ngân hàng */}
        {isBankOrEwallet && (
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label={t('wallet.institution')} name="institutionName">
                <Input placeholder="Ví dụ: MB Bank, VietinBank, Momo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('wallet.accountNumber')}
                name="accountNumberMasked"
                tooltip="Chỉ hiển thị 4 số cuối để nhận biết (Ví dụ: **** 8888)"
              >
                <Input placeholder="Ví dụ: **** 8888" maxLength={64} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Cấu hình đặc thù dành riêng cho Thẻ Tín Dụng */}
        {isCreditCard && (
          <Card
            size="small"
            style={{
              marginBottom: 16,
              background: '#fcfcfc',
              borderColor: '#e8e8e8',
              borderRadius: 12,
            }}
          >
            <Divider
              titlePlacement="left"
              style={{ margin: '4px 0 12px 0', fontSize: 13 }}
            >
              Cấu hình Thẻ Tín Dụng
            </Divider>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label={t('wallet.creditLimit')} name="creditLimit">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    {...InputWithComma}
                    suffix="VND"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('wallet.currentDebt')} name="currentDebt">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    {...InputWithComma}
                    suffix="VND"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={t('wallet.statementDay')}
                  name="statementDay"
                  rules={[
                    {
                      type: 'number',
                      min: 1,
                      max: 31,
                      message: 'Từ ngày 1 - 31',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Ngày (1 - 31)"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('wallet.dueDay')}
                  name="dueDay"
                  rules={[
                    {
                      type: 'number',
                      min: 1,
                      max: 31,
                      message: 'Từ ngày 1 - 31',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Ngày (1 - 31)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {/* Khóa chi tiêu hàng ngày */}
        <Form.Item
          name="isLockedForDailySpending"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LockOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
              <div>
                <span
                  style={{ fontWeight: 600, display: 'block', fontSize: 13 }}
                >
                  Khóa khỏi số dư chi tiêu hàng ngày
                </span>
                <span style={{ fontSize: 11, color: '#8c8c8c' }}>
                  Dùng cho Quỹ khẩn cấp / Tích lũy để tránh tính vào hạn mức chi
                  tiêu hàng ngày
                </span>
              </div>
            </div>
            <Switch size="small" />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
