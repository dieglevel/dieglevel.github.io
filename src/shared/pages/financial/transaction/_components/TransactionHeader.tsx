import React from 'react'
import { Button, Flex, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

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
    <Flex
      vertical={isMobile}
      justify="space-between"
      align={isMobile ? 'stretch' : 'center'}
      gap={12}
    >
      <div>
        <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          {t('transaction.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {filteredCount} / {totalCount}
        </Text>
      </div>
      <Space
        style={{ width: isMobile ? '100%' : 'auto' }}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {selectedCount > 0 && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onDeleteSelected}
            style={{ flex: 1 }}
          >
            {t('common.delete')} ({selectedCount})
          </Button>
        )}
        {!isMobile && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenAddModal}
          >
            {t('transaction.create')}
          </Button>
        )}
      </Space>
    </Flex>
  )
}
