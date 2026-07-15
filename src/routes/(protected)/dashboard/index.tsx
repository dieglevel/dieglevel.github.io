import { createFileRoute } from '@tanstack/react-router'
import BaseModal from '@/shared/components/modal'

export const Route = createFileRoute('/(protected)/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <BaseModal open={false} onOk={() => {}} title="Modal Title">
        ab
      </BaseModal>
    </div>
  )
}
