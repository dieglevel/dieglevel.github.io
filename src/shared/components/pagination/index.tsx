import { Pagination as AntPagination, Button, Flex, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import Select from '../select'
import {
  DEFAULT_PAGE_SIZE,
  LIST_PAGE_SIZE_OPTIONS,
} from '@/shared/common/paginate'
import { colors } from '@/shared/common/design-token'

export interface PaginationProps {
  total: number | undefined
  pageSize?: number | undefined
  optionPageSize?: {
    value: Array<number>
    defaultValue?: number
  }
  current?: number | undefined
  showTotal?: boolean | undefined
  showSizeChanger?: boolean | undefined
  showQuickJumper?: boolean | undefined
  onChange?: (page: number, pageSize: number) => void
  onShowSizeChange?: (current: number, size: number) => void
}

export default function Pagination({
  total,
  pageSize,
  current,
  optionPageSize = {
    value: LIST_PAGE_SIZE_OPTIONS,
    defaultValue: DEFAULT_PAGE_SIZE,
  },
  showTotal = true,
  showSizeChanger = true,
  showQuickJumper = false,
  onChange,
  onShowSizeChange,
}: PaginationProps) {
  const [innerCurrent, setInnerCurrent] = useState(1)
  const [innerPageSize, setInnerPageSize] = useState(
    optionPageSize.defaultValue ?? DEFAULT_PAGE_SIZE,
  )

  const resolvedCurrent = current ?? innerCurrent
  const resolvedPageSize = pageSize ?? innerPageSize
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / resolvedPageSize))

  const pageSizeOptions = useMemo(
    () =>
      optionPageSize.value.map((option) => ({
        label: `${option}`,
        value: option,
      })),
    [optionPageSize],
  )

  const handleChange = (nextPage: number, nextPageSize: number) => {
    if (current === undefined) setInnerCurrent(nextPage)
    if (pageSize === undefined) setInnerPageSize(nextPageSize)
    onChange?.(nextPage, nextPageSize)
  }

  const handlePageSizeChange = (nextSize: number) => {
    const nextPage = 1

    if (pageSize === undefined) setInnerPageSize(nextSize)
    if (current === undefined) setInnerCurrent(nextPage)

    onShowSizeChange?.(nextPage, nextSize)
    onChange?.(nextPage, nextSize)
  }

  const handleJumpFirst = () => {
    handleChange(1, resolvedPageSize)
  }

  const handleJumpLast = () => {
    handleChange(totalPages, resolvedPageSize)
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      gap={8}
      style={{ width: '100%' }}
    >
      {/* Total Display */}
      <Flex
        align="center"
        style={{
          minWidth: 100,
          flexShrink: 0,
        }}
      >
        {showTotal ? (
          <Flex gap={8} align="center">
            <Typography.Text
              style={{
                color: colors.secondary[600],
                fontSize: 14,
              }}
            >
              Total
            </Typography.Text>
            <Typography.Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: colors.primary.base,
              }}
            >
              {total}
            </Typography.Text>
          </Flex>
        ) : null}
      </Flex>

      {/* Main Page Navigation Controls */}
      <Flex
        style={{ flex: 1, minWidth: 260 }}
        justify="center"
        gap={4}
        align="center"
      >
        {resolvedCurrent > 1 && (
          <Button
            type="text"
            onClick={handleJumpFirst}
            disabled={resolvedCurrent <= 1}
            icon={<DoubleLeftOutlined />}
            size="small"
          />
        )}

        <AntPagination
          responsive
          total={total}
          current={resolvedCurrent}
          pageSize={resolvedPageSize}
          showQuickJumper={showQuickJumper}
          showSizeChanger={false}
          onChange={handleChange}
        />

        {resolvedCurrent < totalPages && (
          <Button
            type="text"
            onClick={handleJumpLast}
            disabled={resolvedCurrent >= totalPages}
            icon={<DoubleRightOutlined />}
            size="small"
          />
        )}
      </Flex>

      {/* Page Size Changer Dropdown */}
      <Flex
        style={{
          minWidth: 100,
          flexShrink: 0,
        }}
        justify="flex-end"
      >
        {showSizeChanger ? (
          <Select
            value={resolvedPageSize}
            options={pageSizeOptions}
            onChange={handlePageSizeChange}
            style={{ minWidth: 90 }}
          />
        ) : null}
      </Flex>
    </Flex>
  )
}
