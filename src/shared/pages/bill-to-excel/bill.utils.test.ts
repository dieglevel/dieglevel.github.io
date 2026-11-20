import { describe, expect, it } from 'vitest'
import {
  MAIN_GROUP_ID,
  buildGroupsTsv,
  buildTsv,
  evaluateExpression,
  parseBillJson,
} from './bill.utils'

describe('evaluateExpression', () => {
  it('tính biểu thức thường', () => {
    expect(evaluateExpression('145000/3', 0)).toBeCloseTo(48333.333)
    expect(evaluateExpression('(10+5)*2', 0)).toBe(30)
    expect(evaluateExpression('145.000', 0)).toBe(145000)
    expect(evaluateExpression('0,198', 0)).toBe(0.198)
    expect(evaluateExpression('1.5', 0)).toBe(1.5)
  })
  it('áp toán tử lên giá trị hiện tại', () => {
    expect(evaluateExpression('/2', 1000)).toBe(500)
    expect(evaluateExpression('*3', 1.234)).toBeCloseTo(3.702)
    expect(evaluateExpression('-5000', 20000)).toBe(15000)
  })
  it('trả null khi không hợp lệ', () => {
    expect(evaluateExpression('abc', 1)).toBeNull()
    expect(evaluateExpression('2+', 1)).toBeNull()
    expect(evaluateExpression('', 1)).toBeNull()
  })
})

describe('parseBillJson', () => {
  const sample = JSON.stringify({
    success: true,
    data: {
      customerDemandId: 'OV1',
      cartTotalAmount: 145946,
      cartDebtAmount: 145000,
      listDiscount: [{ paymentName: 'Điểm sử dụng', amount: 946 }],
      deliveryList: [
        {
          outputStoreName: 'BHX',
          deliveryDetailList: [
            { productName: 'Túi', quantity: 1, price: 300, salePrice: 0 },
            {
              productName: 'Hành tây',
              quantity: 0.198,
              price: 37500,
              salePrice: 18750,
              quantityUnitValue: '0.198kg',
            },
          ],
        },
      ],
    },
  })

  it('đọc sản phẩm và thông tin hoá đơn', () => {
    const { rows, info } = parseBillJson(sample)
    expect(rows).toHaveLength(2)
    expect(rows[0].amount).toBe(0)
    expect(rows[1].amount).toBeCloseTo(3712.5)
    expect(rows[1].unit).toBe('kg')
    expect(rows.every((r) => r.groupId === MAIN_GROUP_ID)).toBe(true)
    expect(info).toMatchObject({
      orderId: 'OV1',
      paid: 145000,
      storeName: 'BHX',
    })
    expect(info.discounts[0].amount).toBe(946)
  })

  it('tạo TSV', () => {
    const { rows } = parseBillJson(sample)
    rows[1].split = 2
    const tsv = buildTsv(rows, {
      columns: ['name', 'quantity', 'amount', 'share'],
      header: true,
      totalRow: true,
      decimal: ',',
    })
    expect(tsv.split('\n')).toEqual([
      'Sản phẩm\tSL\tThành tiền\tPhần chia',
      'Túi\t1\t0\t0',
      'Hành tây\t0,198\t3713\t1856',
      'Tổng\t\t3713\t1856',
    ])
  })

  it('copy nhiều bảng, bỏ bảng rỗng', () => {
    const { rows } = parseBillJson(sample)
    const tsv = buildGroupsTsv(
      [
        { name: 'Chung', rows: [rows[0]] },
        { name: 'Rỗng', rows: [] },
        { name: 'Bảng 2', rows: [rows[1]] },
      ],
      {
        columns: ['name', 'amount'],
        header: false,
        totalRow: false,
        decimal: ',',
      },
    )
    expect(tsv).toBe('Chung\nTúi\t0\n\nBảng 2\nHành tây\t3713')
  })
})
