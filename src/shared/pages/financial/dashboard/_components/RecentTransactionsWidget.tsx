import React from 'react'
import { Button, Card, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowDownRight, ArrowUpRight, Clock, Wallet } from 'lucide-react'
import dayjs from 'dayjs'
import type { DashboardRecentTransactionItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface RecentTransactionsWidgetProps {
  recentTransactions: Array<DashboardRecentTransactionItem>
  onNavigateToTransactions: () => void
}

export const RecentTransactionsWidget: React.FC<
  RecentTransactionsWidgetProps
> = ({ recentTransactions, onNavigateToTransactions }) => {
  const { t } = useTranslation('dashboard')

  return (
    <Card
      title={
        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Clock size={18} color="#16a34a" /> {t('transactions.title')}
        </span>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToTransactions}
          style={{ color: '#16a34a', fontSize: 13 }}
        >
          {t('transactions.viewAll')}
        </Button>
      }
      style={{
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {recentTransactions.length === 0 ? (
        <Empty description={t('transactions.empty')} />
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
                  padding: '12px 16px',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
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
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {tx.description || tx.merchant || t('transactions.defaultDescription')}
                    </div>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: 12,
                        display: 'flex',
                        gap: 8,
                      }}
                    >
                      <span>{tx.walletName || t('transactions.defaultWallet')}</span>
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

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: isIncome
                        ? '#16a34a'
                        : isExpense
                          ? '#dc2626'
                          : '#0f172a',
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
