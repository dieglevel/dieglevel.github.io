import { useEffect, useMemo, useState } from 'react'
import { Table as AntdTable } from 'antd'
import Pagination from '../pagination'
import { LIST_PAGE_SIZE_OPTIONS } from '@/shared/common/paginate'
import './index.css'

export interface TableProps<T> extends Omit<
  React.ComponentProps<typeof AntdTable<T>>,
  'pagination'
> {}

const TableComponent = <T extends object>({
  dataSource = [],
  ...props
}: TableProps<T>) => {
  const [paginate, setPaginate] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    setPaginate((prev) => ({
      ...prev,
      total: dataSource.length,
    }))
  }, [dataSource])

  const pageData = useMemo(() => {
    const start = (paginate.current - 1) * paginate.pageSize
    const end = start + paginate.pageSize

    return dataSource.slice(start, end)
  }, [dataSource, paginate.current, paginate.pageSize])

  return (
    <AntdTable<T>
      {...props}
      className="custom-table"
      rowKey="id"
      dataSource={pageData}
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
          showSizeChanger={false}
          showTotal={false}
          onChange={(page, pageSize) => {
            setPaginate((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize ? pageSize : prev.pageSize,
            }))
          }}
        />
      )}
      styles={{
        root: {
          flex: 1,
          borderRadius: 8,
        },

        ...props.styles,
      }}
      style={{
        borderRadius: 8,
        ...props.style,
      }}
    />
  )
}

const Table = Object.assign(TableComponent, {
  Summary: AntdTable.Summary,
})

export default Table
