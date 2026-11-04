import React from 'react'
import { useTranslation } from 'react-i18next'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface TransactionTotalsProps {
  totalExpense?: number
  totalIncome?: number
  /** Số giao dịch chi tiêu chưa gán danh mục trên trang hiện tại */
  uncategorizedCount: number
}

export const TransactionTotals: React.FC<TransactionTotalsProps> = ({
  totalExpense,
  totalIncome,
  uncategorizedCount,
}) => {
  const { t } = useTranslation('finance')

  return (
    <section className="tx-summary">
      <div>
        <small>{t('transaction.expense')}</small>
        <b>{convertCurrency(totalExpense ?? 0)}</b>
      </div>
      <div>
        <small>{t('transaction.income')}</small>
        <b className="income">{convertCurrency(totalIncome ?? 0)}</b>
      </div>
      <div>
        <small>{t('transaction.uncategorized')}</small>
        <b>{t('transaction.txCount', { count: uncategorizedCount })}</b>
      </div>
    </section>
  )
}
