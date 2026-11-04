import React, { useMemo } from 'react'
import {
  Button,
  Checkbox,
  Empty,
  Pagination,
  Popconfirm,
  Spin,
  Tooltip,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { TablePaginationConfig } from 'antd'
import type { IFinance_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { DayjsHelper } from '@/shared/utils/helper/dayjs'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
  FinancialTransactionStatusHelper,
  FinancialTransactionTypeHelper,
} from '@/shared/api/financial/transaction/transaction.enum'

interface TransactionListProps {
  isFetching: boolean
  dataSource: Array<IFinance_Transaction>
  isMobile: boolean
  selectedKeys: Array<React.Key>
  onSelectChange: (selectedKeys: Array<React.Key>) => void
  onViewDetail: (transaction: IFinance_Transaction) => void
  pagination?: TablePaginationConfig
  onPageChange: (newPage: number) => void
  onDelete: (transactionId: number) => void
  onEdit: (transaction: IFinance_Transaction) => void
}

const TYPE_ICON: Record<FINANCIAL_TRANSACTION_TYPE, string> = {
  [FINANCIAL_TRANSACTION_TYPE.EXPENSE]: 'receipt',
  [FINANCIAL_TRANSACTION_TYPE.INCOME]: 'banknote',
  [FINANCIAL_TRANSACTION_TYPE.REFUND]: 'undo-2',
  [FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT]: 'scale',
  [FINANCIAL_TRANSACTION_TYPE.TRANSFER]: 'arrow-left-right',
}

const MUTED = '#a38b7a'

const isInflow = (type: FINANCIAL_TRANSACTION_TYPE) =>
  type === FINANCIAL_TRANSACTION_TYPE.INCOME ||
  type === FINANCIAL_TRANSACTION_TYPE.REFUND

const uniqueCategories = (tx: IFinance_Transaction) =>
  Array.from(
    new Map(
      (tx.financialTransactionItems ?? [])
        .filter((item) => item.category)
        .map((item) => [item.category!.id, item.category!]),
    ).values(),
  )

/** Chi tiêu chưa gán danh mục cho hạng mục nào. */
export const isUncategorized = (tx: IFinance_Transaction) =>
  tx.type === FINANCIAL_TRANSACTION_TYPE.EXPENSE &&
  uniqueCategories(tx).length === 0

/** Thu – chi trong ngày, chỉ để hiển thị ở tiêu đề nhóm. */
const signedFlow = (tx: IFinance_Transaction) => {
  if (tx.type === FINANCIAL_TRANSACTION_TYPE.EXPENSE) return -tx.amount
  if (isInflow(tx.type)) return tx.amount
  return 0
}

export const TransactionList: React.FC<TransactionListProps> = ({
  isFetching,
  dataSource,
  isMobile,
  selectedKeys,
  onSelectChange,
  onViewDetail,
  pagination,
  onPageChange,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation('finance')

  // Nhóm theo ngày giao dịch, ngày mới nhất lên đầu
  const groups = useMemo(() => {
    const map = new Map<string, Array<IFinance_Transaction>>()
    dataSource.forEach((tx) => {
      const list = map.get(tx.transactionDate) ?? []
      list.push(tx)
      map.set(tx.transactionDate, list)
    })
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  }, [dataSource])

  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const dayTitle = (date: string) => {
    if (date === today) return t('transaction.today')
    if (date === yesterday) return t('transaction.yesterday')
    return dayjs(date).format('dddd')
  }

  const toggleSelect = (id: number, checked: boolean) =>
    onSelectChange(
      checked
        ? [...selectedKeys, id]
        : selectedKeys.filter((key) => key !== id),
    )

  const renderCategory = (tx: IFinance_Transaction) => {
    const typeLabel = (
      <span>{FinancialTransactionTypeHelper.getLabel(tx.type)}</span>
    )
    if (tx.type !== FINANCIAL_TRANSACTION_TYPE.EXPENSE && !isInflow(tx.type)) {
      return typeLabel
    }

    const categories = uniqueCategories(tx)
    if (categories.length === 0) {
      return isUncategorized(tx) ? (
        <span className="tx-chip none">{t('transaction.uncategorized')}</span>
      ) : (
        typeLabel
      )
    }
    if (categories.length > 1) {
      return (
        <span>
          {t('transaction.multiItems')} ({categories.length})
        </span>
      )
    }
    const cat = categories[0]
    return (
      <span
        className="tx-chip"
        style={{ '--c': cat.color || MUTED } as React.CSSProperties}
      >
        {cat.name}
      </span>
    )
  }

  const renderAmount = (tx: IFinance_Transaction) => {
    const money = convertCurrency(Math.abs(tx.amount))
    if (tx.type === FINANCIAL_TRANSACTION_TYPE.EXPENSE) {
      return <span className="tx-amt">−{money}</span>
    }
    if (isInflow(tx.type)) {
      return <span className="tx-amt income">+{money}</span>
    }
    if (tx.type === FINANCIAL_TRANSACTION_TYPE.TRANSFER) {
      return <span className="tx-amt muted">⇄ {money}</span>
    }
    return <span className="tx-amt muted">{convertCurrency(tx.amount)}</span>
  }

  const renderRow = (tx: IFinance_Transaction) => {
    const categories = uniqueCategories(tx)
    const firstCat = categories.length === 1 ? categories[0] : undefined
    const accent =
      firstCat?.color || FinancialTransactionTypeHelper.getColor(tx.type)
    const selected = selectedKeys.includes(tx.id)
    const openEdit = () => onEdit(tx)

    return (
      <div
        key={tx.id}
        className={`tx-row${selected ? ' selected' : ''}`}
        role="button"
        tabIndex={0}
        onClick={openEdit}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && e.key === 'Enter') openEdit()
        }}
      >
        <Checkbox
          checked={selected}
          aria-label={tx.description || String(tx.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => toggleSelect(tx.id, e.target.checked)}
        />

        <span
          className="tx-av"
          style={{ '--c': accent } as React.CSSProperties}
        >
          <IconRenderer
            iconName={firstCat?.icon || TYPE_ICON[tx.type]}
            size={18}
            color={accent}
          />
        </span>

        <div className="tx-main">
          <div className="tx-title" title={tx.description || undefined}>
            {tx.description || '-'}
          </div>
          <div className="tx-meta">
            <span className="tx-wallet">
              <i style={{ background: tx.wallet?.color || MUTED }} />
              {tx.wallet?.name || '-'}
            </span>
            {renderCategory(tx)}
            {tx.status !== FINANCIAL_TRANSACTION_STATUS.COMPLETED && (
              <span
                className="tx-chip"
                style={
                  {
                    '--c': FinancialTransactionStatusHelper.getColor(tx.status),
                  } as React.CSSProperties
                }
              >
                {FinancialTransactionStatusHelper.getLabel(tx.status)}
              </span>
            )}
          </div>
        </div>

        {renderAmount(tx)}

        <div className="tx-actions" onClick={(e) => e.stopPropagation()}>
          <Tooltip title={t('transaction.detail')}>
            <Button
              type="text"
              size="small"
              aria-label={t('transaction.detail')}
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(tx)}
            />
          </Tooltip>
          <Popconfirm
            title={t('common.delete')}
            description={t('category.deleteDescription')}
            onConfirm={() => onDelete(tx.id)}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
          >
            <Button
              type="text"
              danger
              size="small"
              aria-label={t('common.delete')}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      </div>
    )
  }

  return (
    <Spin spinning={isFetching}>
      {groups.length === 0 ? (
        <div className="tx-card tx-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        groups.map(([date, list]) => {
          const net = list.reduce((sum, tx) => sum + signedFlow(tx), 0)
          return (
            <section key={date}>
              <div className="tx-day">
                <div>
                  <b>{dayTitle(date)}</b>
                  <span>{DayjsHelper.formatDate(date, 'DD/MM/YYYY')}</span>
                </div>
                {net !== 0 && (
                  <em>
                    {net > 0 ? '+' : '−'}
                    {convertCurrency(Math.abs(net))}
                  </em>
                )}
              </div>
              <div className="tx-card">{list.map(renderRow)}</div>
            </section>
          )
        })
      )}

      <div className="tx-pagination">
        <Pagination
          current={pagination?.current}
          pageSize={pagination?.pageSize}
          total={pagination?.total}
          onChange={onPageChange}
          showSizeChanger={false}
          simple={isMobile}
          hideOnSinglePage
        />
      </div>
    </Spin>
  )
}
