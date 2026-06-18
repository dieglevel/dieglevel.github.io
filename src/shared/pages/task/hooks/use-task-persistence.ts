import { useEffect, useState } from 'react'
import {
  getSavedCompletedIds,
  getSavedData,
  getSavedExpandedImages,
  getSavedExpandedInputSets,
  getSavedExpandedNotes,
  getSavedKeyword,
  getSavedPercentRange,
  getSavedStatusFilter,
  saveCompletedIds,
  saveData,
  saveExpandedImages,
  saveExpandedInputSets,
  saveExpandedNotes,
  saveKeyword,
  savePercentRange,
  saveStatusFilter,
} from '../storage'
import type { ExpandedInputSet } from '../storage'
import type { Dispatch, SetStateAction } from 'react'

export interface TaskPersistenceState {
  data: string
  setData: Dispatch<SetStateAction<string>>
  keyword: string
  setKeyword: Dispatch<SetStateAction<string>>
  statusFilter: Array<string>
  setStatusFilter: Dispatch<SetStateAction<Array<string>>>
  percentRange: [number, number]
  setPercentRange: Dispatch<SetStateAction<[number, number]>>
  completedIds: Array<string>
  setCompletedIds: Dispatch<SetStateAction<Array<string>>>
  expandedInputSets: Record<string, Array<ExpandedInputSet>>
  setExpandedInputSets: Dispatch<
    SetStateAction<Record<string, Array<ExpandedInputSet>>>
  >
  expandedNotes: Record<string, string>
  setExpandedNotes: Dispatch<SetStateAction<Record<string, string>>>
  expandedImages: Record<string, Array<string>>
  setExpandedImages: Dispatch<SetStateAction<Record<string, Array<string>>>>
}

export const useTaskPersistence = (): TaskPersistenceState => {
  const [data, setData] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<Array<string>>([])
  const [percentRange, setPercentRange] = useState<[number, number]>([0, 100])
  const [completedIds, setCompletedIds] = useState<Array<string>>([])
  const [expandedInputSets, setExpandedInputSets] = useState<
    Record<string, Array<ExpandedInputSet>>
  >({})
  const [expandedNotes, setExpandedNotes] = useState<Record<string, string>>({})
  const [expandedImages, setExpandedImages] = useState<
    Record<string, Array<string>>
  >({})
  const [isStorageHydrated, setIsStorageHydrated] = useState<boolean>(false)

  useEffect(() => {
    const hydrateFilters = async () => {
      const [
        savedKeyword,
        savedData,
        savedStatusFilter,
        savedPercentRange,
        savedCompletedIds,
        savedExpandedInputSets,
        savedExpandedNotes,
        savedExpandedImages,
      ] = await Promise.all([
        getSavedKeyword(),
        getSavedData(),
        getSavedStatusFilter(),
        getSavedPercentRange(),
        getSavedCompletedIds(),
        getSavedExpandedInputSets(),
        getSavedExpandedNotes(),
        getSavedExpandedImages(),
      ])

      if (savedKeyword) setKeyword(savedKeyword)
      if (savedData) setData(savedData)
      if (savedStatusFilter.length > 0) setStatusFilter(savedStatusFilter)
      setPercentRange(savedPercentRange)
      setCompletedIds(savedCompletedIds)
      setExpandedInputSets(savedExpandedInputSets)
      setExpandedNotes(savedExpandedNotes)
      setExpandedImages(savedExpandedImages)

      setIsStorageHydrated(true)
    }

    void hydrateFilters()
  }, [])

  useEffect(() => {
    if (!isStorageHydrated) return
    void saveKeyword(keyword)
  }, [isStorageHydrated, keyword])

  useEffect(() => {
    if (!isStorageHydrated) return
    const timeoutId = window.setTimeout(() => {
      void saveData(data)
    }, 400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [data, isStorageHydrated])

  useEffect(() => {
    if (!isStorageHydrated) return
    void saveStatusFilter(statusFilter)
  }, [isStorageHydrated, statusFilter])

  useEffect(() => {
    if (!isStorageHydrated) return
    void savePercentRange(percentRange)
  }, [isStorageHydrated, percentRange])

  useEffect(() => {
    if (!isStorageHydrated) return
    void saveCompletedIds(completedIds)
  }, [completedIds, isStorageHydrated])

  useEffect(() => {
    if (!isStorageHydrated) return

    const timeoutId = window.setTimeout(() => {
      void saveExpandedInputSets(expandedInputSets)
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [expandedInputSets, isStorageHydrated])

  useEffect(() => {
    if (!isStorageHydrated) return

    const timeoutId = window.setTimeout(() => {
      void saveExpandedNotes(expandedNotes)
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [expandedNotes, isStorageHydrated])

  useEffect(() => {
    if (!isStorageHydrated) return

    const timeoutId = window.setTimeout(() => {
      void saveExpandedImages(expandedImages)
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [expandedImages, isStorageHydrated])

  return {
    data,
    setData,
    keyword,
    setKeyword,
    statusFilter,
    setStatusFilter,
    percentRange,
    setPercentRange,
    completedIds,
    setCompletedIds,
    expandedInputSets,
    setExpandedInputSets,
    expandedNotes,
    setExpandedNotes,
    expandedImages,
    setExpandedImages,
  }
}
