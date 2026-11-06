import React from 'react'
import { Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import dayjs from 'dayjs'
import { WidgetCard } from './WidgetCard'
import { getVizColors } from './viz'
import type { DashboardRecentTransactionItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface RecentTransactionsWidgetProps {
  recentTransactions: Array<DashboardRecentTransactionItem>
  onNavigateToTransactions: () => void
}

export const RecentTransactionsWidget: React.FC<
  RecentTransactionsWidgetProps
> = ({ recentTransactions, onNavigateToTransactions }) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, radius, colors } = getTokens(mode)
  const viz = getVizColors(mode)

  return (
    <WidgetCard
      icon={<Clock size={18} />}
      title={t('transactions.title')}
      action={{
        label: t('transactions.viewAll'),
        onClick: onNavigateToTransactions,
      }}
    >
      {recentTransactions.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            padding: '40px 0',
          }}
        >
          <Empty description={t('transactions.empty')} />
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {recentTransactions.map((tx, i) => {
            const isIncome = tx.type === 'INCOME'
            const isExpense = tx.type === 'EXPENSE'
            // Icon mang màu thu/chi (cùng màu biểu đồ); số tiền dùng màu chữ + dấu
            const tone = isIncome
              ? viz.income
              : isExpense
                ? viz.expense
                : colors.neutral.base
            const Icon = isIncome
              ? ArrowUpRight
              : isExpense
                ? ArrowDownRight
                : ArrowLeftRight

            return (
              <li
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${border.light}`,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: radius.md,
                    display: 'grid',
                    placeItems: 'center',
                    background: `color-mix(in srgb, ${tone} 16%, transparent)`,
                    color: tone,
                  }}
                >
                  <Icon size={18} />
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text strong ellipsis style={{ display: 'block' }}>
                    {tx.description ||
                      tx.merchant ||
                      t('transactions.defaultDescription')}
                  </Text>
                  <Text type="secondary" ellipsis style={{ display: 'block' }}>
                    {[
                      tx.walletName || t('transactions.defaultWallet'),
                      tx.categoryName,
                      dayjs(tx.createdAt).format('DD/MM HH:mm'),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </div>

                <Text strong style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {isIncome ? '+' : isExpense ? '−' : ''}
                  {convertCurrency(Math.abs(tx.amount))}
                </Text>
              </li>
            )
          })}
        </ul>
      )}
    </WidgetCard>
  )
}
