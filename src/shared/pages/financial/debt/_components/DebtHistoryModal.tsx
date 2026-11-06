import React from 'react'
import { useTranslation } from 'react-i18next'
import { Empty, Modal, Spin } from 'antd'
import { DEBT_UI_CLASS } from './DebtThemeProvider'
import { useGetFinance_Debt_Histories } from '@/shared/api/financial/debt/useGetDebtHistories'
import { FinancialDebtHistoryTypeHelper } from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'

interface Props {
  debtId: number
  debtName?: string
  open: boolean
  onClose: () => void
}

/** Lịch sử biến động (GET /:id/histories) dạng timeline dọc, mới nhất trước */
const DebtHistoryTimeline: React.FC<{ debtId: number }> = ({ debtId }) => {
  const { t } = useTranslation('finance')
  const { data, isLoading } = useGetFinance_Debt_Histories({ id: debtId })
  const items = data?.data || []

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Spin />
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('debtForms.historyEmpty')}
      />
    )
  }

  return (
    <ol className="dh-timeline">
      {items.map((h) => {
        const amount = Number(h.amount || 0)
        return (
          <li key={h.id} className="dh-item">
            <span
              className="dh-dot"
              aria-hidden
              style={
                {
                  '--c': FinancialDebtHistoryTypeHelper.getColor(h.type),
                } as React.CSSProperties
              }
            />
            <div className="dh-head">
              <span className="dh-type">
                {FinancialDebtHistoryTypeHelper.getLabel(h.type)}
              </span>
              <time className="dh-date dp-num" dateTime={h.occurredAt}>
                {DayjsHelper.formatDate(h.occurredAt, 'DD/MM/YYYY')}
              </time>
            </div>
            <dl className="dh-body dp-num">
              {amount > 0 && (
                <>
                  <dt>{t('debtForms.amount')}</dt>
                  <dd>{convertCurrency(amount)}</dd>
                </>
              )}
              <dt>{t('debtForms.beforeAfter')}</dt>
              <dd>
                {convertCurrency(h.previousOutstandingAmount)} →{' '}
                <strong>{convertCurrency(h.outstandingAmount)}</strong>
              </dd>
              <dt>{t('debtForms.wallet')}</dt>
              <dd>{h.wallet?.name || t('debtForms.bookOnly')}</dd>
              {h.note && (
                <>
                  <dt>{t('debtForms.notes')}</dt>
                  <dd>{h.note}</dd>
                </>
              )}
            </dl>
          </li>
        )
      })}
    </ol>
  )
}

export const DebtHistoryModal: React.FC<Props> = ({
  debtId,
  debtName,
  open,
  onClose,
}) => {
  const { t } = useTranslation('finance')
  return (
    <Modal
      rootClassName={DEBT_UI_CLASS}
      title={t('debtForms.historyTitle', { name: debtName || `#${debtId}` })}
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
    >
      {open && <DebtHistoryTimeline debtId={debtId} />}
    </Modal>
  )
}
