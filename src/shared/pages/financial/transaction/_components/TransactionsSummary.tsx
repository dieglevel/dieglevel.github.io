import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import type { IWallet_Transaction } from '@/shared/api/financial/transaction/transaction.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface TransactionsSummaryProps {
  transactions: Array<IWallet_Transaction>
}

export const TransactionsSummary: React.FC<TransactionsSummaryProps> = ({
  transactions,
}) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const net = income - expense

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card size="small">
          <Statistic
            title="Total Income"
            value={convertCurrency(income)}
            precision={2}
            valueStyle={{
              color: '#10b981',
            }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card size="small">
          <Statistic
            title="Total Expenses"
            value={convertCurrency(expense)}
            precision={2}
            valueStyle={{
              color: '#f43f5e',
            }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card size="small">
          <Statistic
            title="Net Balance"
            value={convertCurrency(net)}
            precision={2}
            valueStyle={{
              color: '#5b5fef',
            }}
          />
        </Card>
      </Col>
    </Row>
  )
}
