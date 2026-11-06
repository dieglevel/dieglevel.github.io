import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Form, Select, Switch, Typography } from 'antd'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

/**
 * Số dư ví dự kiến sau giao dịch. Dùng ở modal cha để disable nút xác nhận
 * khi ví không đủ tiền.
 */
export const getWalletImpact = (params: {
  wallets: Array<IFinance_Wallet>
  updateWallet?: boolean
  walletId?: number
  amount: number
  isInflow: boolean
}) => {
  const { wallets, updateWallet, walletId, amount, isInflow } = params
  const wallet = updateWallet
    ? wallets.find((w) => w.id === walletId)
    : undefined
  const currentBalance = Number(wallet?.balance || 0)
  const projectedBalance = currentBalance + (isInflow ? amount : -amount)
  return {
    wallet,
    currentBalance,
    projectedBalance,
    insufficient: !!wallet && !isInflow && projectedBalance < 0,
  }
}

interface WalletBalanceSwitchProps {
  wallets: Array<IFinance_Wallet>
  isLoadingWallets: boolean
  amount: number
  /** Tên field số tiền trong form cha — để validate lại ví khi số tiền đổi */
  amountField: string
  /** true = tiền vào ví, false = tiền ra khỏi ví */
  isInflow: boolean
  /** Tiêu đề công tắc, vd "Cập nhật số dư ví" / "Trừ tiền từ ví" */
  title: string
  /** Mô tả khi bật (tiền sẽ vào/ra ví) */
  hintOn: string
  /** Mô tả khi tắt (chỉ ghi sổ) */
  hintOff: string
}

/**
 * Công tắc "có cập nhật số dư ví không" + chọn ví + xem trước số dư.
 * Render Form.Item `updateWallet` (boolean) và `walletId` — phải đặt trong <Form>.
 * Tắt = chỉ ghi sổ; modal cha không gửi walletId lên BE.
 */
export const WalletBalanceSwitch: React.FC<WalletBalanceSwitchProps> = ({
  wallets,
  isLoadingWallets,
  amount,
  amountField,
  isInflow,
  title,
  hintOn,
  hintOff,
}) => {
  const { t } = useTranslation('finance')
  const { mode } = useThemeMode()
  const { border, state, colors } = getTokens(mode)
  const labelId = useId()
  const form = Form.useFormInstance()
  const updateWallet: boolean | undefined = Form.useWatch('updateWallet', form)
  const walletId: number | undefined = Form.useWatch('walletId', form)

  const { wallet, currentBalance, projectedBalance, insufficient } =
    getWalletImpact({ wallets, updateWallet, walletId, amount, isInflow })

  const walletOptions = wallets.map((w) => ({
    value: w.id,
    title: w.name,
    label: (
      <Flex justify="space-between" align="center" gap={8}>
        <Flex align="center" gap={8} style={{ minWidth: 0 }}>
          <IconRenderer iconName={w.icon} />
          <span>{w.name}</span>
        </Flex>
        <Text type="secondary">{convertCurrency(w.balance)}</Text>
      </Flex>
    ),
  }))

  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
  }

  return (
    <div
      style={{
        marginBottom: 20,
        padding: 14,
        border: `1px solid ${border.base}`,
        borderRadius: 12,
      }}
    >
      <div style={{ ...row, alignItems: 'center' }}>
        <div>
          <Text strong id={labelId}>
            {title}
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            {updateWallet ? hintOn : hintOff}
          </Text>
        </div>
        <Form.Item name="updateWallet" valuePropName="checked" noStyle>
          <Switch aria-labelledby={labelId} />
        </Form.Item>
      </div>

      {updateWallet && (
        <>
          <Form.Item
            name="walletId"
            label={t('common.walletSwitch.wallet')}
            style={{ margin: '14px 0 8px' }}
            dependencies={[amountField]}
            rules={[
              {
                required: true,
                message: t('common.walletSwitch.walletRequired'),
              },
              {
                // Đọc giá trị hiện tại của form (không dùng closure của lần render trước)
                validator: (_, wid?: number) =>
                  getWalletImpact({
                    wallets,
                    updateWallet: true,
                    walletId: wid,
                    amount: Number(form.getFieldValue(amountField) || 0),
                    isInflow,
                  }).insufficient
                    ? Promise.reject(
                        new Error(t('common.walletSwitch.insufficient')),
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="title"
              placeholder={t('common.walletSwitch.selectWallet')}
              loading={isLoadingWallets}
              options={walletOptions}
            />
          </Form.Item>

          {wallet && amount > 0 && (
            <div
              style={{
                display: 'grid',
                gap: 4,
                padding: '10px 12px',
                borderRadius: 10,
                background: state.hover,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <div style={row}>
                <Text type="secondary">
                  {t('common.walletSwitch.currentBalance', {
                    name: wallet.name,
                  })}
                </Text>
                <Text strong>{convertCurrency(currentBalance)}</Text>
              </div>
              <div style={row}>
                <Text type="secondary">{t('common.walletSwitch.change')}</Text>
                <Text
                  strong
                  style={{
                    color: isInflow ? colors.success.text : colors.error.text,
                  }}
                >
                  {isInflow ? '+' : '−'}
                  {convertCurrency(amount)}
                </Text>
              </div>
              <div style={row}>
                <Text type="secondary">
                  {t('common.walletSwitch.projected')}
                </Text>
                <Text strong type={insufficient ? 'danger' : undefined}>
                  {convertCurrency(projectedBalance)}
                </Text>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
