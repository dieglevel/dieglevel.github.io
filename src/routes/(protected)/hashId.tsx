import { createFileRoute } from '@tanstack/react-router'
import { Card, Flex, Input, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import HashIds from 'hashids'

export const Route = createFileRoute('/(protected)/hashId')({
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
    try {
      return hashId ? hashIds.decode(hashId).join(', ') : ''
    } catch {
      return ''
    }
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
    <Flex
      flex={1}
      style={{
        padding: 24,
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Card
        style={{ borderWidth: 2 }}
        styles={{
          header: {
            borderWidth: 2,
          },
        }}
        title="HashIds Config"
      >
        <Input.TextArea
          rows={3}
          placeholder="Nhập salt"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
        />
      </Card>

      <Flex flex={1} gap={16}>
        <Card style={{ width: '100%' }} title="Decode — HashIds → Numbers">
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

        <Card style={{ width: '100%' }} title="Encode — Numbers → HashId">
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
      </Flex>
    </Flex>
  )
}
