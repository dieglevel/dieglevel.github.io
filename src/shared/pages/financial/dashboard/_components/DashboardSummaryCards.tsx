import React from 'react'
import { Card, Col, Progress, Row, Typography } from 'antd'
import {
  ArrowDownRight,
  ArrowUpRight,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const { Text } = Typography

const formatVND = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val || 0)
}

interface DashboardSummaryCardsProps {
  summary: {
    totalIncome: number
    totalExpense: number
    netBalance: number
    savingsRate: number
    totalWalletBalance: number
    pendingCount: number
  }
}

export const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  summary,
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {/* Total Income Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Tổng Thu Nhập
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#16a34a',
                }}
              >
                {formatVND(summary.totalIncome)}
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
              }}
            >
              <ArrowUpRight size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <TrendingUp size={14} />
            <span>Dòng tiền thu vào trong kỳ</span>
          </div>
        </Card>
      </Col>

      {/* Total Expense Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Tổng Chi Tiêu
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#dc2626',
                }}
              >
                {formatVND(summary.totalExpense)}
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
              }}
            >
              <ArrowDownRight size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <TrendingDown size={14} />
            <span>Dòng tiền chi ra trong kỳ</span>
          </div>
        </Card>
      </Col>

      {/* Net Savings Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Số Dư Ròng
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: summary.netBalance >= 0 ? '#0284c7' : '#dc2626',
                }}
              >
                {formatVND(summary.netBalance)}
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
              }}
            >
              <Wallet size={22} />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Tổng số dư các ví:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              {formatVND(summary.totalWalletBalance)}
            </span>
          </div>
        </Card>
      </Col>

      {/* Savings Rate Card */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Tỷ Lệ Tích Lũy
              </Text>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#4f46e5',
                }}
              >
                {summary.savingsRate}%
              </h2>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
              }}
            >
              <Target size={22} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Progress
              percent={summary.savingsRate}
              showInfo={false}
              strokeColor="#4f46e5"
              trailColor="#f1f5f9"
            />
          </div>
        </Card>
      </Col>
    </Row>
  )
}
