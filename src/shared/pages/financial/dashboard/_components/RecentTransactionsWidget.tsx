import React from 'react'
import { Button, Card, Empty } from 'antd'
import { ArrowDownRight, ArrowUpRight, Clock, Wallet } from 'lucide-react'
import dayjs from 'dayjs'
import type { DashboardRecentTransactionItem } from '@/shared/api/financial/dashboard/dashboard.type'

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val || 0)
}

interface RecentTransactionsWidgetProps {
  recentTransactions: Array<DashboardRecentTransactionItem>
  onNavigateToTransactions: () => void
}

export const RecentTransactionsWidget: React.FC<
  RecentTransactionsWidgetProps
> = ({ recentTransactions, onNavigateToTransactions }) => {
  return (
    <Card
      title={
        <span
          style={{
            color: '#0f172a',
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Clock size={18} color="#16a34a" /> Giao Dịch Gần Đây
        </span>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToTransactions}
          style={{ color: '#16a34a', fontSize: 13 }}
        >
          Xem tất cả
        </Button>
      }
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {recentTransactions.length === 0 ? (
        <Empty description="Chưa có giao dịch nào" />
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
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
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
                        color: '#0f172a',
                        fontSize: 14,
                      }}
                    >
                      {tx.description || tx.merchant || 'Giao dịch'}
                    </div>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: 12,
                        display: 'flex',
                        gap: 8,
                      }}
                    >
                      <span>{tx.walletName || 'Ví'}</span>
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
                    {formatVND(tx.amount)}
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
