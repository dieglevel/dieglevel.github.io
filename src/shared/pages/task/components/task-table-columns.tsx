import { Button, Progress, Tag, Typography, message } from 'antd'
import { getStatusColor } from '../color'
import type { TableProps } from 'antd'
import type { Root } from '../type'

const { Text } = Typography

type TaskRow = Root['rows'][number]

interface UseTaskColumnsParams {
  completedIds: Array<string>
  toPercent: (value: string) => number
  getTaskUrl: (item: TaskRow) => string
  onAddComplete: (item: TaskRow) => void
  onRemoveComplete: (item: TaskRow) => void
}

export const useTaskColumns = ({
  completedIds,
  toPercent,
  getTaskUrl,
  onAddComplete,
  onRemoveComplete,
}: UseTaskColumnsParams): TableProps<TaskRow>['columns'] => {
  return [
    {
      title: 'Task',
      dataIndex: 'subject',
      key: 'subject',
      render: (_value: string, item: TaskRow) => {
        const taskUrl = getTaskUrl(item)

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <a
              href={taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 'fit-content',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease, color 0.2s ease',
                color: 'inherit',
                textDecoration: 'none',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.opacity = '0.85'
                event.currentTarget.style.color = '#1677ff'
                event.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.opacity = '1'
                event.currentTarget.style.color = 'inherit'
                event.currentTarget.style.textDecoration = 'none'
              }}
            >
              <Text strong>{item.subject || 'Untitled Task'}</Text>
            </a>
            <Text
              type="secondary"
              style={{ fontSize: '12px', cursor: 'copy', width: 'fit-content' }}
              title="Click to copy Task ID"
              onClick={(event) => {
                event.stopPropagation()
                if (!item.taseq_no) return

                void navigator.clipboard
                  .writeText(item.taseq_no)
                  .then(() => {
                    void message.success('Task ID copied')
                  })
                  .catch(() => {
                    void message.error('Failed to copy Task ID')
                  })
              }}
            >
              Task ID: {item.taseq_no || '-'}
            </Text>
          </div>
        )
      },
    },
    {
      title: 'Tag',
      key: 'tag',
      width: 220,
      render: (_value: unknown, item: TaskRow) => {
        const markerId = String(item.no)
        const isCompleted = completedIds.includes(markerId)

        return (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {item.status_msg && (
              <Tag
                color={getStatusColor(item.status_msg)}
                style={{ marginInlineEnd: 0 }}
              >
                {item.status_msg}
              </Tag>
            )}
            {isCompleted && (
              <Tag color="green" style={{ marginInlineEnd: 0 }}>
                Completed
              </Tag>
            )}
          </div>
        )
      },
    },
    {
      title: 'Progress',
      dataIndex: 'percent',
      key: 'percent',
      width: 180,
      align: 'center',
      render: (value: string) => (
        <Progress
          percent={toPercent(value)}
          size="small"
          style={{ margin: 0 }}
        />
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'updated_date',
      key: 'updated_date',
      width: 190,
      render: (value: string) => {
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return '-'
        return date.toLocaleString()
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_value: unknown, item: TaskRow) => {
        const markerId = String(item.no)
        const isCompleted = completedIds.includes(markerId)

        return (
          <Button
            type={isCompleted ? 'primary' : 'default'}
            size="small"
            onClick={(event) => {
              if (isCompleted) {
                onRemoveComplete(item)
              } else {
                onAddComplete(item)
              }
              event.stopPropagation()
            }}
          >
            {isCompleted ? 'Done' : 'Mark Complete'}
          </Button>
        )
      },
    },
  ]
}
