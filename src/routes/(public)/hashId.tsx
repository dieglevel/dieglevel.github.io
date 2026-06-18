import { createFileRoute } from '@tanstack/react-router'
import { Card, Input, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import HashIds from 'hashids'

export const Route = createFileRoute('/(public)/hashId')({
  component: RouteComponent,
})

const DEFAULT_SALT =
  'GH%)uOp_pZNAWbkoB88)-Fs43pgnL_193gC;AH:lozQgLk=TiNPmZcw9Vt}LgLNu'

function RouteComponent() {
  const [salt, setSalt] = useState(DEFAULT_SALT)
  const [hashId, setHashId] = useState('')
  const [numbers, setNumbers] = useState('')

  useEffect(() => {
    const savedSalt = localStorage.getItem('hashIds_salt')

    if (savedSalt) {
      setSalt(savedSalt)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('hashIds_salt', salt)
  }, [salt])

  const hashIds = useMemo(() => {
    return new HashIds(salt, 8)
  }, [salt])

  const decoded = useMemo(() => {
    return hashId ? hashIds.decode(hashId).join(', ') : ''
  }, [hashId, hashIds])

  const encoded = useMemo(() => {
    if (!numbers) return ''

    return hashIds.encode(
      numbers
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !isNaN(n)),
    )
  }, [numbers, hashIds])

  return (
    <div
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Card title="HashIds Config">
        <Input.TextArea
          rows={3}
          placeholder="Nhập salt"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
        />
      </Card>

      <Card title="Decode — HashIds → Numbers">
        <Input
          placeholder="Nhập hashId, vd: Mj3X90Lk"
          value={hashId}
          onChange={(e) => setHashId(e.target.value)}
        />

        {decoded && (
          <Typography.Text code style={{ marginTop: 8, display: 'block' }}>
            {decoded}
          </Typography.Text>
        )}
      </Card>

      <Card title="Encode — Numbers → HashId">
        <Input
          placeholder="Nhập số, vd: 1, 2, 3"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
        />

        {encoded && (
          <Typography.Text code style={{ marginTop: 8, display: 'block' }}>
            {encoded}
          </Typography.Text>
        )}
      </Card>
    </div>
  )
}
