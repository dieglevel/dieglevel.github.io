import React from 'react'
import { Button, Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { HandCoins, PlusCircle } from 'lucide-react'
import { WidgetCard } from './WidgetCard'
import type { DebtSummaryItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { FINANCIAL_DEBT_DIRECTION_ENUM } from '@/shared/api/financial/debt/debt.enum'
import { getDueState } from '@/shared/pages/financial/debt/debt.utils'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface DebtsSummaryWidgetProps {
  /** BE đã lọc ACTIVE, tối đa 4, sắp theo quá hạn → sắp đến hạn → mới nhất */
  debtsSummary: Array<DebtSummaryItem>
  onNavigateToDebts: () => void
}

export const DebtsSummaryWidget: React.FC<DebtsSummaryWidgetProps> = ({
  debtsSummary,
  onNavigateToDebts,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { border } = getTokens(mode)

  const renderDue = (debt: DebtSummaryItem) => {
    const due = getDueState(debt)
    if (due.kind === 'overdue') {
      return (
        <Text type="danger" strong>
          {t('debts.overdue', { days: due.days })}
        </Text>
      )
    }
    if (due.kind === 'today' || due.kind === 'soon') {
      return (
        <Text type="warning" strong>
          {due.kind === 'today'
            ? t('debts.dueToday')
            : t('debts.dueSoon', { days: due.days })}
        </Text>
      )
    }
    return null
  }

  return (
    <WidgetCard
      icon={<HandCoins size={18} />}
      title={t('debts.title')}
      action={{ label: t('debts.manage'), onClick: onNavigateToDebts }}
    >
      {debtsSummary.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 0',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Text type="secondary">{t('debts.empty')}</Text>}
          >
            <Button
              type="dashed"
              icon={<PlusCircle size={14} />}
              onClick={onNavigateToDebts}
            >
              {t('debts.createDebt')}
            </Button>
          </Empty>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {debtsSummary.map((debt, i) => {
            const receivable =
              debt.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING
            const remaining = Number(
              debt.remainingAmount ??
                Math.max(0, debt.totalAmount - debt.paidAmount),
            )

            return (
              <li
                key={debt.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${border.light}`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <Text strong ellipsis style={{ display: 'block' }}>
                    {debt.name}
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0 8px',
                      alignItems: 'center',
                    }}
                  >
                    <Text type="secondary">{debt.namePerson}</Text>
                    {renderDue(debt)}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Text
                    strong
                    type={receivable ? 'success' : 'danger'}
                    style={{
                      display: 'block',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {convertCurrency(remaining)}
                  </Text>
                  <Text type="secondary">
                    {receivable ? t('debts.receivable') : t('debts.payable')}
                  </Text>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </WidgetCard>
  )
}
