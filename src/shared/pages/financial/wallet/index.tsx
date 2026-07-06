import { useMemo, useState } from 'react'
import { Button, Col, Flex, Row, Typography } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import CategoryCard from './CategoryCard'
import CategoryModal from './CategoryModal'
import SummaryCards from './SummaryCards'
import { EMPTY_CATEGORY } from './constants'
import type { Category } from './constants'

const { Title, Text } = Typography

export default function Categories() {
  const [categories, setCategories] = useState<Array<Category>>([
    {
      ...EMPTY_CATEGORY,
      id: 'c1',
      name: 'Food',
      color: '#FF4D4F',
      icon: '🍔',
      monthlyBudget: 500,
      totalSpent: 300,
    },
  ])
  const [showArchived, setShowArchived] = useState(false)

  const [open, setOpen] = useState(false)

  const [mode, setMode] = useState<'add' | 'edit'>('add')

  const [editing, setEditing] = useState<Category | null>(null)

  const active = useMemo(
    () => categories.filter((x) => !x.archived),
    [categories],
  )

  const archived = useMemo(
    () => categories.filter((x) => x.archived),
    [categories],
  )

  const shown = showArchived ? categories : active

  const totalBudget = active.reduce((s, c) => s + c.monthlyBudget, 0)

  const totalSpent = active.reduce((s, c) => s + c.totalSpent, 0)

  function openAdd() {
    setMode('add')
    setEditing(null)
    setOpen(true)
  }

  function openEdit(category: Category) {
    setMode('edit')
    setEditing(category)
    setOpen(true)
  }

  function archive(id: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              archived: !c.archived,
            }
          : c,
      ),
    )
  }

  function save(data: Omit<Category, 'id'>) {
    if (mode === 'add') {
      setCategories((prev) => [
        ...prev,
        {
          ...EMPTY_CATEGORY,
          ...data,
          id: `c${Date.now()}`,
        },
      ])
    } else if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                ...data,
              }
            : c,
        ),
      )
    }

    setOpen(false)
    setEditing(null)
  }

  return (
    <Flex vertical gap={24} style={{ padding: 24, width: '100%' }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={2}>Categories</Title>

          <Text type="secondary">
            {active.length} Active · {archived.length} Archived
          </Text>
        </div>

        <Flex gap={12}>
          <Button
            icon={showArchived ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setShowArchived((x) => !x)}
          >
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Add Category
          </Button>
        </Flex>
      </Flex>

      <SummaryCards totalBudget={totalBudget} totalSpent={totalSpent} />

      <Row gutter={[16, 16]}>
        {shown.map((category) => (
          <Col key={category.id} xs={24} sm={12} xl={8}>
            <CategoryCard
              category={category}
              onEdit={openEdit}
              onArchive={archive}
            />
          </Col>
        ))}

        <Col xs={24} sm={12} xl={8}>
          <Button
            type="dashed"
            onClick={openAdd}
            icon={<PlusOutlined />}
            style={{
              width: '100%',
              height: 250,
            }}
          >
            Add Category
          </Button>
        </Col>
      </Row>

      <CategoryModal
        open={open}
        mode={mode}
        category={editing}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onSubmit={save}
      />
    </Flex>
  )
}
