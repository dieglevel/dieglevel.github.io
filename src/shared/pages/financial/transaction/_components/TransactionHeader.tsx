import React from 'react'
import { Button, Flex, Space, Typography } from 'antd'
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
  return (
    <Flex
      vertical={isMobile}
      justify="space-between"
      align={isMobile ? 'stretch' : 'center'}
      gap={12}
    >
      <div>
        <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          Transactions
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Showing {filteredCount} of {totalCount} records
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
            Delete ({selectedCount})
          </Button>
        )}
        {!isMobile && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenAddModal}
          >
            Add Transaction
          </Button>
        )}
      </Space>
    </Flex>
  )
}
