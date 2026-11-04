import React from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

interface TransactionHeaderProps {
  isMobile: boolean
  filteredCount: number
  totalCount: number
  selectedCount: number
  onDeleteSelected: () => void
  onOpenAddModal: () => void
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  isMobile,
  filteredCount,
  totalCount,
  selectedCount,
  onDeleteSelected,
  onOpenAddModal,
}) => {
  const { t } = useTranslation('finance')

  return (
    <header className="tx-header">
      <div>
        <h1>{t('transaction.title')}</h1>
        <p>
          {t('transaction.shownCount', {
            shown: filteredCount,
            total: totalCount,
          })}
        </p>
      </div>
      <div className="tx-header-actions">
        {selectedCount > 0 && (
          <button
            type="button"
            className="tx-btn danger"
            onClick={onDeleteSelected}
          >
            <DeleteOutlined /> {t('common.delete')} ({selectedCount})
          </button>
        )}
        {!isMobile && (
          <button type="button" className="tx-btn" onClick={onOpenAddModal}>
            <PlusOutlined /> {t('transaction.create')}
          </button>
        )}
      </div>
    </header>
  )
}
