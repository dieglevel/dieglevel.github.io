import { createFileRoute } from '@tanstack/react-router'
import { FeedbackPage } from '@/shared/pages/feedback'

export const Route = createFileRoute('/(public)/feedback')({
  component: FeedbackPage,
})
