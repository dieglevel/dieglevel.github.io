import { createFileRoute } from '@tanstack/react-router'
import TaskPage from '@/shared/pages/task'

export const Route = createFileRoute('/(public)/hanbiroTask')({
  component: TaskPage,
})
