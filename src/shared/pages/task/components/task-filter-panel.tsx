import { Badge, Button, Card, Checkbox, Input, Slider, Typography } from 'antd'
import type { CheckboxOptionType } from 'antd/es/checkbox'

const { TextArea } = Input
const { Text } = Typography

interface TaskFilterPanelProps {
  data: string
  onDataChange: (value: string) => void
  keyword: string
  onKeywordChange: (value: string) => void
  onReload: () => void
  isTasksLoading: boolean
  filteredCount: number
  percentRange: [number, number]
  onPercentRangeChange: (value: [number, number]) => void
  statusFilter: Array<string>
  onStatusFilterChange: (value: Array<string>) => void
  statusOptions: Array<CheckboxOptionType>
}

export function TaskFilterPanel({
  data,
  onDataChange,
  keyword,
  onKeywordChange,
  onReload,
  isTasksLoading,
  filteredCount,
  percentRange,
  onPercentRangeChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
}: TaskFilterPanelProps) {
  return (
    <Card
      style={{
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        width: '100%',
      }}
      styles={{
        body: {
          display: 'flex',
          gap: '16px',
          flex: 1,
        },
      }}
    >
      <div style={{ width: '100%' }}>
        <Text
          type="secondary"
          style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}
        >
          Data JSON Field
        </Text>
        <TextArea
          value={data}
          onChange={(event) => onDataChange(event.target.value)}
          rows={5}
          placeholder="Paste JSON data here"
          style={{
            width: '100%',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        />
      </div>
      <div style={{ width: '100%' }}>
        <Text
          type="secondary"
          style={{
            fontSize: '12px',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          🔍 Search Tasks
        </Text>
        <Input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          allowClear
          placeholder="Filter by subject, parent task, or topic..."
          style={{ borderRadius: '6px' }}
        />
        <Button
          onClick={onReload}
          loading={isTasksLoading}
          style={{ marginTop: '8px' }}
        >
          Reload
        </Button>
        <Text
          type="secondary"
          style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}
        >
          Found:{' '}
          <Badge count={filteredCount} style={{ backgroundColor: '#1890ff' }} />{' '}
          tasks
        </Text>
        <Text
          type="secondary"
          style={{ fontSize: '12px', marginTop: '16px', display: 'block' }}
        >
          Percent range: {percentRange[0]}% - {percentRange[1]}%
        </Text>
        <Slider
          range
          min={0}
          max={100}
          value={percentRange}
          onChange={(value) => onPercentRangeChange(value as [number, number])}
          style={{ marginTop: '8px', marginBottom: '0' }}
        />
      </div>
      <div style={{ minWidth: '200px' }}>
        <Text
          type="secondary"
          style={{
            fontSize: '12px',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          🏷️ Filter by Status
        </Text>
        <Checkbox.Group
          value={statusFilter}
          onChange={(values) => onStatusFilterChange(values as Array<string>)}
          options={statusOptions}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        />
      </div>
    </Card>
  )
}
