import { createFileRoute } from '@tanstack/react-router'
import { Wallets } from '@/shared/pages/financial/wallet'

export const Route = createFileRoute('/(protected)/financial/wallet')({
  component: Wallets,
})
