import { Outlet, createFileRoute } from '@tanstack/react-router'

import WalletLayout from '@/shared/pages/financial/_layout'

export const Route = createFileRoute('/(protected)/financial')({
  component: RouteComponent,
})

export function RouteComponent() {
  return (
    <WalletLayout>
      <Outlet />
    </WalletLayout>
  )
}
