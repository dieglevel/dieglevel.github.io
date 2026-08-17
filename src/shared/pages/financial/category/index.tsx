import { useMemo, useState } from 'react'
import { Button, DatePicker, Flex, Spin, Tree, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import dayjs from 'dayjs'
import CategoryModal from './_components/CategoryModal'
import CategoryTreeNode from './_components/CategoryTreeNode'
import type { IFinance_Category } from '@/shared/api/financial/category/category.type'
import { useMutationFinanceCategory } from '@/shared/api/financial/category/category.mutation'
import { useGetFinance_Category_Count } from '@/shared/api/financial/category/useGetFinance_Category_Count'

const { Title, Text } = Typography

export interface ExtendedFinanceCategory extends IFinance_Category {
  children?: Array<ExtendedFinanceCategory>
}

export default function Categories() {
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs())

  const { data: apiResponse, isPending } = useGetFinance_Category_Count({
    queryParams: {
      date: dayjs(selectedMonth).format('YYYY-MM'),
    },
  })
  const rawCategories: Array<ExtendedFinanceCategory> = apiResponse?.data || []

  const {
    mCategory_Update,
    mCategory_Create,
    mCategory_Delete,
    mCategory_Archive,
  } = useMutationFinanceCategory()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [editing, setEditing] = useState<IFinance_Category | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  // 0. Lọc bỏ các node con nằm ở Root Level (tránh trùng lặp do API trả về cả root lẫn children)
  const categories = useMemo(() => {
    return rawCategories
  }, [rawCategories])

  // 1. Tính toán số lượng Active / Archived
  const { activeCount, archivedCount } = useMemo(() => {
    let active = 0
    let archived = 0

    const countNodes = (nodes: Array<ExtendedFinanceCategory>) => {
      nodes.forEach((node) => {
        if (node.archived) archived++
        else active++

        if (node.children && node.children.length > 0) {
          countNodes(node.children)
        }
      })
    }

    countNodes(categories)
    return { activeCount: active, archivedCount: archived }
  }, [categories])

  // 2. Tính tổng budget và total spent
  const { totalBudget, totalSpent } = useMemo(() => {
    let budget = 0
    let spent = 0

    const calculateTotal = (nodes: Array<ExtendedFinanceCategory>) => {
      nodes.forEach((node) => {
        if (!node.archived) {
          budget += node.monthlyBudget ?? 0
          spent += node.totalAmount ?? 0
        }
        if (node.children && node.children.length > 0) {
          calculateTotal(node.children)
        }
      })
    }

    calculateTotal(categories)
    return { totalBudget: budget, totalSpent: spent }
  }, [categories])

  // 3. Lọc danh sách dữ liệu
  const filteredTreeData: Array<ExtendedFinanceCategory> = useMemo(() => {
    const filterNodes = (
      nodes: Array<ExtendedFinanceCategory>,
    ): Array<ExtendedFinanceCategory> => {
      return nodes.map((node) => ({
        ...node,
        children: node.children ? filterNodes(node.children) : [],
      }))
    }

    return filterNodes(categories)
  }, [categories])

  function openAdd(parentId?: number | null) {
    setMode('add')
    setEditing(null)
    setSelectedParentId(parentId || null)
    setOpen(true)
  }

  function openEdit(category: IFinance_Category) {
    setMode('edit')
    setEditing(category)
    setSelectedParentId(null)
    setOpen(true)
  }

  function findCategoryById(
    nodes: Array<ExtendedFinanceCategory>,
    id: number,
  ): ExtendedFinanceCategory | null {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children && node.children.length > 0) {
        const found = findCategoryById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  function archive(id: number) {
    const target = findCategoryById(categories, id)
    if (target) {
      mCategory_Archive.mutate({
        pathParams: {
          categoryId: target.id,
        },
      })
    }
  }

  function remove(id: number) {
    mCategory_Delete.mutate({
      pathParams: {
        id,
      },
    })
  }

  const save = async (formData: Omit<IFinance_Category, 'id'>) => {
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
      gap={20}
      style={{
        padding: '20px',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Categories
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {activeCount} Active · {archivedCount} Archived
          </Text>
        </div>

        <Flex gap={12} wrap="wrap" justify="center" align="center">
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {`Total Budget: `}
            <Text style={{ fontWeight: 'bold', color: 'red' }}>
              {totalBudget.toLocaleString()}
            </Text>
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openAdd(null)}
          >
            Add Category
          </Button>
          <DatePicker
            style={{ width: '180px' }}
            picker="month"
            value={selectedMonth}
            onChange={(date) => {
              setSelectedMonth(date ?? dayjs())
            }}
          />
        </Flex>
      </Flex>

      {/* Tree Structure */}
      {isPending ? (
        <Spin />
      ) : (
        <Flex
          vertical
          gap={8}
          style={{
            width: '100%',
            background: '#fff',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
          }}
        >
          <Tree
            treeData={filteredTreeData}
            fieldNames={{
              title: 'name',
              children: 'children',
              key: 'id',
            }}
            blockNode
            selectable={false}
            defaultExpandAll
            titleRender={(nodeData) => (
              <CategoryTreeNode
                node={nodeData}
                onAddChild={openAdd}
                onEdit={openEdit}
                onArchive={archive}
                onDelete={remove}
              />
            )}
          />
        </Flex>
      )}

      <CategoryModal
        open={open}
        mode={mode}
        category={editing}
        defaultParentId={selectedParentId}
        categories={categories}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          setSelectedParentId(null)
        }}
        onSubmit={save}
      />
    </Flex>
  )
}
