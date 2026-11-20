import { useDraggable, useDroppable } from '@dnd-kit/core'
import {
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Segmented,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react'
import { formatMoney, formatQty, share } from './bill.utils'
import { NumberCell } from './number-cell'
import type { BillGroup, BillRow, SplitBy } from './bill.utils'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'

const { Text } = Typography

export const SPLIT_OPTIONS = [
  { label: '1', value: 1 },
  { label: '/2', value: 2 },
  { label: '/3', value: 3 },
]

/** Vùng thả: viền nổi bật khi đang kéo một dòng ngang qua */
export function DropZone({
  id,
  children,
  style,
}: {
  id: string
  children: ReactNode
  style?: React.CSSProperties
}) {
  const { setNodeRef, isOver, active } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        borderRadius: 10,
        outline: active
          ? `2px ${isOver ? 'solid' : 'dashed'} ${isOver ? '#1677ff' : '#bfbfbf'}`
          : '2px solid transparent',
        outlineOffset: 2,
        transition: 'outline-color 120ms',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function DragHandle({ row }: { row: BillRow }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: row.id })

  return (
    <Button
      ref={setNodeRef}
      type="text"
      size="small"
      icon={<GripVertical size={14} />}
      style={{ cursor: 'grab', touchAction: 'none' }}
      aria-label={`Kéo "${row.name}" sang bảng khác`}
      {...listeners}
      {...attributes}
    />
  )
}

interface Props {
  group: BillGroup
  rows: Array<BillRow>
  showHidden: boolean
  draggingId: string | null
  canDelete: boolean
  onUpdate: (id: string, patch: Partial<BillRow>) => void
  onRecalc: (
    row: BillRow,
    patch: Pick<Partial<BillRow>, 'quantity' | 'unitPrice'>,
  ) => void
  onSplitAll: (groupId: string, split: SplitBy) => void
  onAddRow: (groupId: string) => void
  onRename: (groupId: string, name: string) => void
  onDelete: (groupId: string) => void
  onCopy: (group: BillGroup, rows: Array<BillRow>) => void
}

export function BillTable({
  group,
  rows,
  showHidden,
  draggingId,
  canDelete,
  onUpdate,
  onRecalc,
  onSplitAll,
  onAddRow,
  onRename,
  onDelete,
  onCopy,
}: Props) {
  const visibleRows = rows.filter((r) => !r.hidden)
  const tableRows = showHidden ? rows : visibleRows
  const totalAmount = visibleRows.reduce((s, r) => s + r.amount, 0)
  const totalShare = visibleRows.reduce((s, r) => s + share(r), 0)

  const columns: ColumnsType<BillRow> = [
    {
      width: 36,
      align: 'center',
      render: (_, row) => <DragHandle row={row} />,
    },
    {
      title: '#',
      width: 40,
      align: 'center',
      render: (_, __, i) => <Text type="secondary">{i + 1}</Text>,
    },
    {
      title: 'Sản phẩm',
      render: (_, row) => (
        <Input
          size="small"
          variant="borderless"
          value={row.name}
          placeholder="Tên sản phẩm"
          onChange={(e) => onUpdate(row.id, { name: e.target.value })}
        />
      ),
    },
    {
      title: 'SL',
      width: 110,
      align: 'right',
      render: (_, row) => (
        <NumberCell
          value={row.quantity}
          suffix={row.unit || undefined}
          format={formatQty}
          onChange={(quantity) => onRecalc(row, { quantity })}
        />
      ),
    },
    {
      title: 'Đơn giá',
      width: 130,
      align: 'right',
      render: (_, row) => (
        <Flex vertical align="flex-end">
          <NumberCell
            value={row.unitPrice}
            format={formatMoney}
            onChange={(unitPrice) => onRecalc(row, { unitPrice })}
          />
          {row.listPrice !== row.unitPrice && row.listPrice > 0 && (
            <Text
              delete
              type="secondary"
              style={{ fontSize: 11, paddingRight: 8 }}
            >
              {formatMoney(row.listPrice)}
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: (
        <Tooltip title="Sửa trực tiếp. Gõ /2, *3, -5000 hoặc 145000/3">
          Thành tiền
        </Tooltip>
      ),
      width: 140,
      align: 'right',
      render: (_, row) => (
        <NumberCell
          value={row.amount}
          format={formatMoney}
          onChange={(amount) => onUpdate(row.id, { amount })}
        />
      ),
    },
    {
      title: 'Chia',
      width: 150,
      align: 'center',
      render: (_, row) => (
        <Segmented
          size="small"
          options={SPLIT_OPTIONS}
          value={row.split}
          onChange={(v) => onUpdate(row.id, { split: v as SplitBy })}
        />
      ),
    },
    {
      title: 'Phần chia',
      width: 120,
      align: 'right',
      render: (_, row) => (
        <Text
          strong={row.split > 1}
          type={row.split > 1 ? undefined : 'secondary'}
        >
          {formatMoney(share(row))}
        </Text>
      ),
    },
    {
      width: 48,
      align: 'center',
      render: (_, row) => (
        <Tooltip title={row.hidden ? 'Hiện dòng' : 'Ẩn dòng (không copy)'}>
          <Button
            type="text"
            size="small"
            icon={row.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            onClick={() => onUpdate(row.id, { hidden: !row.hidden })}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <DropZone id={group.id}>
      <Card
        size="small"
        title={
          <Flex align="center" gap={8}>
            <Input
              size="small"
              variant="borderless"
              value={group.name}
              onChange={(e) => onRename(group.id, e.target.value)}
              style={{ fontWeight: 600, maxWidth: 220 }}
            />
            <Text type="secondary" style={{ fontWeight: 400 }}>
              {visibleRows.length}/{rows.length} dòng
            </Text>
          </Flex>
        }
        extra={
          <Space wrap>
            <Text type="secondary">Chia tất cả:</Text>
            <Segmented
              size="small"
              options={SPLIT_OPTIONS}
              onChange={(v) => onSplitAll(group.id, v as SplitBy)}
            />
            <Button
              size="small"
              icon={<Copy size={14} />}
              disabled={!visibleRows.length}
              onClick={() => onCopy(group, visibleRows)}
            >
              Copy
            </Button>
            {canDelete && (
              <Popconfirm
                title="Xoá bảng này?"
                description="Các dòng sẽ chuyển về bảng đầu tiên."
                okText="Xoá"
                cancelText="Huỷ"
                onConfirm={() => onDelete(group.id)}
              >
                <Button
                  size="small"
                  danger
                  type="text"
                  icon={<Trash2 size={14} />}
                />
              </Popconfirm>
            )}
          </Space>
        }
      >
        <Table<BillRow>
          rowKey="id"
          size="small"
          pagination={false}
          columns={columns}
          dataSource={tableRows}
          scroll={{ x: 950 }}
          onRow={(row) => ({
            style:
              row.id === draggingId
                ? { opacity: 0.35 }
                : row.hidden
                  ? { opacity: 0.4, textDecoration: 'line-through' }
                  : undefined,
          })}
          locale={{ emptyText: 'Kéo dòng vào đây' }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5}>
                <Button
                  size="small"
                  type="dashed"
                  icon={<Plus size={14} />}
                  onClick={() => onAddRow(group.id)}
                >
                  Thêm dòng
                </Button>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="right">
                <Text strong>{formatMoney(totalAmount)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} />
              <Table.Summary.Cell index={7} align="right">
                <Text strong>{formatMoney(totalShare)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </DropZone>
  )
}
