import React from 'react'
import { Button, Card, Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowDownRight, ArrowUpRight, Clock, Wallet } from 'lucide-react'
import dayjs from 'dayjs'
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
  const { border, state, radius, text } = getTokens(mode)

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.md,
              background: '#16a34a18',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={18} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {t('transactions.title')}
          </span>
        </div>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToTransactions}
          style={{
            color: '#16a34a',
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {t('transactions.viewAll')}
          <ArrowUpRight size={14} />
        </Button>
      }
      style={{
        borderRadius: radius.lg,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px',
        },
      }}
    >
      {recentTransactions.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
          }}
        >
          <Empty description={t('transactions.empty')} />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === 'INCOME'
            const isExpense = tx.type === 'EXPENSE'
            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: radius.md,
                  border: `1px solid ${border.base}`,
                  background: state.hover,
                  transition: 'transform 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radius.sm,
                      background: isIncome
                        ? '#dcfce7'
                        : isExpense
                          ? '#fee2e2'
                          : '#e0f2fe',
                      color: isIncome
                        ? '#16a34a'
                        : isExpense
                          ? '#dc2626'
                          : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isIncome ? (
                      <ArrowUpRight size={18} />
                    ) : isExpense ? (
                      <ArrowDownRight size={18} />
                    ) : (
                      <Wallet size={18} />
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {tx.description ||
                        tx.merchant ||
                        t('transactions.defaultDescription')}
                    </div>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>
                        {tx.walletName || t('transactions.defaultWallet')}
                      </span>
                      {tx.categoryName && (
                        <>
                          <span>•</span>
                          <span>{tx.categoryName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>
                        {dayjs(tx.createdAt).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: isIncome
                        ? '#16a34a'
                        : isExpense
                          ? '#dc2626'
                          : text.primary,
                    }}
                  >
                    {isIncome ? '+' : isExpense ? '-' : ''}
                    {convertCurrency(tx.amount)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
