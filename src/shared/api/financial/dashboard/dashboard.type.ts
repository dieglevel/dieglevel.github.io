export enum DashboardTimeFrame {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export interface GetFinancialDashboardQueryParams {
  fromDate?: string
  toDate?: string
  walletId?: number
  timeFrame?: DashboardTimeFrame
}

export interface CashFlowTimelinePoint {
  date: string
  income: number
  expense: number
  net: number
}

export interface CategoryBreakdownItem {
  categoryId: number | null
  categoryName: string
  categoryIcon?: string
  categoryColor?: string
  amount: number
  percentage: number
}

export interface WalletOverviewItem {
  id: number
  name: string
  balance: number
  currency?: string
  type?: string
  icon?: string
  color?: string
}

export interface GoalSummaryItem {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  percentage: number
}

export interface DebtSummaryItem {
  id: number
  name: string
  totalAmount: number
  paidAmount: number
  type: string
}

export interface DashboardRecentTransactionItem {
  id: number
  description?: string | null
  merchant?: string | null
  amount: number
  type: string
  status: string
  createdAt: string
  walletName?: string
  categoryName?: string
}

export interface IFinancialDashboardSummary {
  summary: {
    totalIncome: number
    totalExpense: number
    netBalance: number
    savingsRate: number
    totalWalletBalance: number
    pendingCount: number
  }
  cashFlowTimeline: Array<CashFlowTimelinePoint>
  categoryBreakdown: Array<CategoryBreakdownItem>
  wallets: Array<WalletOverviewItem>
  recentTransactions: Array<DashboardRecentTransactionItem>
  goalsSummary: Array<GoalSummaryItem>
  debtsSummary: Array<DebtSummaryItem>
}
