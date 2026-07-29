import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/shared/pages/financial/settings'

export const Route = createFileRoute('/(protected)/financial/setting')({
  component: Settings,
})
