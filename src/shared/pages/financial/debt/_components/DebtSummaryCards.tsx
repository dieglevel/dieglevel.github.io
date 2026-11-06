import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'
import type { summarizeDebts } from '../debt.utils'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Title, Text } = Typography

interface DebtSummaryCardsProps {
  summary: ReturnType<typeof summarizeDebts>
}

export const DebtSummaryCards: React.FC<DebtSummaryCardsProps> = ({
  summary,
}) => {
  const { t } = useTranslation('finance')
  const { net, receivable, payable, paid, original, percent } = summary

  return (
    <section className="dp-summary" aria-label={t('debt.summaryLabel')}>
      <div className="dp-card net">
        <Text type="secondary">{t('debt.netTitle')}</Text>
        <Title
          level={3}
          className={`dp-card-value dp-num ${net >= 0 ? 'pos' : 'neg'}`}
        >
          {net > 0 ? '+' : net < 0 ? '−' : ''}
          {convertCurrency(Math.abs(net))}
        </Title>
        <Text type="secondary">{t('debt.netCaption')}</Text>
        <div
          className="dp-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={t('debt.netProgressLabel')}
        >
          <span style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
        <Text type="secondary" className="dp-card-foot dp-num">
          {t('debt.paidLine', {
            paid: convertCurrency(paid),
            original: convertCurrency(original),
            percent,
          })}
        </Text>
      </div>

      <div className="dp-card">
        <Text type="secondary">{t('debt.lendTitle')}</Text>
        <Title level={4} className="dp-card-value dp-num pos">
          {convertCurrency(receivable)}
        </Title>
        <Text type="secondary">
          {t('debt.lendCount', { count: summary.receivableCount })}
        </Text>
      </div>

      <div className="dp-card">
        <Text type="secondary">{t('debt.borrowTitle')}</Text>
        <Title level={4} className="dp-card-value dp-num neg">
          {convertCurrency(payable)}
        </Title>
        <Text type="secondary">
          {t('debt.borrowCount', { count: summary.payableCount })}
        </Text>
      </div>
    </section>
  )
}
