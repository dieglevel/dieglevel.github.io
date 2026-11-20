import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  App,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Flex,
  Input,
  Segmented,
  Space,
  Switch,
  Typography,
} from 'antd'
import { Copy, GripVertical, Plus, RotateCcw } from 'lucide-react'
import {
  COPY_COLUMNS,
  MAIN_GROUP_ID,
  buildGroupsTsv,
  buildTsv,
  formatMoney,
  newGroupId,
  newRowId,
  parseBillJson,
  share,
} from './bill.utils'
import { BillTable, DropZone } from './bill-table'
import type {
  BillGroup,
  BillInfo,
  BillRow,
  CopyColumn,
  CopyOptions,
  SplitBy,
} from './bill.utils'
import type {
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'

const { Text } = Typography

const NEW_GROUP_DROP = '__new__'
const DOCK_PREFIX = 'dock:'
const DEFAULT_GROUPS: Array<BillGroup> = [{ id: MAIN_GROUP_ID, name: 'Chung' }]

/**
 * Xét va chạm theo vị trí con trỏ (bóng kéo rộng dễ đè sang ô bên cạnh).
 * Thanh thả nhanh nằm đè lên bảng nên được ưu tiên. Kéo bằng bàn phím
 * (không có con trỏ) thì xét theo khung.
 */
const collisionDetection: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) return rectIntersection(args)
  const hits = pointerWithin(args)
  const dock = hits.find((h) => String(h.id).startsWith(DOCK_PREFIX))
  return dock ? [dock] : hits
}

const BillToExcelPage = () => {
  const { message } = App.useApp()

  const [json, setJson] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [rows, setRows] = useState<Array<BillRow>>([])
  const [groups, setGroups] = useState<Array<BillGroup>>(DEFAULT_GROUPS)
  const [info, setInfo] = useState<BillInfo | null>(null)
  const [showHidden, setShowHidden] = useState(true)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const [copyColumns, setCopyColumns] = useState<Array<CopyColumn>>([
    'name',
    'quantity',
    'unitPrice',
    'amount',
    'share',
  ])
  const [copyHeader, setCopyHeader] = useState(true)
  const [copyTotal, setCopyTotal] = useState(true)
  const [decimal, setDecimal] = useState<'.' | ','>(',')

  const copyOptions: CopyOptions = {
    columns: copyColumns,
    header: copyHeader,
    totalRow: copyTotal,
    decimal,
  }

  // Kéo bằng chuột sau khi di 4px (không nuốt click), hoặc bằng bàn phím
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  )

  const parse = (text: string) => {
    setJson(text)
    if (!text.trim()) {
      setParseError(null)
      return
    }
    try {
      const parsed = parseBillJson(text)
      setRows(parsed.rows)
      setGroups(DEFAULT_GROUPS)
      setInfo(parsed.info)
      setParseError(null)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'JSON không hợp lệ')
    }
  }

  const update = (id: string, patch: Partial<BillRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  /** Đổi SL / đơn giá thì tính lại thành tiền */
  const recalc = (
    row: BillRow,
    patch: Pick<Partial<BillRow>, 'quantity' | 'unitPrice'>,
  ) => {
    const next = { ...row, ...patch }
    update(row.id, { ...patch, amount: next.quantity * next.unitPrice })
  }

  const rowsByGroup = useMemo(() => {
    const map = new Map<string, Array<BillRow>>()
    groups.forEach((g) => map.set(g.id, []))
    rows.forEach((r) => {
      const list = map.get(r.groupId) ?? map.get(MAIN_GROUP_ID)
      list?.push(r)
    })
    return map
  }, [rows, groups])

  const visibleRows = rows.filter((r) => !r.hidden)
  const hiddenCount = rows.length - visibleRows.length
  const draggingRow = rows.find((r) => r.id === draggingId)

  const groupTotals = groups.map((g) => {
    const visible = (rowsByGroup.get(g.id) ?? []).filter((r) => !r.hidden)
    return {
      group: g,
      rows: visible,
      amount: visible.reduce((s, r) => s + r.amount, 0),
      share: visible.reduce((s, r) => s + share(r), 0),
    }
  })

  const addGroup = () => {
    const group = { id: newGroupId(), name: `Bảng ${groups.length + 1}` }
    setGroups((prev) => [...prev, group])
    return group
  }

  const deleteGroup = (groupId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.groupId === groupId ? { ...r, groupId: groups[0].id } : r,
      ),
    )
    setGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const addRow = (groupId: string) =>
    setRows((prev) => [
      ...prev,
      {
        id: newRowId(),
        groupId,
        name: '',
        quantity: 1,
        unit: '',
        listPrice: 0,
        unitPrice: 0,
        amount: 0,
        split: 1,
        hidden: false,
      },
    ])

  const onDragStart = ({ active }: DragStartEvent) =>
    setDraggingId(String(active.id))

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingId(null)
    if (!over) return
    let target = String(over.id)
    if (target.startsWith(DOCK_PREFIX))
      target = target.slice(DOCK_PREFIX.length)
    const groupId = target === NEW_GROUP_DROP ? addGroup().id : target
    update(String(active.id), { groupId })
  }

  const writeClipboard = async (text: string, count: number) => {
    try {
      await navigator.clipboard.writeText(text)
      void message.success(
        `Đã copy ${count} dòng — dán vào Excel / Google Sheets`,
      )
    } catch {
      void message.error('Không copy được (trình duyệt chặn clipboard)')
    }
  }

  const copyGroup = (_: BillGroup, groupRows: Array<BillRow>) =>
    writeClipboard(buildTsv(groupRows, copyOptions), groupRows.length)

  const copyAll = () =>
    writeClipboard(
      buildGroupsTsv(
        groupTotals.map((g) => ({ name: g.group.name, rows: g.rows })),
        copyOptions,
      ),
      visibleRows.length,
    )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setDraggingId(null)}
    >
      <Flex vertical gap={16} style={{ padding: 24, width: '100%' }}>
        <Card title="Nhập JSON hoá đơn" size="small">
          <Input.TextArea
            rows={rows.length ? 3 : 10}
            value={json}
            placeholder='Dán JSON (response đầy đủ, phần "data", hoặc mảng sản phẩm có productName)'
            status={parseError ? 'error' : undefined}
            onChange={(e) => parse(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
          {parseError && (
            <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
              {parseError}
            </Text>
          )}
          {info && !parseError && (
            <Descriptions
              size="small"
              column={{ xs: 1, sm: 2, lg: 4 }}
              style={{ marginTop: 12 }}
              items={[
                { label: 'Mã đơn', children: info.orderId ?? '-' },
                { label: 'Cửa hàng', children: info.storeName ?? '-' },
                {
                  label: 'Ngày',
                  children: info.date
                    ? new Date(info.date).toLocaleString('vi-VN')
                    : '-',
                },
                {
                  label: 'Tổng hoá đơn',
                  children:
                    info.total !== undefined ? formatMoney(info.total) : '-',
                },
                ...info.discounts.map((d) => ({
                  label: d.name,
                  children: `-${formatMoney(d.amount)}`,
                })),
                {
                  label: 'Đã trả',
                  children:
                    info.paid !== undefined ? formatMoney(info.paid) : '-',
                },
                {
                  label: 'Tiết kiệm',
                  children:
                    info.saved !== undefined ? formatMoney(info.saved) : '-',
                },
              ]}
            />
          )}
        </Card>

        {rows.length > 0 && (
          <Flex align="center" gap={12} wrap>
            <Text type="secondary">
              Kéo <GripVertical size={12} /> để chuyển dòng sang bảng khác — mỗi
              bảng tính tổng riêng.
            </Text>
            <Flex align="center" gap={8} style={{ marginLeft: 'auto' }}>
              <Switch
                size="small"
                checked={showHidden}
                onChange={setShowHidden}
                disabled={!hiddenCount}
              />
              <Text type="secondary">Hiện dòng ẩn ({hiddenCount})</Text>
              <Button
                size="small"
                icon={<RotateCcw size={14} />}
                disabled={!hiddenCount}
                onClick={() =>
                  setRows((prev) => prev.map((r) => ({ ...r, hidden: false })))
                }
              >
                Bỏ ẩn tất cả
              </Button>
              <Button size="small" icon={<Plus size={14} />} onClick={addGroup}>
                Thêm bảng
              </Button>
            </Flex>
          </Flex>
        )}

        {(rows.length > 0 || groups.length > 1) &&
          groups.map((g, i) => (
            <BillTable
              key={g.id}
              group={g}
              rows={rowsByGroup.get(g.id) ?? []}
              showHidden={showHidden}
              draggingId={draggingId}
              canDelete={i > 0}
              onUpdate={update}
              onRecalc={recalc}
              onSplitAll={(groupId, split: SplitBy) =>
                setRows((prev) =>
                  prev.map((r) =>
                    r.groupId === groupId && !r.hidden ? { ...r, split } : r,
                  ),
                )
              }
              onAddRow={addRow}
              onRename={(groupId, name) =>
                setGroups((prev) =>
                  prev.map((x) => (x.id === groupId ? { ...x, name } : x)),
                )
              }
              onDelete={deleteGroup}
              onCopy={copyGroup}
            />
          ))}

        {rows.length > 0 && (
          <DropZone id={NEW_GROUP_DROP}>
            <Flex
              justify="center"
              align="center"
              gap={8}
              style={{
                padding: 20,
                border: '1px dashed #d9d9d9',
                borderRadius: 8,
                color: '#8c8c8c',
              }}
            >
              <Plus size={16} /> Kéo dòng vào đây để tạo bảng mới
            </Flex>
          </DropZone>
        )}

        <Card size="small" title="Tổng hợp & copy sang Excel">
          <Flex vertical gap={12}>
            {rows.length > 0 && (
              <Descriptions
                size="small"
                column={{ xs: 1, sm: 2, lg: 4 }}
                items={[
                  ...groupTotals.map((g) => ({
                    label: g.group.name || '(chưa đặt tên)',
                    children: (
                      <span>
                        {formatMoney(g.amount)}
                        {g.share !== g.amount && (
                          <Text type="secondary">
                            {' '}
                            · chia {formatMoney(g.share)}
                          </Text>
                        )}
                      </span>
                    ),
                  })),
                  {
                    label: 'Tổng các bảng',
                    children: (
                      <Text strong>
                        {formatMoney(
                          groupTotals.reduce((s, g) => s + g.amount, 0),
                        )}
                      </Text>
                    ),
                  },
                ]}
              />
            )}
            <Checkbox.Group
              options={COPY_COLUMNS}
              value={copyColumns}
              onChange={(v) => setCopyColumns(v)}
            />
            <Space wrap size="middle">
              <Checkbox
                checked={copyHeader}
                onChange={(e) => setCopyHeader(e.target.checked)}
              >
                Dòng tiêu đề
              </Checkbox>
              <Checkbox
                checked={copyTotal}
                onChange={(e) => setCopyTotal(e.target.checked)}
              >
                Dòng tổng
              </Checkbox>
              <Space>
                <Text type="secondary">Dấu thập phân:</Text>
                <Segmented
                  size="small"
                  options={[
                    { label: ', (Excel tiếng Việt)', value: ',' },
                    { label: '. (Excel tiếng Anh)', value: '.' },
                  ]}
                  value={decimal}
                  onChange={(v) => setDecimal(v as '.' | ',')}
                />
              </Space>
              <Button
                type="primary"
                icon={<Copy size={16} />}
                disabled={!copyColumns.length || !visibleRows.length}
                onClick={copyAll}
              >
                Copy tất cả bảng ({visibleRows.length} dòng)
              </Button>
            </Space>
          </Flex>
        </Card>
      </Flex>

      {/* Thanh thả nhanh ở đáy màn hình khi đang kéo — khỏi phải cuộn */}
      {draggingId && (
        <Flex
          gap={8}
          wrap
          justify="center"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: 10,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            maxWidth: 'calc(100vw - 48px)',
          }}
        >
          {groups
            .filter((g) => g.id !== draggingRow?.groupId)
            .map((g) => (
              <DropZone key={g.id} id={`${DOCK_PREFIX}${g.id}`}>
                <div style={dockChipStyle}>{g.name || '(chưa đặt tên)'}</div>
              </DropZone>
            ))}
          <DropZone id={`${DOCK_PREFIX}${NEW_GROUP_DROP}`}>
            <div style={{ ...dockChipStyle, borderStyle: 'dashed' }}>
              + Bảng mới
            </div>
          </DropZone>
        </Flex>
      )}

      <DragOverlay dropAnimation={null} zIndex={1100}>
        {draggingRow && (
          <Flex
            align="center"
            gap={8}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: '#fff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              cursor: 'grabbing',
              whiteSpace: 'nowrap',
              width: 'max-content',
            }}
          >
            <GripVertical size={14} />
            <Text strong>{draggingRow.name || '(không tên)'}</Text>
            <Text type="secondary">{formatMoney(share(draggingRow))}</Text>
          </Flex>
        )}
      </DragOverlay>
    </DndContext>
  )
}

const dockChipStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #d9d9d9',
  borderRadius: 8,
  background: '#fff',
  fontWeight: 500,
  minWidth: 90,
  textAlign: 'center',
}

export default BillToExcelPage
