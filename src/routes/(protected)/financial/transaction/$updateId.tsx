import { createFileRoute } from '@tanstack/react-router'
import { UpdateTransactionPage } from '@/shared/pages/financial/transaction/update'

export const Route = createFileRoute(
  '/(protected)/financial/transaction/$updateId',
)({
  component: UpdateTransactionPage,
})
