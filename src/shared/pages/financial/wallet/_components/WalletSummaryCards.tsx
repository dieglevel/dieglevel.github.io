import React from 'react'
import { Card, Col, Flex, Row, Typography } from 'antd'
import { CreditCard, Lock, TrendingUp, Wallet } from 'lucide-react'
import type { IFinance_Wallet } from '@/shared/api/financial/wallet/wallet.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text, Title } = Typography

interface WalletSummaryCardsProps {
  wallets: Array<IFinance_Wallet>
}

export const WalletSummaryCards: React.FC<WalletSummaryCardsProps> = ({
  wallets,
}) => {
  const { mode } = useThemeMode()
  const { colors } = getTokens(mode)

  const totalBalance = wallets.reduce((s, w) => s + Number(w.balance || 0), 0)

  const availableBalance = wallets
    .filter((w) => !w.isLockedForDailySpending)
    .reduce((s, w) => s + Number(w.balance || 0), 0)

  const lockedBalance = wallets
    .filter((w) => w.isLockedForDailySpending)
    .reduce((s, w) => s + Number(w.balance || 0), 0)

  const totalCreditDebt = wallets.reduce(
    (s, w) => s + Number(w.currentDebt || 0),
    0,
  )

  const availablePercent =
    totalBalance > 0 ? Math.round((availableBalance / totalBalance) * 100) : 100

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
      {/* 1. Tong So Du */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 14,
            border: `1px solid ${colors.primary.soft}`,
            background: `linear-gradient(135deg, ${colors.primary.soft} 0%, ${colors.primary.base} 100%)`,
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                TỔNG TÀI SẢN VÍ
              </Text>
              <Title level={4} style={{ margin: '4px 0 0 0' }}>
                {convertCurrency(totalBalance)}
              </Title>
            </div>
            <div
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: colors.primary.soft,
                color: colors.primary.text,
                display: 'flex',
              }}
            >
              <Wallet size={20} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tổng số ví active:{' '}
            <strong style={{ color: colors.primary.text }}>
              {wallets.length} ví
            </strong>
          </Text>
        </Card>
      </Col>

      {/* 2. Kha dung chi tieu */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 14,
            border: `1px solid ${colors.success.soft}`,
            background: `linear-gradient(135deg, ${colors.success.soft} 0%, ${colors.success.base} 100%)`,
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.06)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text style={{ fontSize: 12, fontWeight: 600 }}>
                KHẢ DỤNG CHI TIÊU
              </Text>
              <Title
                level={4}
                style={{ margin: '4px 0 0 0', color: '#16a34a' }}
              >
                {convertCurrency(availableBalance)}
              </Title>
            </div>
            <div
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
              }}
            >
              <TrendingUp size={20} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Chiếm{' '}
            <strong style={{ color: '#16a34a' }}>{availablePercent}%</strong>{' '}
            tổng tài sản
          </Text>
        </Card>
      </Col>

      {/* 3. Tich luy khach hang / locked */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 14,
            border: `1px solid ${colors.warning.soft}`,
            background: `linear-gradient(135deg, ${colors.warning.soft} 0%, ${colors.warning.base} 100%)`,
            boxShadow: '0 2px 10px rgba(249, 115, 22, 0.06)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                QUỸ TÍCH LŨY (KHÓA)
              </Text>
              <Title
                level={4}
                style={{ margin: '4px 0 0 0', color: '#ea580c' }}
              >
                {convertCurrency(lockedBalance)}
              </Title>
            </div>
            <div
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
              }}
            >
              <Lock size={20} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Ví loại trừ chi tiêu hàng ngày
          </Text>
        </Card>
      </Col>

      {/* 4. Tong du no the */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 14,
            border: `1px solid ${colors.error.soft}`,
            background: `linear-gradient(135deg, ${colors.error.soft} 0%, ${colors.error.base} 100%)`,
            boxShadow: '0 2px 10px rgba(225, 29, 72, 0.06)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                DƯ NỢ THẺ TÍN DỤNG
              </Text>
              <Title
                level={4}
                style={{ margin: '4px 0 0 0', color: '#e11d48' }}
              >
                {convertCurrency(totalCreditDebt)}
              </Title>
            </div>
            <div
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: '#ffe4e6',
                color: '#e11d48',
                display: 'flex',
              }}
            >
              <CreditCard size={20} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tổng nghĩa vụ thẻ đến hạn
          </Text>
        </Card>
      </Col>
    </Row>
  )
}
