import React from 'react'
import { Button, Flex, Space, Typography } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'

const { Title } = Typography

interface TransactionUpsertHeaderProps {
  isMobile: boolean
  isUpdateMode: boolean
  transactionId?: number
  selectedType: FINANCIAL_TRANSACTION_TYPE
  isSubmitting: boolean
  onBack: () => void
  onSave: () => void
}

export const TransactionUpsertHeader: React.FC<
  TransactionUpsertHeaderProps
> = ({
  isMobile,
  isUpdateMode,
  transactionId,
  selectedType,
  isSubmitting,
  onBack,
  onSave,
}) => {
  const getTitleText = () => {
    if (isUpdateMode) return `Chỉnh Sửa Giao Dịch #${transactionId}`
    switch (selectedType) {
      case FINANCIAL_TRANSACTION_TYPE.INCOME:
        return 'Tạo Giao Dịch Thu Nhập'
      case FINANCIAL_TRANSACTION_TYPE.REFUND:
        return 'Tạo Giao Dịch Hoàn Tiền'
      case FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT:
        return 'Tạo Điều Chỉnh Số Dư'
      case FINANCIAL_TRANSACTION_TYPE.TRANSFER:
        return 'Tạo Giao Dịch Chuyển Tiền'
      default:
        return 'Tạo Giao Dịch Chi Tiêu'
    }
  }

  return (
    <Flex
      vertical={isMobile}
      justify={isMobile ? 'flex-start' : 'space-between'}
      align={isMobile ? 'stretch' : 'center'}
      gap={isMobile ? 12 : 0}
      style={{ marginBottom: 20 }}
    >
      <Space align="center" size={12}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} type="text" />
        <Title
          level={isMobile ? 4 : 3}
          style={{
            margin: 0,
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            wordBreak: 'break-word',
          }}
        >
          {getTitleText()}
        </Title>
      </Space>

      <Flex justify={isMobile ? 'flex-end' : 'flex-start'} gap={8}>
        <Button onClick={onBack}>Hủy</Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={isSubmitting}
        >
          {isUpdateMode ? 'Cập Nhật Giao Dịch' : 'Lưu Giao Dịch'}
        </Button>
      </Flex>
    </Flex>
  )
}
