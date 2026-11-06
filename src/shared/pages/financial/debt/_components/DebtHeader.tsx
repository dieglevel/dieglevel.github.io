import React from 'react'
import { Button, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

const { Title, Text } = Typography

interface DebtHeaderProps {
  totalCount: number
  activeCount: number
  overdueCount: number
  onOpenCreate: () => void
}

export const DebtHeader: React.FC<DebtHeaderProps> = ({
  totalCount,
  activeCount,
  overdueCount,
  onOpenCreate,
}) => {
  const { t } = useTranslation('finance')

  return (
    <header className="dp-header">
      <div>
        <Title level={3} style={{ margin: 0 }}>
          {t('debt.title')}
        </Title>
        <Text type="secondary">
          {t('debt.statsLine', { total: totalCount, active: activeCount })}
          {' · '}
          <Text type={overdueCount > 0 ? 'danger' : 'secondary'}>
            {t('debt.overdueCount', { count: overdueCount })}
          </Text>
        </Text>
      </div>

      <Button type="primary" icon={<Plus size={18} />} onClick={onOpenCreate}>
        {t('debt.create')}
      </Button>
    </header>
  )
}
