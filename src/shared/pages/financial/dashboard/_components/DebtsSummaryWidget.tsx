import React from 'react'
import { Button, Card, Empty, Progress, Space, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowDownLeft, ArrowUpRight, Calendar, HandCoins, PlusCircle } from 'lucide-react'
import dayjs from 'dayjs'
import type { DebtSummaryItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface DebtsSummaryWidgetProps {
  debtsSummary: Array<DebtSummaryItem>
  onNavigateToDebts: () => void
}

export const DebtsSummaryWidget: React.FC<DebtsSummaryWidgetProps> = ({
  debtsSummary,
  onNavigateToDebts,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border, state, radius } = getTokens(mode)

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.md,
              background: '#f59e0b18',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HandCoins size={18} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {t('debts.title')}
          </span>
        </div>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={onNavigateToDebts}
          style={{
            color: '#d97706',
            fontSize: 13,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {t('debts.manage')}
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
      {debtsSummary.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 0',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: 13 }}>
                {t('debts.empty')}
              </Text>
            }
          >
            <Button
              type="dashed"
              size="small"
              icon={<PlusCircle size={14} />}
              onClick={onNavigateToDebts}
              style={{ borderRadius: radius.sm, marginTop: 8 }}
            >
              {t('debts.createDebt')}
            </Button>
          </Empty>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {debtsSummary.map((debt) => {
            const isLend =
              debt.type?.toLowerCase().includes('lend') ||
              debt.type?.toLowerCase().includes('in')
            const total = Number(debt.totalAmount || 0)
            const paid = Number(debt.paidAmount || 0)
            const remaining =
              debt.remainingAmount !== undefined
                ? Number(debt.remainingAmount)
                : Math.max(0, total - paid)
            const paidPct =
              total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0

            return (
              <div
                key={debt.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: radius.md,
                  border: `1px solid ${border.base}`,
                  background: state.hover,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {debt.namePerson || debt.name}
                      </span>
                      <Tag
                        color={isLend ? 'success' : 'error'}
                        style={{
                          borderRadius: radius.sm,
                          margin: 0,
                          fontSize: 11,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        {isLend ? (
                          <>
                            <ArrowUpRight size={10} />
                            {t('debts.lend')}
                          </>
                        ) : (
                          <>
                            <ArrowDownLeft size={10} />
                            {t('debts.borrow')}
                          </>
                        )}
                      </Tag>
                    </div>

                    {debt.dueDate && (
                      <Space
                        size={4}
                        style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}
                      >
                        <Calendar size={12} />
                        <span>
                          {t('debts.dueDate')}:{' '}
                          {dayjs(debt.dueDate).format('DD/MM/YYYY')}
                        </span>
                      </Space>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: isLend ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {convertCurrency(remaining)}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {t('debts.remaining')}
                    </div>
                  </div>
                </div>

                <Progress
                  percent={paidPct}
                  showInfo={false}
                  strokeColor={isLend ? '#16a34a' : '#f59e0b'}
                  size="small"
                  style={{ marginBottom: 6 }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                    color: '#64748b',
                  }}
                >
                  <span>
                    {t('debts.paid')}:{' '}
                    <strong style={{ color: '#16a34a' }}>
                      {convertCurrency(paid)} ({paidPct}%)
                    </strong>
                  </span>
                  <span>
                    Tổng: <strong>{convertCurrency(total)}</strong>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
