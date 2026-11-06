import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Modal, Spin, Typography } from 'antd'
import { Search } from 'lucide-react'
import dayjs from 'dayjs'

import {
  compareActiveDebts,
  compareClosedDebts,
  getDueState,
  isReceivable,
  paidInfo,
} from '../debt.utils'
import { DebtActionMenu } from './DebtActionMenu'
import type { DebtActionHandlers } from './DebtActionMenu'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import {
  FINANCIAL_DEBT_STATUS_ENUM,
  FinancialDebtStatusHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Title, Text } = Typography

/** Số khoản hiện sẵn ở danh sách gọn trước khi bấm "Xem thêm" */
const COMPACT_LIMIT = 5

const STATUS_TABS = [
  FINANCIAL_DEBT_STATUS_ENUM.ACTIVE,
  FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF,
  FINANCIAL_DEBT_STATUS_ENUM.SETTLED,
  FINANCIAL_DEBT_STATUS_ENUM.CANCELLED,
]

interface DebtListProps extends DebtActionHandlers {
  debts: Array<IFinance_Debt>
  isLoading: boolean
  onOpenHistory: (debt: IFinance_Debt) => void
}

export const DebtList: React.FC<DebtListProps> = ({
  debts,
  isLoading,
  onOpenHistory,
  ...handlers
}) => {
  const { t } = useTranslation('finance')
  const [modal, contextHolder] = Modal.useModal()

  const [status, setStatus] = useState(FINANCIAL_DEBT_STATUS_ENUM.ACTIVE)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)

  const searched = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return debts
    return debts.filter(
      (d) =>
        d.name.toLowerCase().includes(keyword) ||
        d.namePerson.toLowerCase().includes(keyword),
    )
  }, [debts, search])

  const byStatus = (s: FINANCIAL_DEBT_STATUS_ENUM) =>
    searched.filter((d) => d.status === s)

  const changeTab = (s: FINANCIAL_DEBT_STATUS_ENUM) => {
    setStatus(s)
    setExpanded(false)
  }

  // ---------- Hàng đầy đủ (khoản đang nợ) ----------
  const renderDue = (debt: IFinance_Debt) => {
    const due = getDueState(debt)
    switch (due.kind) {
      case 'overdue':
        return (
          <span className="dp-chip danger">
            {t('debt.overdue', { days: due.days })}
          </span>
        )
      case 'today':
        return <span className="dp-chip warn">{t('debt.dueToday')}</span>
      case 'soon':
        return (
          <span className="dp-chip warn">
            {t('debt.dueIn', { days: due.days })}
          </span>
        )
      case 'later':
        return <span>{t('debt.dueOn', { date: due.date })}</span>
      default:
        return <span>{t('debt.noDue')}</span>
    }
  }

  const renderRow = (debt: IFinance_Debt) => {
    const receivable = isReceivable(debt)
    const { paid, percent, outstanding } = paidInfo(debt)
    const overdue = getDueState(debt).kind === 'overdue'
    const color = receivable ? 'var(--d-income)' : 'var(--d-danger)'

    return (
      <li key={debt.id} className={`dp-row${overdue ? ' overdue' : ''}`}>
        <span
          className="dp-av"
          style={{ '--c': color } as React.CSSProperties}
          aria-hidden
        >
          {debt.namePerson.trim().charAt(0).toUpperCase() || '?'}
        </span>

        <div className="dp-main">
          <button
            type="button"
            className="dp-title"
            title={debt.name}
            aria-label={t('debt.openHistory', { name: debt.name })}
            onClick={() => onOpenHistory(debt)}
          >
            {debt.name}
          </button>
          <div className="dp-meta">
            <span>{debt.namePerson}</span>
            <span aria-hidden>·</span>
            {renderDue(debt)}
          </div>
        </div>

        <div className="dp-progress">
          <div className="dp-progress-label dp-num">
            <span>
              {receivable
                ? t('debt.progressCollected', {
                    amount: convertCurrency(paid),
                  })
                : t('debt.progressRepaid', { amount: convertCurrency(paid) })}
            </span>
            <span>{percent}%</span>
          </div>
          <div
            className="dp-bar sm"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={debt.name}
          >
            <span
              style={
                {
                  width: `${Math.min(100, percent)}%`,
                  '--c': color,
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        <div className={`dp-amt ${receivable ? 'receivable' : 'payable'}`}>
          <Text type="secondary">
            {receivable ? t('debt.receivable') : t('debt.payable')}
          </Text>
          <Text
            strong
            type={receivable ? 'success' : 'danger'}
            className="dp-num"
          >
            {convertCurrency(outstanding)}
          </Text>
        </div>

        <div className="dp-actions">
          <Button type="primary" onClick={() => handlers.onOpenPayment(debt)}>
            {receivable ? t('debt.collect') : t('debt.pay')}
          </Button>
          <DebtActionMenu debt={debt} modal={modal} {...handlers} />
        </div>
      </li>
    )
  }

  // ---------- Hàng gọn (khoản đã đóng) ----------
  const renderCompact = (list: Array<IFinance_Debt>) => {
    const shown = expanded ? list : list.slice(0, COMPACT_LIMIT)
    const hidden = list.length - shown.length
    return (
      <div className="dp-compact">
        <ul className="dp-list" style={{ gap: 0 }}>
          {shown.map((debt) => (
            <li key={debt.id} className="dp-compact-row">
              <div style={{ minWidth: 0 }}>
                <button
                  type="button"
                  className="dp-title"
                  title={debt.name}
                  aria-label={t('debt.openHistory', { name: debt.name })}
                  onClick={() => onOpenHistory(debt)}
                >
                  {debt.name}
                </button>
                <span className="sub">{debt.namePerson}</span>
              </div>
              <span className="money dp-num">
                {convertCurrency(Number(debt.originalAmount || 0))}
              </span>
              <span className="date dp-num">
                {dayjs(debt.updatedAt).format('DD/MM/YYYY')}
              </span>
              <DebtActionMenu debt={debt} modal={modal} {...handlers} />
            </li>
          ))}
        </ul>
        {(hidden > 0 || (expanded && list.length > COMPACT_LIMIT)) && (
          <div className="dp-more">
            <Button type="text" onClick={() => setExpanded((v) => !v)}>
              {hidden > 0
                ? t('debt.showMore', { count: hidden })
                : t('debt.showLess')}
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderSection = (
    title: string,
    list: Array<IFinance_Debt>,
    content: React.ReactNode,
  ) =>
    list.length > 0 && (
      <section className="dp-section" aria-label={title}>
        <Title level={5} className="dp-section-title">
          {title} <Text type="secondary">({list.length})</Text>
        </Title>
        {content}
      </section>
    )

  const empty = (
    <div className="dp-empty">
      <Text strong>{t('debt.empty')}</Text>
      {search.trim() && <Text type="secondary">{t('debt.emptySearch')}</Text>}
    </div>
  )

  const renderContent = () => {
    if (status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE) {
      const active = byStatus(FINANCIAL_DEBT_STATUS_ENUM.ACTIVE).sort(
        compareActiveDebts,
      )
      const toCollect = active.filter(isReceivable)
      const toPay = active.filter((d) => !isReceivable(d))
      const recentClosed = searched
        .filter(
          (d) =>
            d.status === FINANCIAL_DEBT_STATUS_ENUM.SETTLED ||
            d.status === FINANCIAL_DEBT_STATUS_ENUM.PAID_OFF,
        )
        .sort(compareClosedDebts)

      return (
        <>
          {active.length === 0 ? (
            empty
          ) : (
            <>
              {renderSection(
                t('debt.sectionCollect'),
                toCollect,
                <ul className="dp-list">{toCollect.map(renderRow)}</ul>,
              )}
              {renderSection(
                t('debt.sectionPay'),
                toPay,
                <ul className="dp-list">{toPay.map(renderRow)}</ul>,
              )}
            </>
          )}
          {renderSection(
            t('debt.sectionRecent'),
            recentClosed,
            renderCompact(recentClosed),
          )}
        </>
      )
    }

    const list = byStatus(status).sort(compareClosedDebts)
    return list.length === 0 ? empty : renderCompact(list)
  }

  return (
    <>
      {contextHolder}

      <div className="dp-toolbar">
        <div
          className="dp-tabs"
          role="tablist"
          aria-label={t('debt.tablistLabel')}
        >
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={status === s}
              onClick={() => changeTab(s)}
            >
              {FinancialDebtStatusHelper.getLabel(s)}
              <span className="count">{byStatus(s).length}</span>
            </button>
          ))}
        </div>

        <Input
          className="dp-search"
          type="search"
          allowClear
          prefix={<Search size={16} aria-hidden />}
          placeholder={t('debt.searchPlaceholder')}
          aria-label={t('debt.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Spin spinning={isLoading}>
        <div role="tabpanel">{renderContent()}</div>
      </Spin>
    </>
  )
}
