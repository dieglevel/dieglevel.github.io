import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/financial/')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/financial') {
      throw redirect({
        to: '/financial/transaction',
      })
    }
  },
})
