import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  Popconfirm,
  Typography,
} from 'antd'
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import type { IWallet_Category } from '@/shared/api/wallet/category/category.type'
import type { ColumnsType } from 'antd/es/table'
import type { AggregationColor } from 'antd/es/color-picker/color'
import { useGetWallet_Category_List } from '@/shared/api/wallet/category/useGetWallet_Category_List'
import Table from '@/shared/components/table'
import { useAuthStore } from '@/shared/auth/auth.store'
import { LoginComponent } from '@/routes/(public)/login'
import { useMutationCategory } from '@/shared/api/wallet/category/category.mutation'

export const Route = createFileRoute('/(protected)/dashboard')({
  component: () => {
    const auth = useAuthStore.getState().isAuthenticated
    if (!auth) {
      return <LoginComponent />
    }
    return <RouteComponent />
  },
})

interface IFormValues extends Omit<IWallet_Category, 'color'> {
  color: AggregationColor | string
}

function RouteComponent() {
  const { data, isLoading, refetch } = useGetWallet_Category_List({})
  const [form] = Form.useForm<IFormValues>()

  // State quản lý dòng nào đang được chỉnh sửa (Sửa)
  const [editingId, setEditingId] = useState<number | string | null>(null)

  // Import đầy đủ bộ mutation từ file cấu hình của bạn
  const { mCategory_Create, mCategory_Update, mCategory_Delete } =
    useMutationCategory()

  const isEditing = (record: IWallet_Category) => record.id === editingId

  // Bắt đầu chế độ sửa dòng: Điền dữ liệu cũ của dòng đó vào Form fields
  const startEdit = (record: IWallet_Category) => {
    form.setFieldsValue({
      name: record.name,
      icon: record.icon,
      color: record.color as AggregationColor | string,
    })
    setEditingId(record.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    form.resetFields(['name', 'icon', 'color']) // Chỉ reset các ô trên dòng đang sửa
  }

  // Kết hợp data cũ và dòng Add New ảo ở cuối bảng
  const dataTemp = useMemo<Array<IWallet_Category>>(() => {
    return [
      ...(data || []),
      {
        id: -1,
        name: '',
        icon: '',
        color: '',
        created_at: new Date().toISOString(),
        user_id: useAuthStore.getState().user?.id || '',
      },
    ]
  }, [data])

  // Xử lý chung khi submit Form (cho cả hành động Tạo mới và Cập nhật)
  const onFinish = (values: IFormValues) => {
    // Parser màu sắc từ ColorPicker/String về dạng string hex chuẩn
    const hexColor = values.color
      ? typeof values.color === 'string'
        ? values.color
        : values.color.toHexString()
      : '#1677ff'

    if (editingId === -1) {
      // 1. Logic TẠO MỚI (Dòng cuối cùng id = -1)
      mCategory_Create.mutate(
        {
          body: {
            name: values.name,
            icon: values.icon,
            color: hexColor,
            user_id: useAuthStore.getState().user?.id || '',
          },
        },
        {
          onSuccess() {
            form.resetFields()
            refetch()
            setEditingId(null) // Reset trạng thái edit sau khi tạo mới
          },
        },
      )
    } else if (editingId) {
      // 2. Logic CẬP NHẬT (Dòng đang edit)
      mCategory_Update.mutate(
        {
          body: {
            name: values.name,
            icon: values.icon,
            color: hexColor,
          },
          queryParams: {
            id: `eq.${editingId}`, // Filter theo chuẩn Supabase API
          },
        },
        {
          onSuccess() {
            setEditingId(null)
            form.resetFields()
            refetch()
          },
        },
      )
    }
  }

  // 3. Logic XÓA (DELETE)
  const handleDelete = (id: number | string) => {
    mCategory_Delete.mutate(
      {
        queryParams: {
          id: `eq.${id}`,
        },
      },
      {
        onSuccess() {
          refetch()
        },
      },
    )
  }

  // Cấu hình các cột hiển thị
  const columns = useMemo<ColumnsType<IWallet_Category>>(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        render(value, record) {
          // Nếu là dòng thêm mới HOẶC dòng đang được bật chế độ sửa
          if (record.id === -1 || isEditing(record)) {
            return (
              <Form.Item
                name="name"
                style={{ margin: 0 }}
                rules={[{ required: true, message: 'Required!' }]}
              >
                <Input placeholder="Enter category name..." />
              </Form.Item>
            )
          }
          return <span>{value}</span>
        },
      },
      {
        title: 'Icon',
        dataIndex: 'icon',
        key: 'icon',
        width: '25%',
        render(value, record) {
          if (record.id === -1 || isEditing(record)) {
            return (
              <Form.Item name="icon" style={{ margin: 0 }}>
                <Input placeholder="Icon code..." />
              </Form.Item>
            )
          }
          return <span>{value || '-'}</span>
        },
      },
      {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
        width: '25%',
        render(value, record) {
          if (record.id === -1 || isEditing(record)) {
            return (
              <Form.Item
                name="color"
                style={{ margin: 0 }}
                initialValue={value || '#1677ff'}
              >
                <ColorPicker format="hex" trigger="click" value={value} />
              </Form.Item>
            )
          }
          return (
            <Flex gap={8} align="center">
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: value || '#ccc',
                  border: '1px solid #d9d9d9',
                }}
              />
              <span>{value}</span>
            </Flex>
          )
        },
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '20%',
        render(_, record) {
          // Hàng Thêm Mới: Hiện duy nhất nút Add
          if (record.id === -1) {
            return (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingId(-1) // Xác định hành động submit là tạo mới
                  form.submit()
                }}
                loading={mCategory_Create.isPending}
              >
                Add
              </Button>
            )
          }

          // Hàng Đang Được Sửa: Hiện 2 nút Lưu (Save) và Hủy (Cancel)
          if (isEditing(record)) {
            return (
              <Flex gap={12}>
                <Typography.Link
                  onClick={() => form.submit()}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <SaveOutlined /> Save
                </Typography.Link>
                <Typography.Link
                  onClick={cancelEdit}
                  type="danger"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <CloseOutlined /> Cancel
                </Typography.Link>
              </Flex>
            )
          }

          // Hàng Trạng Thái Tĩnh: Hiện 2 nút Sửa (Edit) và Xóa (Delete)
          return (
            <Flex gap={16}>
              <Typography.Link
                disabled={editingId !== null}
                onClick={() => startEdit(record)}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <EditOutlined /> Edit
              </Typography.Link>

              <Popconfirm
                title="Delete the category"
                description="Are you sure to delete this category?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
                disabled={editingId !== null}
              >
                <Typography.Link
                  type="danger"
                  disabled={editingId !== null}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <DeleteOutlined /> Delete
                </Typography.Link>
              </Popconfirm>
            </Flex>
          )
        },
      },
    ],
    [editingId, form, mCategory_Create.isPending, mCategory_Update.isPending],
  )

  return (
    <Flex flex={1} style={{ padding: 20 }} vertical>
      <Form form={form} onFinish={onFinish}>
        <Table<IWallet_Category>
          dataSource={dataTemp}
          columns={columns}
          rowKey="id"
          loading={isLoading || mCategory_Delete.isPending}
          styles={{
            root: {
              height: '100%',
              flex: 1,
            },
            body: {
              wrapper: {
                flex: 1,
                height: '100%',
              },
            },
          }}
        />
      </Form>
    </Flex>
  )
}
