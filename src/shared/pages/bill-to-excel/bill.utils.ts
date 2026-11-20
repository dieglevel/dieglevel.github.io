export type SplitBy = 1 | 2 | 3

export interface BillRow {
  id: string
  name: string
  quantity: number
  /** Đơn vị hiển thị cạnh SL, vd "kg" */
  unit: string
  /** Giá niêm yết (trước giảm) */
  listPrice: number
  /** Đơn giá thực tính */
  unitPrice: number
  amount: number
  split: SplitBy
  hidden: boolean
}

export interface BillInfo {
  orderId?: string
  storeName?: string
  date?: string
  total?: number
  saved?: number
  paid?: number
  discounts: Array<{ name: string; amount: number }>
}

export interface ParsedBill {
  rows: Array<BillRow>
  info: BillInfo
}

type AnyRecord = Record<string, unknown>

const isRecord = (v: unknown): v is AnyRecord =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const num = (v: unknown): number | undefined => {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(+v)) return +v
  return undefined
}

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() !== '' ? v : undefined

let idSeq = 0
export const newRowId = () => `row-${Date.now().toString(36)}-${idSeq++}`

/** Tìm mảng sản phẩm (object có productName) ở bất kỳ độ sâu nào */
function findItemArrays(node: unknown, out: Array<Array<AnyRecord>>) {
  if (Array.isArray(node)) {
    if (node.length && node.every((x) => isRecord(x) && 'productName' in x)) {
      out.push(node as Array<AnyRecord>)
      return
    }
    node.forEach((x) => findItemArrays(x, out))
  } else if (isRecord(node)) {
    Object.values(node).forEach((x) => findItemArrays(x, out))
  }
}

function toRow(item: AnyRecord): BillRow {
  const quantity = num(item.quantity) ?? 1
  const listPrice = num(item.price) ?? num(item.retailPrice) ?? 0
  // salePrice = 0 nghĩa là sản phẩm miễn phí (vd túi BHX) — khớp với totalAmount
  const unitPrice = num(item.salePrice) ?? listPrice
  const unitMatch = str(item.quantityUnitValue)?.match(/[a-zA-Z]+$/)

  return {
    id: newRowId(),
    name: str(item.productName) ?? '',
    quantity,
    unit: unitMatch?.[0] ?? '',
    listPrice,
    unitPrice,
    amount: quantity * unitPrice,
    split: 1,
    hidden: false,
  }
}

export function parseBillJson(text: string): ParsedBill {
  const root: unknown = JSON.parse(text)
  const data = isRecord(root) && isRecord(root.data) ? root.data : root

  const arrays: Array<Array<AnyRecord>> = []
  findItemArrays(data, arrays)
  if (!arrays.length) {
    throw new Error('Không tìm thấy danh sách sản phẩm (trường productName).')
  }

  const rows = arrays.flat().map(toRow)

  const info: BillInfo = { discounts: [] }
  if (isRecord(data)) {
    info.orderId = str(data.customerDemandId) ?? str(data.customerDemand)
    info.date = str(data.inputDate) ?? str(data.inputTime)
    info.total = num(data.cartTotalAmount) ?? num(data.totalAmount)
    info.saved = num(data.totalSavedAmount)
    info.paid = num(data.cartDebtAmount) ?? num(data.debt)
    const delivery = Array.isArray(data.deliveryList)
      ? data.deliveryList.find(isRecord)
      : undefined
    info.storeName = delivery ? str(delivery.outputStoreName) : undefined
    if (Array.isArray(data.listDiscount)) {
      info.discounts = data.listDiscount.filter(isRecord).map((d) => ({
        name: str(d.paymentName) ?? 'Giảm',
        amount: num(d.amount) ?? 0,
      }))
    }
  }

  return { rows, info }
}

// ---------- Biểu thức trong ô số ----------

/** "145.000" → 145000, "0,198" → 0.198, "1.5" → 1.5 */
function normalizeNumberToken(token: string) {
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(token)) {
    return token.replace(/\./g, '').replace(',', '.')
  }
  return token.replace(',', '.')
}

const CURRENT = '#current'

/**
 * Tính biểu thức + - * / ( ). Nếu bắt đầu bằng toán tử (vd "/2", "*3", "-5000")
 * thì áp lên `current`. Trả về null nếu không hợp lệ.
 */
export function evaluateExpression(input: string, current: number) {
  const src = input
    .replace(/\s+/g, '')
    .replace(/[x×]/gi, '*')
    .replace(/÷/g, '/')
  if (!src) return null

  const tokens = src.match(/\d[\d.,]*|[+\-*/()]/g)
  if (!tokens || tokens.join('') !== src) return null
  // Bắt đầu bằng toán tử → áp lên giá trị hiện tại ("/2", "*3", "-5000")
  if (/^[+\-*/]/.test(src)) tokens.unshift(CURRENT)

  let pos = 0
  const peek = (): string | undefined => tokens[pos]
  const next = (): string | undefined => tokens[pos++]

  const parseFactor = (): number => {
    const t = next()
    if (t === '(') {
      const v = parseSum()
      if (next() !== ')') throw new Error('paren')
      return v
    }
    if (t === CURRENT) return current
    if (t === '-') return -parseFactor()
    if (t === '+') return parseFactor()
    if (t === undefined || !/^\d/.test(t)) throw new Error('token')
    const v = Number(normalizeNumberToken(t))
    if (!Number.isFinite(v)) throw new Error('nan')
    return v
  }
  const parseProduct = (): number => {
    let v = parseFactor()
    while (peek() === '*' || peek() === '/') {
      const op = next()
      const r = parseFactor()
      v = op === '*' ? v * r : v / r
    }
    return v
  }
  function parseSum(): number {
    let v = parseProduct()
    while (peek() === '+' || peek() === '-') {
      const op = next()
      const r = parseProduct()
      v = op === '+' ? v + r : v - r
    }
    return v
  }

  try {
    const v = parseSum()
    return pos === tokens.length && Number.isFinite(v) ? v : null
  } catch {
    return null
  }
}

// ---------- Định dạng / copy ----------

const moneyFmt = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const qtyFmt = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 3 })

export const formatMoney = (v: number) => moneyFmt.format(v)
export const formatQty = (v: number) => qtyFmt.format(v)

export const share = (row: BillRow) => row.amount / row.split

export type CopyColumn =
  | 'name'
  | 'quantity'
  | 'unitPrice'
  | 'amount'
  | 'split'
  | 'share'

export const COPY_COLUMNS: Array<{ value: CopyColumn; label: string }> = [
  { value: 'name', label: 'Sản phẩm' },
  { value: 'quantity', label: 'SL' },
  { value: 'unitPrice', label: 'Đơn giá' },
  { value: 'amount', label: 'Thành tiền' },
  { value: 'split', label: 'Chia' },
  { value: 'share', label: 'Phần chia' },
]

export interface CopyOptions {
  columns: Array<CopyColumn>
  header: boolean
  totalRow: boolean
  decimal: '.' | ','
}

/** Tạo TSV để dán vào Excel / Google Sheets. Tiền làm tròn tới đồng. */
export function buildTsv(rows: Array<BillRow>, opt: CopyOptions) {
  const cols = COPY_COLUMNS.filter((c) => opt.columns.includes(c.value))
  const dec = (v: number, digits: number) => {
    const s = String(Number(v.toFixed(digits)))
    return opt.decimal === ',' ? s.replace('.', ',') : s
  }
  const clean = (s: string) => s.replace(/[\t\r\n]+/g, ' ')

  const cell = (row: BillRow, col: CopyColumn) => {
    switch (col) {
      case 'name':
        return clean(row.name)
      case 'quantity':
        return dec(row.quantity, 3)
      case 'unitPrice':
        return dec(row.unitPrice, 0)
      case 'amount':
        return dec(row.amount, 0)
      case 'split':
        return String(row.split)
      case 'share':
        return dec(share(row), 0)
    }
  }

  const lines: Array<string> = []
  if (opt.header) lines.push(cols.map((c) => c.label).join('\t'))
  rows.forEach((r) => lines.push(cols.map((c) => cell(r, c.value)).join('\t')))

  if (opt.totalRow) {
    const total = cols.map((c, i) => {
      if (c.value === 'amount')
        return dec(
          rows.reduce((s, r) => s + r.amount, 0),
          0,
        )
      if (c.value === 'share')
        return dec(
          rows.reduce((s, r) => s + share(r), 0),
          0,
        )
      return i === 0 ? 'Tổng' : ''
    })
    lines.push(total.join('\t'))
  }

  return lines.join('\n')
}
