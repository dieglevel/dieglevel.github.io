import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Flex } from 'antd'
import MainLayout from '@/shared/components/layout/layout'

export const Route = createFileRoute('/(public)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Flex flex={1} vertical style={{ overflowY: 'auto' }}>
        <Outlet />
      </Flex>
    </MainLayout>
  )
}
