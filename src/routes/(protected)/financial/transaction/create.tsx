import { createFileRoute } from '@tanstack/react-router'
import { CreateTransactionPage } from '@/shared/pages/financial/transaction/create'

export const Route = createFileRoute(
  '/(protected)/financial/transaction/create',
)({
  component: CreateTransactionPage,
})
