import { useMemo, useState } from 'react'
import { MoveRight } from 'lucide-react'
import { DatePicker, Typography } from 'antd'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import type { IFinance_WalletTransfer } from '@/shared/api/financial/wallet/wallet-transfer/wallet-transfer.type'
import BaseModal from '@/shared/components/modal'
import Table from '@/shared/components/table'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { useGetWallet_WalletTransfer_Date } from '@/shared/api/financial/wallet/wallet-transfer/useGetFinancial_WalletTransfer_Date'

interface TransferHistoryProps {
  open: boolean
  onClose: () => void
}

export default function TransferHistory({
  open,
  onClose,
}: TransferHistoryProps) {
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs())

  const { data, isFetching } = useGetWallet_WalletTransfer_Date({})

  const columns: ColumnsType<IFinance_WalletTransfer> = useMemo(() => {
    const cols: ColumnsType<IFinance_WalletTransfer> = [
      {
        title: '#',
        dataIndex: ['index'],
        key: 'index',
        width: 50,
        align: 'center',
        render(_value, _record, index) {
          return index + 1
        },
      },
      {
        title: 'From Wallet',
        dataIndex: ['fromWallet', 'name'],
        key: 'fromWallet',
        width: 140,
        ellipsis: true,
      },
      {
        title: '',
        dataIndex: ['iconTransfer'],
        key: 'iconTransfer',
        width: 40,
        align: 'center',
        render: () => (
          <MoveRight size={16} className="shrink-0 text-gray-400" />
        ),
      },
      {
        title: 'To Wallet',
        dataIndex: ['toWallet', 'name'],
        key: 'toWallet',
        width: 140,
        ellipsis: true,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 130,
        align: 'right',
        render(value) {
          return convertCurrency(value)
        },
      },
      {
        title: 'Transfer Fee',
        dataIndex: 'transferFee',
        key: 'transferFee',
        width: 120,
        align: 'right',
        render(value) {
          return convertCurrency(value)
        },
      },
    ]
    return cols
  }, [])

  const { totalAmount, totalFee } = useMemo(() => {
    const list = data?.data || []
    let totalAmount = 0
    let totalFee = 0

    list.forEach((item) => {
      totalAmount += Number(item.amount || 0)
      totalFee += Number(item.transferFee || 0)
    })

    return { totalAmount, totalFee }
  }, [data?.data])

  return (
    <BaseModal
      title="Transfer History"
      open={open}
      onClose={onClose}
      showButtonOk={false}
      showButtonCancel={true}
      width={768}
      style={{ top: 20 }}
    >
      <DatePicker
        style={{ width: '100%', maxWidth: '200px' }}
        picker="month"
        value={selectedMonth}
        onChange={(date) => {
          setSelectedMonth(date ?? dayjs())
        }}
      />
      <Table<IFinance_WalletTransfer>
        dataSource={data?.data || []}
        columns={columns}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content', y: 360 }}
        size="small"
        style={{
          marginTop: 8,
        }}
        styles={{
          body: {
            cell: {
              height: 40,
              paddingTop: 6,
              paddingBottom: 6,
            },
          },
        }}
        loading={isFetching}
        summary={() => {
          if (!data?.data || data.data.length === 0) return null

          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="bg-gray-50 font-semibold">
                <Table.Summary.Cell index={0} colSpan={4}>
                  <Typography.Text className="text-sm font-bold">
                    Total
                  </Typography.Text>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={1} align="right">
                  <Typography.Text className="text-sm font-bold text-green-600">
                    {convertCurrency(totalAmount)}
                  </Typography.Text>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={2} align="right">
                  <Typography.Text className="text-sm font-bold text-red-500">
                    {convertCurrency(totalFee)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </BaseModal>
  )
}
