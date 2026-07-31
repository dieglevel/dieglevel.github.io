import { createFileRoute } from '@tanstack/react-router'
import { Goals } from '@/shared/pages/financial/goal'

export const Route = createFileRoute('/(protected)/financial/goal')({
  component: Goals,
})
