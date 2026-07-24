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
        title: '#',
        dataIndex: ['index'],
        key: 'index',
        render(_value, _record, index) {
          return index + 1
        },
        fixed: 'left',
      },
      {
        title: 'From Wallet',
        dataIndex: ['fromWallet', 'name'],
        key: 'fromWallet',
        fixed: 'left',
      },
      {
        title: '',
        dataIndex: ['iconTransfer'],
        key: 'iconTransfer',
        render: () => <MoveRight size={16} />,
        align: 'center',
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
      width="100%"
      style={{ maxWidth: 800, top: 20 }}
    >
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table<IWallet_WalletTransfer>
          dataSource={data?.data}
          columns={columns}
          rowKey={(record) => record.id}
          scroll={{ x: 600, y: 400 }}
          styles={{
            body: {
              cell: {
                height: 40,
                paddingTop: 4,
                paddingBottom: 4,
              },
            },
          }}
          loading={isFetching}
          summary={() => {
            if (!data?.data || data.data.length === 0) return null

            return (
              <Table.Summary fixed>
                <Table.Summary.Row className="bg-gray-50 font-semibold">
                  <Table.Summary.Cell index={0}>
                    <Typography.Text
                      style={{
                        fontSize: 'clamp(13px, 3.5vw, 15px)',
                        fontWeight: 'bold',
                      }}
                    >
                      Total
                    </Typography.Text>
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={1} />
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3} />

                  <Table.Summary.Cell index={4}>
                    <Typography.Text
                      style={{
                        fontSize: 'clamp(13px, 3.5vw, 15px)',
                        fontWeight: 'bold',
                        color: 'green',
                      }}
                    >
                      {convertCurrency(totalAmount)}
                    </Typography.Text>
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={5}>
                    <Typography.Text
                      style={{
                        fontSize: 'clamp(13px, 3.5vw, 15px)',
                        fontWeight: 'bold',
                        color: 'red',
                      }}
                    >
                      {convertCurrency(totalFee)}
                    </Typography.Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      </div>
    </BaseModal>
  )
}
