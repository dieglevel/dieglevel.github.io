import { Card, Flex, Spin, Table } from 'antd'
import { useCallback, useRef, useState } from 'react'
import { ExpandedRowForm } from './components/expanded-row-form'
import { TaskFilterPanel } from './components/task-filter-panel'
import { useTaskColumns } from './components/task-table-columns'
import { useTaskDerivedData } from './hooks/use-task-derived-data'
import { useTaskPersistence } from './hooks/use-task-persistence'
import type { ExpandedInputSet } from './storage'
import type { Root } from './type'

export default function TaskPage() {
  const {
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
  } = useTaskPersistence()
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(false)
  const isFetchingRef = useRef<boolean>(false)

  const getTasks = useCallback(async (): Promise<Root> => {
    const body = new URLSearchParams({
      list_type: '0',
      page: '1',
      limit: '50',
      filters: JSON.stringify({
        status: { cond: 'in', value: '0,1,2,3,4,5' },
        priority: { cond: 'in', value: '0,1,2,3,4' },
        subject: { cond: '~', value: '' },
        psubject: { cond: '~', value: '' },
      }),
      sort: '',
    })

    const res = await fetch('/api/ngw/project/task/get_my_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    return res.json()
  }, [])

  const fetchTasks = useCallback(async () => {
    if (isFetchingRef.current) return

    isFetchingRef.current = true
    setIsTasksLoading(true)

    try {
      const dataFetch = await getTasks()
      setData(JSON.stringify(dataFetch, null, 2))
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      isFetchingRef.current = false
      setIsTasksLoading(false)
    }
  }, [getTasks])

  // useEffect(() => {
  //   void fetchTasks()

  //   let isCancelled = false
  //   let reloadTimeout: number | undefined

  //   const scheduleNextFetch = () => {
  //     if (isCancelled) return

  //     const randomDelayMs = (10 + Math.floor(Math.random() * 11)) * 60 * 1000

  //     reloadTimeout = window.setTimeout(() => {
  //       void fetchTasks().finally(() => {
  //         scheduleNextFetch()
  //       })
  //     }, randomDelayMs)
  //   }

  //   scheduleNextFetch()

  //   return () => {
  //     isCancelled = true
  //     if (reloadTimeout !== undefined) {
  //       window.clearTimeout(reloadTimeout)
  //     }
  //   }
  // }, [fetchTasks])

  const { filteredResult, statusOptions, toPercent } = useTaskDerivedData({
    data,
    keyword,
    percentRange,
    statusFilter,
  })

  const getTaskUrl = useCallback((item: Root['rows'][number]): string => {
    return `https://hanbirosoft.hanbiro.net/ngw/app/#/project/viewTask/1_0_0/pseqno/${item.seq_no}/taseq/${item.taseq_no}`
  }, [])

  const getTaskPrimaryKey = useCallback(
    (item: Root['rows'][number]): string => {
      return item.taseq_no || String(item.no)
    },
    [],
  )

  const handleAddComplete = useCallback((item: Root['rows'][number]) => {
    const markerId = String(item.no)
    setCompletedIds((currentIds) => {
      if (currentIds.includes(markerId)) {
        return currentIds
      }

      return [...currentIds, markerId]
    })
  }, [])

  const handleRemoveComplete = useCallback((item: Root['rows'][number]) => {
    const markerId = String(item.no)
    setCompletedIds((currentIds) =>
      currentIds.filter((completedId) => completedId !== markerId),
    )
  }, [])

  const columns = useTaskColumns({
    completedIds,
    toPercent,
    getTaskUrl,
    onAddComplete: handleAddComplete,
    onRemoveComplete: handleRemoveComplete,
  })

  const getOrCreateInputSets = useCallback(
    (rowKey: string): Array<ExpandedInputSet> => {
      return expandedInputSets[rowKey] ?? [{ mng: '', be: '', homepage: '' }]
    },
    [expandedInputSets],
  )

  const handleExpandedInputChange = useCallback(
    (
      rowKey: string,
      index: number,
      field: 'mng' | 'be' | 'homepage',
      value: string,
    ) => {
      setExpandedInputSets((currentSets) => {
        const rowSets = currentSets[rowKey] ?? [
          { mng: '', be: '', homepage: '' },
        ]
        const nextSets = [...rowSets]

        nextSets[index] = {
          ...nextSets[index],
          [field]: value,
        }

        return {
          ...currentSets,
          [rowKey]: nextSets,
        }
      })
    },
    [],
  )

  const handleAddExpandedInputSet = useCallback((rowKey: string) => {
    setExpandedInputSets((currentSets) => {
      const rowSets = currentSets[rowKey] ?? [{ mng: '', be: '', homepage: '' }]

      return {
        ...currentSets,
        [rowKey]: [...rowSets, { mng: '', be: '', homepage: '' }],
      }
    })
  }, [])

  const handleRemoveExpandedInputSet = useCallback((rowKey: string) => {
    setExpandedInputSets((currentSets) => {
      const rowSets = currentSets[rowKey] ?? [{ mng: '', be: '', homepage: '' }]

      if (rowSets.length <= 1) {
        return {
          ...currentSets,
          [rowKey]: [{ mng: '', be: '', homepage: '' }],
        }
      }

      return {
        ...currentSets,
        [rowKey]: rowSets.slice(0, -1),
      }
    })
  }, [])

  const handleExpandedNoteChange = useCallback(
    (rowKey: string, value: string) => {
      setExpandedNotes((currentNotes) => ({
        ...currentNotes,
        [rowKey]: value,
      }))
    },
    [],
  )

  const handleExpandedImageUpload = useCallback(
    (rowKey: string, file: File) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        const imageData = reader.result
        if (typeof imageData !== 'string') return

        setExpandedImages((currentImages) => {
          const rowImages = currentImages[rowKey] ?? []

          return {
            ...currentImages,
            [rowKey]: [...rowImages, imageData],
          }
        })
      }

      reader.readAsDataURL(file)
    },
    [],
  )

  const handleExpandedImageRemove = useCallback(
    (rowKey: string, index: number) => {
      setExpandedImages((currentImages) => {
        const rowImages = currentImages[rowKey] ?? []
        const nextRowImages = rowImages.filter(
          (_, imageIndex) => imageIndex !== index,
        )

        if (nextRowImages.length === 0) {
          const { [rowKey]: _removed, ...restImages } = currentImages
          return restImages
        }

        return {
          ...currentImages,
          [rowKey]: nextRowImages,
        }
      })
    },
    [],
  )

  const renderExpandedRow = useCallback(
    (item: Root['rows'][number]) => {
      const rowKey = getTaskPrimaryKey(item)
      const inputSets = getOrCreateInputSets(rowKey)

      return (
        <ExpandedRowForm
          rowKey={rowKey}
          inputSets={inputSets}
          note={expandedNotes[rowKey] ?? ''}
          images={expandedImages[rowKey] ?? []}
          onInputChange={handleExpandedInputChange}
          onAddInputSet={handleAddExpandedInputSet}
          onRemoveInputSet={handleRemoveExpandedInputSet}
          onNoteChange={handleExpandedNoteChange}
          onImageUpload={handleExpandedImageUpload}
          onImageRemove={handleExpandedImageRemove}
        />
      )
    },
    [
      expandedImages,
      expandedNotes,
      getTaskPrimaryKey,
      getOrCreateInputSets,
      handleAddExpandedInputSet,
      handleExpandedInputChange,
      handleExpandedImageRemove,
      handleExpandedImageUpload,
      handleExpandedNoteChange,
      handleRemoveExpandedInputSet,
    ],
  )

  return (
    <Flex vertical flex={1} style={{ padding: '16px', minHeight: '100vh' }}>
      <TaskFilterPanel
        data={data}
        onDataChange={setData}
        keyword={keyword}
        onKeywordChange={setKeyword}
        onReload={() => void fetchTasks()}
        isTasksLoading={isTasksLoading}
        filteredCount={filteredResult.length}
        percentRange={percentRange}
        onPercentRangeChange={setPercentRange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
      />

      <Spin spinning={isTasksLoading} tip="Loading tasks...">
        <Card>
          <Table
            rowKey={(item) => String(item.no)}
            columns={columns}
            dataSource={filteredResult}
            size="small"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{ emptyText: 'No tasks matched your filters' }}
            expandable={{
              expandedRowRender: renderExpandedRow,
              expandRowByClick: false,
            }}
          />
        </Card>
      </Spin>
    </Flex>
  )
}
