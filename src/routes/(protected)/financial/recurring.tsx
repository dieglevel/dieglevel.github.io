import { createFileRoute } from '@tanstack/react-router'
import { RecurringTransactions } from '@/shared/pages/financial/recurring'

export const Route = createFileRoute('/(protected)/financial/recurring')({
  component: RecurringTransactions,
})
