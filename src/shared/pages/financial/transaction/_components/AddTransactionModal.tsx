import React from 'react'
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Select,
  Upload,
} from 'antd'
import { PaperClipOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import Text from 'antd/es/typography/Text'
import { useGetWallet_Wallet_List } from '@/shared/api/financial/wallet/useGetFinancial_Wallet_List'
import { useGetWallet_Category_List } from '@/shared/api/financial/category/useGetWallet_Category_List'
import { useMutationTransaction } from '@/shared/api/financial/transaction/transaction.mutation'
import {
  FINANCIAL_TRANSACTION_STATUS,
  FINANCIAL_TRANSACTION_TYPE,
} from '@/shared/api/financial/transaction/transaction.enum'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
}) => {
  const { mTransaction_Create, mTransaction_Update } = useMutationTransaction()

  const [form] = Form.useForm()
  const { data: wallets } = useGetWallet_Wallet_List({})
  const { data: categories } = useGetWallet_Category_List({})

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await mTransaction_Create.mutateAsync(values)

      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title="Add Transaction"
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save Transaction"
      cancelText="Cancel"
      destroyOnClose
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'expense',
          walletId: wallets?.data[0]?.id,
          categoryId: categories?.data[0]?.id,
          date: dayjs(),
          status: 'completed',
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="type">
          <Segmented
            block
            options={[
              {
                label: 'Expense',
                value: FINANCIAL_TRANSACTION_TYPE.EXPENSE,
              },
              { label: 'Income', value: FINANCIAL_TRANSACTION_TYPE.INCOME },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Wallet"
          name="walletId"
          rules={[{ required: true, message: 'Please select a wallet' }]}
        >
          <Select
            options={wallets?.data.map((w) => ({
              value: w.id,
              label: (
                <Flex align="center" gap={8}>
                  <IconRenderer iconName={w.icon} />
                  <Text style={{ fontSize: 13 }}>{w.name}</Text>
                </Flex>
              ),
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            options={categories?.data.map((c) => ({
              value: c.id,
              label: `${c.icon} ${c.name}`,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input placeholder="What was this for?" />
        </Form.Item>

        <Form.Item
          label="Amount ($)"
          name="amount"
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            precision={2}
            placeholder="0.00"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              {
                value: FINANCIAL_TRANSACTION_STATUS.COMPLETED,
                label: '✅ Completed',
              },
              { value: 'pending', label: '⏳ Pending' },
              { value: 'failed', label: '❌ Failed' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Note (optional)" name="note">
          <Input.TextArea rows={2} placeholder="Add a note…" />
        </Form.Item>

        <Form.Item>
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<PaperClipOutlined />} block>
              Attach Receipt
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
