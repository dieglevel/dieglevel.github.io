import { useMemo } from 'react'
import { MoveRight } from 'lucide-react'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import type { IWallet_WalletTransfer } from '@/shared/api/financial/wallet-transfer/wallet-transfer.type'
import type { ColumnsType } from 'antd/es/table'
import { useGetWallet_WalletTransfer_List } from '@/shared/api/financial/wallet-transfer/useGetFinancial_WalletTransfer_List'
import BaseModal from '@/shared/components/modal'
import Table from '@/shared/components/table'
import { convertCurrency } from '@/shared/utils/helper/format-money'

interface TransferHistoryProps {
  open: boolean
  onClose: () => void
  selectedMonth: dayjs.Dayjs | string | Date
}

export default function TransferHistory({
  open,
  onClose,
  selectedMonth,
}: TransferHistoryProps) {
  const { data, isFetching } = useGetWallet_WalletTransfer_List({
    queryParams: {
      date: dayjs(selectedMonth).format('YYYY-MM-DD'),
    },
  })

  const columns: ColumnsType<IWallet_WalletTransfer> = useMemo(() => {
    const cols: ColumnsType<IWallet_WalletTransfer> = [
      {
        title: '',
        dataIndex: ['index'],
        key: 'index',
        render(value, record, index) {
          return index + 1
        },
        width: 90,
      },
      {
        title: 'From Wallet',
        dataIndex: ['fromWallet', 'name'],
        key: 'fromWallet',
      },
      {
        title: '',
        dataIndex: ['iconTransfer'],
        key: 'iconTransfer',
        render: () => <MoveRight />,
        width: 50,
      },
      {
        title: 'To Wallet',
        dataIndex: ['toWallet', 'name'],
        key: 'toWallet',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render(value) {
          return convertCurrency(value)
        },
      },
      {
        title: 'Transfer Fee',
        dataIndex: 'transferFee',
        key: 'transferFee',
        render(value) {
          return convertCurrency(value)
        },
      },
    ]
    return cols
  }, []) // Đã tối ưu dependency array từ [data] về [] vì các cột này là tĩnh

  // Tính toán tổng số lượng và tổng phí dựa trên data nhận về
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
    >
      <Table<IWallet_WalletTransfer>
        dataSource={data?.data}
        columns={columns}
        styles={{
          body: {
            cell: {
              height: 40,
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        }}
        loading={isFetching}
        summary={() => {
          // Tránh hiển thị dòng summary khi không có dữ liệu
          if (!data?.data || data.data.length === 0) return null

          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="bg-gray-50 font-semibold">
                <Table.Summary.Cell index={0}>
                  <Typography
                    style={{
                      fontSize: 24,
                      fontWeight: 'bolder',
                    }}
                  >
                    Total
                  </Typography>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={1} />

                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} />

                <Table.Summary.Cell index={4}>
                  <Typography
                    style={{
                      fontSize: 24,
                      fontWeight: 'bolder',
                      color: 'green',
                    }}
                  >
                    {convertCurrency(totalAmount)}
                  </Typography>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={5}>
                  <Typography
                    style={{
                      fontSize: 24,
                      fontWeight: 'bolder',
                      color: 'red',
                    }}
                  >
                    {convertCurrency(totalFee)}
                  </Typography>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </BaseModal>
  )
}
