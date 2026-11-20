import { createFileRoute } from '@tanstack/react-router'
import BillToExcelPage from '@/shared/pages/bill-to-excel'

export const Route = createFileRoute('/(public)/bill-to-excel')({
  component: BillToExcelPage,
})
