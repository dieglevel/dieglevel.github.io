import { useMemo, useState } from 'react'
import { Button, Flex, Typography } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import CategoryCard from './_components/animation-card/CategoryCard'
import CategoryModal from './_components/CategoryModal'
import SummaryCards from './_components/SummaryCards'
import { AnimatedGrid } from './_components/animation-card'
import type { IWallet_Category } from '@/shared/api/wallet/category/category.type'
import { useMutationCategory } from '@/shared/api/wallet/category/category.mutation'
import { useGetWallet_Category_List } from '@/shared/api/wallet/category/useGetWallet_Category_List'

const { Title, Text } = Typography

export default function Categories() {
  // 1. Lấy dữ liệu từ API (mặc định fallback về mảng rỗng nếu chưa có data)
  const { data: apiResponse, isPending } = useGetWallet_Category_List({})
  const categories: Array<IWallet_Category> = apiResponse?.data || []

  // 2. Lấy các hàm mutation để thay đổi dữ liệu phía Server
  const { mCategory_Update, mCategory_Create, mCategory_Delete } =
    useMutationCategory()

  const [showArchived, setShowArchived] = useState(false)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [editing, setEditing] = useState<IWallet_Category | null>(null)

  // Tính toán danh mục Active và Archived từ biến `categories` hợp lệ
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

  // 3. Gọi API Update để Toggle trạng thái Archive thay vì set state ảo
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

  // 4. Gửi dữ liệu lên Server qua Mutation API thay vì cập nhật State local không tồn tại
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

      <AnimatedGrid
        items={shown}
        isPending={isPending}
        getKey={(category) => category.id} // Truyền cách lấy ID
        renderItem={(category) => (
          <CategoryCard
            category={category}
            onEdit={openEdit}
            onArchive={archive}
            onDelete={remove}
          />
        )}
      />

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
