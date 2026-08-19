import { createFileRoute } from '@tanstack/react-router'
import { DebtManagementPage } from '@/shared/pages/financial/debt'

export const Route = createFileRoute('/(protected)/financial/debt')({
  component: DebtManagementPage,
})
