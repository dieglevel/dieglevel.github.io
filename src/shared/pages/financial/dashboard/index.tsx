import React, { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Col, Row, Skeleton } from 'antd'

import { useGetFinancialDashboard } from '@/shared/api/financial/dashboard/useGetFinancialDashboard'
import { DashboardTimeFrame } from '@/shared/api/financial/dashboard/dashboard.type'
import type { GetFinancialDashboardQueryParams } from '@/shared/api/financial/dashboard/dashboard.type'

import { DashboardHeader } from './_components/DashboardHeader'
import { DashboardSummaryCards } from './_components/DashboardSummaryCards'
import { CashFlowChart } from './_components/CashFlowChart'
import { CategoryBreakdownChart } from './_components/CategoryBreakdownChart'
import { WalletListWidget } from './_components/WalletListWidget'
import { RecentTransactionsWidget } from './_components/RecentTransactionsWidget'

export function Dashboard() {
  const router = useRouter()

  // Local state for filters
  const [timeFrame, setTimeFrame] = useState<DashboardTimeFrame>(
    DashboardTimeFrame.MONTHLY,
  )
  const [selectedWalletId, setSelectedWalletId] = useState<number | undefined>(
    undefined,
  )

  // Query params setup
  const queryParams: GetFinancialDashboardQueryParams = {
    timeFrame,
    walletId: selectedWalletId,
  }

  const { data: response, isLoading } = useGetFinancialDashboard({
    queryParams,
  })

  const dashboardData = response?.data

  const summary = dashboardData?.summary || {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    savingsRate: 0,
    totalWalletBalance: 0,
    pendingCount: 0,
  }

  const cashFlowTimeline = dashboardData?.cashFlowTimeline || []
  const categoryBreakdown = dashboardData?.categoryBreakdown || []
  const wallets = dashboardData?.wallets || []
  const recentTransactions = dashboardData?.recentTransactions || []

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
      }}
    >
      {/* Header & Filter Toolbar */}
      <DashboardHeader
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        selectedWalletId={selectedWalletId}
        setSelectedWalletId={setSelectedWalletId}
        wallets={wallets}
        onNavigateToCreateTransaction={() =>
          router.navigate({ to: '/financial/transaction' })
        }
      />

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <>
          {/* Top 4 KPI Metrics Cards */}
          <DashboardSummaryCards summary={summary} />

          {/* Charts Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={15}>
              <CashFlowChart cashFlowTimeline={cashFlowTimeline} />
            </Col>
            <Col xs={24} lg={9}>
              <CategoryBreakdownChart categoryBreakdown={categoryBreakdown} />
            </Col>
          </Row>

          {/* Third Row: Wallets & Recent Transactions */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={9}>
              <WalletListWidget
                wallets={wallets}
                onNavigateToWallet={() =>
                  router.navigate({ to: '/financial/wallet' })
                }
              />
            </Col>
            <Col xs={24} lg={15}>
              <RecentTransactionsWidget
                recentTransactions={recentTransactions}
                onNavigateToTransactions={() =>
                  router.navigate({ to: '/financial/transaction' })
                }
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}
