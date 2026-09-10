import { createFileRoute } from '@tanstack/react-router'
import NetworkCheckPage from '@/shared/pages/network'

export const Route = createFileRoute('/(public)/network')({
  component: NetworkCheckPage,
})
