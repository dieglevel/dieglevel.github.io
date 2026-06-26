import { createFileRoute } from '@tanstack/react-router'
import TaskPage from '@/shared/pages/task'

export const Route = createFileRoute('/(protected)/hanbiroTask')({
  component: TaskPage,
})
