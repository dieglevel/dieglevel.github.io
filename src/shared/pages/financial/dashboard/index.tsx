import React, { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Col, Flex, Row, Spin } from 'antd'

import { DashboardHeader } from './_components/DashboardHeader'
import { DashboardSummaryCards } from './_components/DashboardSummaryCards'
import { CashFlowChart } from './_components/CashFlowChart'
import { CategoryBreakdownChart } from './_components/CategoryBreakdownChart'
import { WalletListWidget } from './_components/WalletListWidget'
import { RecentTransactionsWidget } from './_components/RecentTransactionsWidget'
import { GoalsSummaryWidget } from './_components/GoalsSummaryWidget'
import { DebtsSummaryWidget } from './_components/DebtsSummaryWidget'
import type { GetFinancialDashboardQueryParams } from '@/shared/api/financial/dashboard/dashboard.type'
import { DashboardTimeFrame } from '@/shared/api/financial/dashboard/dashboard.type'
import { useGetFinancialDashboard } from '@/shared/api/financial/dashboard/useGetFinancialDashboard'

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

  const { data: response, isFetching } = useGetFinancialDashboard({
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
  const goalsSummary = dashboardData?.goalsSummary || []
  const debtsSummary = dashboardData?.debtsSummary || []

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh',
      }}
    >
      {/* Header & Filter Toolbar */}
      <DashboardHeader
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        selectedWalletId={selectedWalletId}
        setSelectedWalletId={setSelectedWalletId}
        wallets={wallets}
        period={dashboardData?.period}
        onNavigateToCreateTransaction={() =>
          router.navigate({ to: '/financial/transaction' })
        }
      />

      {isFetching ? (
        <Flex align="center" justify="center" style={{ height: '60vh' }}>
          <Spin size="large" />
        </Flex>
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

          {/* Wallets & Recent Transactions Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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

          {/* Goals & Debts Summary Row */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <GoalsSummaryWidget
                goalsSummary={goalsSummary}
                onNavigateToGoals={() =>
                  router.navigate({ to: '/financial/goal' })
                }
              />
            </Col>
            <Col xs={24} lg={12}>
              <DebtsSummaryWidget
                debtsSummary={debtsSummary}
                onNavigateToDebts={() =>
                  router.navigate({ to: '/financial/debt' })
                }
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}
