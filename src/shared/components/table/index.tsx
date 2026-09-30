import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Table as AntdTable } from 'antd'
import Pagination from '../pagination'
import { LIST_PAGE_SIZE_OPTIONS } from '@/shared/common/paginate'
import './index.css'

export type TablePaginationMode = 'Scroll' | 'Paginate'

export interface TableProps<T> extends Omit<
  React.ComponentProps<typeof AntdTable<T>>,
  'pagination'
> {
  /** 'Paginate': phân trang ở footer | 'Scroll': infinite scroll */
  pagination?: TablePaginationMode
  /** Số dòng mỗi trang / mỗi lần load thêm */
  pageSize?: number
  /** Khoảng cách (px) tới đáy để bắt đầu load thêm (mode Scroll) */
  scrollThreshold?: number
}

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SCROLL_Y = 400

const TableComponent = <T extends object>({
  dataSource = [],
  pagination = 'Paginate',
  pageSize: pageSizeProp = DEFAULT_PAGE_SIZE,
  scrollThreshold = 50,
  scroll,
  styles,
  style,
  ...props
}: TableProps<T>) => {
  const isScroll = pagination === 'Scroll'
  const wrapperRef = useRef<HTMLDivElement>(null)

  /* ---------- Paginate mode ---------- */
  const [paginate, setPaginate] = useState({
    current: 1,
    pageSize: pageSizeProp,
  })

  /* ---------- Scroll mode ---------- */
  const [visibleCount, setVisibleCount] = useState(pageSizeProp)

  const total = dataSource.length

  // Reset khi data / mode / pageSize thay đổi
  useEffect(() => {
    setPaginate({ current: 1, pageSize: pageSizeProp })
    setVisibleCount(pageSizeProp)
  }, [dataSource, pagination, pageSizeProp])

  const pageData = useMemo(() => {
    if (isScroll) {
      return dataSource.slice(0, visibleCount)
    }
    const start = (paginate.current - 1) * paginate.pageSize
    return dataSource.slice(start, start + paginate.pageSize)
  }, [dataSource, isScroll, visibleCount, paginate.current, paginate.pageSize])

  const hasMore = isScroll && visibleCount < total

  const handleScroll = useCallback(
    (e: Event) => {
      const el = e.target as HTMLElement
      const reachedBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - scrollThreshold

      if (reachedBottom) {
        setVisibleCount((prev) =>
          prev < total ? Math.min(prev + pageSizeProp, total) : prev,
        )
      }
    },
    [total, pageSizeProp, scrollThreshold],
  )

  // Gắn listener vào .ant-table-body (vùng cuộn của antd khi có scroll.y)
  useEffect(() => {
    if (!isScroll) return
    const body = wrapperRef.current?.querySelector('.ant-table-body')
    if (!body) return

    body.addEventListener('scroll', handleScroll)
    return () => body.removeEventListener('scroll', handleScroll)
  }, [isScroll, handleScroll])

  // Nếu dữ liệu chưa đủ lấp đầy vùng cuộn thì tự load thêm
  useEffect(() => {
    if (!isScroll || !hasMore) return
    const body = wrapperRef.current?.querySelector(
      '.ant-table-body',
    ) as HTMLElement | null
    if (body && body.scrollHeight <= body.clientHeight) {
      setVisibleCount((prev) => Math.min(prev + pageSizeProp, total))
    }
  }, [isScroll, hasMore, visibleCount, total, pageSizeProp])

  return (
    <div ref={wrapperRef} style={{ flex: 1, minHeight: 0 }}>
      <AntdTable<T>
        className="custom-table"
        rowKey="id"
        {...props}
        dataSource={pageData}
        pagination={false}
        // Mode Scroll bắt buộc phải có scroll.y để có vùng cuộn
        scroll={isScroll ? { y: DEFAULT_SCROLL_Y, ...scroll } : scroll}
        footer={
          isScroll
            ? undefined
            : () => (
                <Pagination
                  total={total}
                  current={paginate.current}
                  pageSize={paginate.pageSize}
                  optionPageSize={{
                    value: LIST_PAGE_SIZE_OPTIONS,
                    defaultValue: pageSizeProp,
                  }}
                  showSizeChanger={false}
                  showTotal={false}
                  onChange={(page, size) => {
                    setPaginate((prev) => ({
                      current: page,
                      pageSize: size ? size : prev.pageSize,
                    }))
                  }}
                />
              )
        }
        styles={{
          root: {
            flex: 1,
            borderRadius: 8,
          },
          ...styles,
        }}
        style={{
          borderRadius: 8,
          ...style,
        }}
      />
    </div>
  )
}

const Table = Object.assign(TableComponent, {
  Summary: AntdTable.Summary,
})

export default Table
