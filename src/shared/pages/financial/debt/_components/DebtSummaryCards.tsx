import React from 'react'
import { Card, Col, Flex, Progress, Row, Typography } from 'antd'
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Scale } from 'lucide-react'
import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FinancialDebtDirectionHelper,
} from '@/shared/api/financial/debt/debt.enum'
import { convertCurrency } from '@/shared/utils/helper/format-money'

const { Text, Title } = Typography

interface DebtSummaryCardsProps {
  debts: Array<IFinance_Debt>
}

export const DebtSummaryCards: React.FC<DebtSummaryCardsProps> = ({
  debts,
}) => {
  // Cho vay (Phải thu - INCOMING)
  const incomingDebts = debts.filter(
    (d) => d.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING,
  )
  const totalLentOriginal = incomingDebts.reduce(
    (sum, d) => sum + Number(d.originalAmount || 0),
    0,
  )
  const totalLentOutstanding = incomingDebts.reduce(
    (sum, d) => sum + Number(d.outstandingAmount || 0),
    0,
  )
  const lentPaid = totalLentOriginal - totalLentOutstanding

  // Đi vay (Phải trả - OUTGOING)
  const outgoingDebts = debts.filter(
    (d) => d.direction === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING,
  )
  const totalBorrowedOriginal = outgoingDebts.reduce(
    (sum, d) => sum + Number(d.originalAmount || 0),
    0,
  )
  const totalBorrowedOutstanding = outgoingDebts.reduce(
    (sum, d) => sum + Number(d.outstandingAmount || 0),
    0,
  )
  const borrowedPaid = totalBorrowedOriginal - totalBorrowedOutstanding

  // Nợ ròng = Phải thu - Phải trả
  const netOutstanding = totalLentOutstanding - totalBorrowedOutstanding

  // Tỉ lệ thu/trả nợ tổng quan
  const totalOriginal = totalLentOriginal + totalBorrowedOriginal
  const totalPaid = lentPaid + borrowedPaid
  const overallProgress =
    totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {/* 1. Cho vay / Phải thu */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 12,
            border: '1px solid #dcfce7',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                {FinancialDebtDirectionHelper.getLabel(
                  FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING,
                ).toUpperCase()}
              </Text>
              <Title
                level={4}
                style={{ margin: '4px 0 0 0', color: '#15803d' }}
              >
                {convertCurrency(totalLentOutstanding)}
              </Title>
            </div>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
              }}
            >
              <ArrowUpRight size={18} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Đã thu:{' '}
            <strong style={{ color: '#16a34a' }}>
              {convertCurrency(lentPaid)}
            </strong>{' '}
            / Gốc: {convertCurrency(totalLentOriginal)}
          </Text>
        </Card>
      </Col>

      {/* 2. Đi vay / Phải trả */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 12,
            border: '1px solid #ffe4e6',
            background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
            boxShadow: '0 2px 8px rgba(225, 29, 72, 0.08)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                {FinancialDebtDirectionHelper.getLabel(
                  FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING,
                ).toUpperCase()}
              </Text>
              <Title
                level={4}
                style={{ margin: '4px 0 0 0', color: '#be123c' }}
              >
                {convertCurrency(totalBorrowedOutstanding)}
              </Title>
            </div>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#ffe4e6',
                color: '#e11d48',
                display: 'flex',
              }}
            >
              <ArrowDownLeft size={18} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Đã trả:{' '}
            <strong style={{ color: '#e11d48' }}>
              {convertCurrency(borrowedPaid)}
            </strong>{' '}
            / Gốc: {convertCurrency(totalBorrowedOriginal)}
          </Text>
        </Card>
      </Col>

      {/* 3. Dư nợ ròng */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 8 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                DƯ NỢ RÒNG (CÂN BẰNG)
              </Text>
              <Title
                level={4}
                style={{
                  margin: '4px 0 0 0',
                  color: netOutstanding >= 0 ? '#16a34a' : '#dc2626',
                }}
              >
                {netOutstanding >= 0 ? '+' : ''}
                {convertCurrency(netOutstanding)}
              </Title>
            </div>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#f1f5f9',
                color: '#475569',
                display: 'flex',
              }}
            >
              <Scale size={18} />
            </div>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {netOutstanding >= 0
              ? 'Tiền phải thu lớn hơn nợ phải trả'
              : 'Nợ phải trả lớn hơn tiền phải thu'}
          </Text>
        </Card>
      </Col>

      {/* 4. Tiến độ hoàn tất nợ */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          size="small"
          style={{
            borderRadius: 12,
            border: '1px solid #e0f2fe',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
          }}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            style={{ marginBottom: 4 }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                TIẾN ĐỘ GIẢI QUYẾT NỢ
              </Text>
              <Title
                level={4}
                style={{ margin: '4px 0 0 0', color: '#0284c7' }}
              >
                {overallProgress}%
              </Title>
            </div>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
              }}
            >
              <CheckCircle size={18} />
            </div>
          </Flex>
          <Progress
            percent={overallProgress}
            showInfo={false}
            strokeColor="#0284c7"
            size="small"
          />
        </Card>
      </Col>
    </Row>
  )
}
