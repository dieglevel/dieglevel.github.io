import { useCallback, useMemo } from 'react'
import type { Root } from '../type'

interface UseTaskDerivedDataParams {
  data: string
  keyword: string
  percentRange: [number, number]
  statusFilter: Array<string>
}

export const useTaskDerivedData = ({
  data,
  keyword,
  percentRange,
  statusFilter,
}: UseTaskDerivedDataParams) => {
  const dataResult = useMemo(() => {
    if (!data.trim()) return []

    try {
      const jsonData = JSON.parse(data) as Root
      return jsonData.rows
    } catch (error) {
      console.error('Invalid JSON:', error)
      return []
    }
  }, [data])

  const statusOptions = useMemo(() => {
    const options = new Set<string>()
    dataResult.forEach((item) => {
      if (item.status_msg) options.add(item.status_msg)
    })

    return Array.from(options).map((value) => ({ label: value, value }))
  }, [dataResult])

  const filteredResult = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase()
    const [minPercent, maxPercent] = percentRange

    const toTimestamp = (value: string): number => {
      const time = Date.parse(value)
      return Number.isNaN(time) ? 0 : time
    }

    const toPercent = (value: string): number => {
      const parsedPercent = Number.parseFloat(value || '0')
      if (Number.isNaN(parsedPercent)) return 0
      return Math.max(0, Math.min(100, parsedPercent))
    }

    const filtered = dataResult.filter((item) => {
      const passStatus =
        statusFilter.length === 0 || statusFilter.includes(item.status_msg)
      const percent = toPercent(item.percent)
      const passPercent = percent >= minPercent && percent <= maxPercent
      const passKeyword =
        !lowerKeyword ||
        item.psubject.toLowerCase().includes(lowerKeyword) ||
        item.parent_task.toLowerCase().includes(lowerKeyword) ||
        item.subject.toLowerCase().includes(lowerKeyword)

      return passStatus && passPercent && passKeyword
    })

    return filtered.sort(
      (a, b) => toTimestamp(b.updated_date) - toTimestamp(a.updated_date),
    )
  }, [dataResult, keyword, percentRange, statusFilter])

  const toPercent = useCallback((value: string): number => {
    const parsedPercent = Number.parseFloat(value || '0')
    if (Number.isNaN(parsedPercent)) return 0
    return Math.max(0, Math.min(100, parsedPercent))
  }, [])

  return {
    filteredResult,
    statusOptions,
    toPercent,
  }
}
