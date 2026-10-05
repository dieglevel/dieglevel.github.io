import React from 'react'
import { Button, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

const { Title, Text } = Typography

interface DebtHeaderProps {
  isMobile: boolean
  totalCount: number
  activeCount: number
  onOpenCreate: () => void
}

export const DebtHeader: React.FC<DebtHeaderProps> = ({
  isMobile,
  totalCount,
  activeCount,
  onOpenCreate,
}) => {
  const { t } = useTranslation('finance')

  return (
    <Flex
      vertical={isMobile}
      justify="space-between"
      align={isMobile ? 'stretch' : 'center'}
      gap={isMobile ? 12 : 0}
      style={{ marginBottom: 20 }}
    >
      <div>
        <Flex align="center" gap={10}>
          <div>
            <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
              {t('debt.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {t('debt.subtitle', { total: totalCount, active: activeCount })}
            </Text>
          </div>
        </Flex>
      </div>

      <Button
        type="primary"
        size="large"
        icon={<Plus size={18} />}
        onClick={onOpenCreate}
        style={{
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)',
        }}
      >
        {t('debt.create')}
      </Button>
    </Flex>
  )
}
