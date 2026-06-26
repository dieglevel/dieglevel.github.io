import { createFileRoute } from '@tanstack/react-router'
import { Flex } from 'antd'
import type { IWallet_Category } from '@/shared/api/wallet/category/category.type'
import type { ColumnsType } from 'antd/es/table'
import { useGetWallet_Category_List } from '@/shared/api/wallet/category/useGetWallet_Category_List'
import Table from '@/shared/components/table'

export const Route = createFileRoute('/(protected)/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetWallet_Category_List({})
  const columns: ColumnsType<IWallet_Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
  ]
  return (
    <Flex flex={1} style={{ padding: 20 }}>
      <Table<IWallet_Category>
        dataSource={data || []}
        columns={columns}
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
    </Flex>
  )
}
