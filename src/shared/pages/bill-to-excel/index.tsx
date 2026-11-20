import { useMemo, useState } from 'react'
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
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { Copy, Eye, EyeOff, Plus, RotateCcw } from 'lucide-react'
import {
  COPY_COLUMNS,
  buildTsv,
  formatMoney,
  formatQty,
  newRowId,
  parseBillJson,
  share,
} from './bill.utils'
import { NumberCell } from './number-cell'
import type { BillInfo, BillRow, CopyColumn, SplitBy } from './bill.utils'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

const SPLIT_OPTIONS = [
  { label: '1', value: 1 },
  { label: '/2', value: 2 },
  { label: '/3', value: 3 },
]

const BillToExcelPage = () => {
  const { message } = App.useApp()

  const [json, setJson] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [rows, setRows] = useState<Array<BillRow>>([])
  const [info, setInfo] = useState<BillInfo | null>(null)
  const [showHidden, setShowHidden] = useState(true)

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

  const parse = (text: string) => {
    setJson(text)
    if (!text.trim()) {
      setParseError(null)
      return
    }
    try {
      const parsed = parseBillJson(text)
      setRows(parsed.rows)
      setInfo(parsed.info)
      setParseError(null)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'JSON không hợp lệ')
    }
  }

  const update = (id: string, patch: Partial<BillRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  /** Đổi SL / đơn giá thì tính lại thành tiền */
  const updateAndRecalc = (
    row: BillRow,
    patch: Pick<Partial<BillRow>, 'quantity' | 'unitPrice'>,
  ) => {
    const next = { ...row, ...patch }
    update(row.id, { ...patch, amount: next.quantity * next.unitPrice })
  }

  const visibleRows = useMemo(() => rows.filter((r) => !r.hidden), [rows])
  const hiddenCount = rows.length - visibleRows.length
  const tableRows = showHidden ? rows : visibleRows

  const totalAmount = visibleRows.reduce((s, r) => s + r.amount, 0)
  const totalShare = visibleRows.reduce((s, r) => s + share(r), 0)

  const setSplitAll = (split: SplitBy) =>
    setRows((prev) => prev.map((r) => (r.hidden ? r : { ...r, split })))

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        id: newRowId(),
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

  const copy = async () => {
    if (!visibleRows.length) {
      void message.warning('Không có dòng nào để copy')
      return
    }
    const tsv = buildTsv(visibleRows, {
      columns: copyColumns,
      header: copyHeader,
      totalRow: copyTotal,
      decimal,
    })
    try {
      await navigator.clipboard.writeText(tsv)
      void message.success(
        `Đã copy ${visibleRows.length} dòng — dán vào Excel / Google Sheets`,
      )
    } catch {
      void message.error('Không copy được (trình duyệt chặn clipboard)')
    }
  }

  const columns: ColumnsType<BillRow> = [
    {
      title: '#',
      width: 44,
      align: 'center',
      render: (_, __, i) => <Text type="secondary">{i + 1}</Text>,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      render: (_, row) => (
        <Input
          size="small"
          variant="borderless"
          value={row.name}
          placeholder="Tên sản phẩm"
          onChange={(e) => update(row.id, { name: e.target.value })}
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
          onChange={(quantity) => updateAndRecalc(row, { quantity })}
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
            onChange={(unitPrice) => updateAndRecalc(row, { unitPrice })}
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
          onChange={(amount) => update(row.id, { amount })}
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
          onChange={(v) => update(row.id, { split: v as SplitBy })}
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
            onClick={() => update(row.id, { hidden: !row.hidden })}
          />
        </Tooltip>
      ),
    },
  ]

  return (
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

      <Card
        size="small"
        title={`Sản phẩm (${visibleRows.length}/${rows.length})`}
        extra={
          <Space wrap>
            <Text type="secondary">Chia tất cả:</Text>
            <Segmented
              size="small"
              options={SPLIT_OPTIONS}
              onChange={(v) => setSplitAll(v as SplitBy)}
            />
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
          </Space>
        }
      >
        <Table<BillRow>
          rowKey="id"
          size="small"
          pagination={false}
          columns={columns}
          dataSource={tableRows}
          scroll={{ x: 900 }}
          onRow={(row) => ({
            style: row.hidden
              ? { opacity: 0.4, textDecoration: 'line-through' }
              : undefined,
          })}
          locale={{ emptyText: 'Dán JSON ở trên để bắt đầu' }}
          summary={() =>
            rows.length ? (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <Button
                    size="small"
                    type="dashed"
                    icon={<Plus size={14} />}
                    onClick={addRow}
                  >
                    Thêm dòng
                  </Button>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <Text strong>{formatMoney(totalAmount)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6} align="right">
                  <Text strong>{formatMoney(totalShare)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} />
              </Table.Summary.Row>
            ) : null
          }
        />
      </Card>

      <Card size="small" title="Copy sang Excel">
        <Flex vertical gap={12}>
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
              onClick={copy}
            >
              Copy {visibleRows.length} dòng
            </Button>
          </Space>
        </Flex>
      </Card>
    </Flex>
  )
}

export default BillToExcelPage
