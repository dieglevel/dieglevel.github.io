import { createFileRoute } from '@tanstack/react-router'
import { Transactions } from '@/shared/pages/financial/transaction'

export const Route = createFileRoute('/(protected)/financial/transaction/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Transactions />
}
