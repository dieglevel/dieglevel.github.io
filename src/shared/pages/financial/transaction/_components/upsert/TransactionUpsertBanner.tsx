import React from 'react'
import { Card, Flex, Typography } from 'antd'
import { FINANCIAL_TRANSACTION_TYPE } from '@/shared/api/financial/transaction/transaction.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text, Title } = Typography

interface TransactionUpsertBannerProps {
  selectedType: FINANCIAL_TRANSACTION_TYPE
  displayAmount: number
  bannerStyle: { bg: string; border: string; color: string }
}

export const TransactionUpsertBanner: React.FC<
  TransactionUpsertBannerProps
> = ({ selectedType, displayAmount, bannerStyle }) => {
  const getBannerLabel = () => {
    switch (selectedType) {
      case FINANCIAL_TRANSACTION_TYPE.INCOME:
        return 'Tổng khoản thu nhập:'
      case FINANCIAL_TRANSACTION_TYPE.REFUND:
        return 'Tổng tiền hoàn nhận lại:'
      case FINANCIAL_TRANSACTION_TYPE.ADJUSTMENT:
        return 'Số tiền điều chỉnh:'
      case FINANCIAL_TRANSACTION_TYPE.TRANSFER:
        return 'Tổng số tiền trừ ví nguồn (Gồm phí):'
      default:
        return 'Tổng tiền chi tiêu:'
    }
  }

  return (
    <Card
      size="small"
      style={{
        backgroundColor: bannerStyle.bg,
        borderColor: bannerStyle.border,
        marginBottom: 20,
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
        <Text type="secondary">{getBannerLabel()}</Text>
        <Title level={3} style={{ margin: 0, color: bannerStyle.color }}>
          {convertCurrency(displayAmount)}
        </Title>
      </Flex>
    </Card>
  )
}
