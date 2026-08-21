import React from 'react'

import { Route } from '@/routes/(protected)/financial/transaction/$updateId'
import { TransactionUpsertPage } from '@/shared/pages/financial/transaction/_components/TransactionUpsertPage'

export const UpdateTransactionPage: React.FC = () => {
  const { updateId } = Route.useParams()
  const transactionId = Number(updateId)

  return <TransactionUpsertPage mode="update" transactionId={transactionId} />
}
