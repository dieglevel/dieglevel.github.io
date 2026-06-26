import { useState } from 'react'
import { Table as AntdTable } from 'antd'
import Pagination from '../pagination'
import { LIST_PAGE_SIZE_OPTIONS } from '@/shared/common/paginate'
import './index.css'

export interface TableProps<T> extends React.ComponentProps<
  typeof AntdTable<T>
> {}

export default function Table<T>(props: TableProps<T>) {
  const [paginate, setPaginate] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  return (
    <AntdTable<T>
      className="custom-table"
      rowKey={'id'}
      columns={props.columns}
      dataSource={props.dataSource}
      size="small"
      styles={{
        root: {
          flex: 1,
        },
        pagination: {
          root: {
            justifyContent: 'space-between',
          },
        },
      }}
      pagination={false}
      footer={() => (
        <Pagination
          total={paginate.total}
          current={paginate.current}
          pageSize={paginate.pageSize}
          optionPageSize={{
            value: LIST_PAGE_SIZE_OPTIONS,
            defaultValue: 1,
          }}
          onChange={(page, pageSize) => {
            setPaginate((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize || prev.pageSize,
            }))
          }}
        />
      )}
      // onRow={(row) => {
      //   return {
      //     onClick: () => handleOnRow(row),
      //     style: { cursor: 'pointer' },
      //   }
      // }}

      {...props}
    />
  )
}
