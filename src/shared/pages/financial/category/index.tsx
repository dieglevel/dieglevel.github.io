import { useMemo, useState } from 'react'
import { Button, DatePicker, Flex, Typography } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import dayjs from 'dayjs'
import SummaryCards from '../_components/SummaryCards'
import CategoryCard from './_components/animation-card/CategoryCard'
import CategoryModal from './_components/CategoryModal'
import { AnimatedGrid } from './_components/animation-card'
import type { IWallet_Category } from '@/shared/api/financial/category/category.type'
import { useMutationCategory } from '@/shared/api/financial/category/category.mutation'
import { useGetWallet_Category_List } from '@/shared/api/financial/category/useGetWallet_Category_List'

const { Title, Text } = Typography

export default function Categories() {
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs())

  const { data: apiResponse, isFetching } = useGetWallet_Category_List({
    queryParams: {
      date: dayjs(selectedMonth).format('YYYY-MM-DD'),
    },
  })
  const categories: Array<IWallet_Category> = apiResponse?.data || []

  const { mCategory_Update, mCategory_Create, mCategory_Delete } =
    useMutationCategory()

  const [showArchived, setShowArchived] = useState(false)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [editing, setEditing] = useState<IWallet_Category | null>(null)

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
  const totalSpent = active.reduce((s, c) => s + (c.totalAmount ?? 0), 0)

  function openAdd() {
    setMode('add')
    setEditing(null)
    setOpen(true)
  }

  function openEdit(category: IWallet_Category) {
    setMode('edit')
    setEditing(category)
    setOpen(true)
  }

  function archive(id: string) {
    const target = categories.find((c) => c.id === id)
    if (target) {
      mCategory_Update.mutate({
        body: {
          archived: !target.archived,
        },
        pathParams: {
          id: target.id,
        },
      })
    }
  }

  function remove(id: string) {
    mCategory_Delete.mutate({
      pathParams: {
        id,
      },
    })
  }

  const save = async (formData: Omit<IWallet_Category, 'id'>) => {
    if (mode === 'add') {
      await mCategory_Create.mutateAsync(
        { body: formData },
        {
          onSuccess: () => {
            setOpen(false)
          },
        },
      )
    } else if (editing) {
      await mCategory_Update.mutateAsync(
        {
          body: {
            ...formData,
          },
          pathParams: {
            id: editing.id,
          },
        },
        {
          onSuccess: () => {
            setOpen(false)
            setEditing(null)
          },
        },
      )
    }
  }

  return (
    <Flex
      vertical
      gap={24}
      style={{
        padding: '16px',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Categories
          </Title>
          <Text type="secondary">
            {active.length} Active · {archived.length} Archived
          </Text>
        </div>

        <Flex
          gap={12}
          wrap="wrap"
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
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

      {/* Date Filter Bar */}
      <Flex justify="end" align="center" wrap="wrap" gap={12}>
        <DatePicker
          style={{ width: '100%', maxWidth: '200px' }}
          picker="month"
          value={selectedMonth}
          onChange={(date) => {
            setSelectedMonth(date ?? dayjs())
          }}
        />
      </Flex>

      {/* Summary Cards */}
      <SummaryCards totalBudget={totalBudget} totalSpent={totalSpent} />

      {/* Animated Grid Wrapper */}
      <div style={{ width: '100%', overflowX: 'hidden' }}>
        <AnimatedGrid
          items={shown}
          isPending={isFetching}
          getKey={(category) => category.id}
          renderItem={(category) => (
            <CategoryCard
              category={category}
              onEdit={openEdit}
              onArchive={archive}
              onDelete={remove}
            />
          )}
        />
      </div>

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
