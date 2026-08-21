import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  History,
  Pencil,
  Plus,
  Receipt,
  Trash2,
  XCircle,
} from 'lucide-react'
import dayjs from 'dayjs'

import type { IFinance_Debt } from '@/shared/api/financial/debt/debt.type'
import { useMutationFinanceDebt } from '@/shared/api/financial/debt/useMutationDebt'
import { useGetFinance_Debt_List } from '@/shared/api/financial/debt/useGetDebtList'
import { useGetFinance_Debt_Histories } from '@/shared/api/financial/debt/useGetDebtHistories'
import {
  FINANCIAL_DEBT_DIRECTION_ENUM,
  FINANCIAL_DEBT_STATUS_ENUM,
  FINANCIAL_DEBT_TYPE_ENUM,
  FinancialDebtDirectionHelper,
  FinancialDebtStatusHelper,
} from '@/shared/api/financial/debt/debt.enum'

export const DebtManagementPage: React.FC = () => {
  // Queries & Mutations
  const { data: debtListResponse, isLoading } = useGetFinance_Debt_List()
  const debts = debtListResponse?.data || []

  const {
    mDebt_Create,
    mDebt_Delete,
    mDebt_Payment,
    mDebt_Adjust,
    mDebt_Settle,
    mDebt_Cancel,
  } = useMutationFinanceDebt()

  // Local States
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [selectedDebt, setSelectedDebt] = useState<IFinance_Debt | null>(null)

  // Modals visibility
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Forms
  const [formCreate] = Form.useForm()
  const [formPayment] = Form.useForm()
  const [formAdjust] = Form.useForm()

  // Statistics calculation
  const totalLent = debts
    .filter((d) => d.direction === FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING)
    .reduce((sum, item) => sum + Number(item.outstandingAmount || 0), 0)

  const totalBorrowed = debts
    .filter((d) => d.direction === FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING)
    .reduce((sum, item) => sum + Number(item.outstandingAmount || 0), 0)

  // Handlers
  const handleCreate = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate
        ? values.startDate.toISOString()
        : new Date().toISOString(),
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      status: FINANCIAL_DEBT_STATUS_ENUM.ACTIVE,
    }
    await mDebt_Create.mutateAsync({ body: payload })
    setIsCreateOpen(false)
    formCreate.resetFields()
  }

  const handlePayment = async (values: any) => {
    if (!selectedDebt) return
    await mDebt_Payment.mutateAsync({
      pathParams: { id: String(selectedDebt.id) },
      body: values,
    })
    setIsPaymentOpen(false)
    formPayment.resetFields()
  }

  const handleAdjust = async (values: any) => {
    if (!selectedDebt) return
    await mDebt_Adjust.mutateAsync({
      pathParams: { id: String(selectedDebt.id) },
      body: values,
    })
    setIsAdjustOpen(false)
    formAdjust.resetFields()
  }

  const handleSettle = async (id: number) => {
    await mDebt_Settle.mutateAsync({
      pathParams: { id: String(id) },
      body: { note: 'Tất toán khoản nợ' },
    })
  }

  const handleCancel = async (id: number) => {
    await mDebt_Cancel.mutateAsync({
      pathParams: { id: String(id) },
      body: { note: 'Hủy khoản nợ' },
    })
  }

  const handleDelete = async (id: number) => {
    await mDebt_Delete.mutateAsync({
      pathParams: { id: String(id) },
    })
  }

  // Filtered List
  const filteredDebts = debts.filter((item) => {
    if (activeTab === 'ALL') return true
    return item.direction === activeTab
  })

  const columns = [
    {
      title: 'Tên khoản nợ / Đối tác',
      key: 'nameInfo',
      render: (_: any, record: IFinance_Debt) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            Đối tác: {record.namePerson}
          </div>
        </div>
      ),
    },
    {
      title: 'Phân loại',
      key: 'category',
      render: (_: any, record: IFinance_Debt) => (
        <Space direction="vertical" size={2}>
          <Tag color={FinancialDebtDirectionHelper.getColor(record.direction)}>
            {FinancialDebtDirectionHelper.getLabel(record.direction)}
          </Tag>
          <Tag style={{ fontSize: 11 }}>{record.type}</Tag>
        </Space>
      ),
    },
    {
      title: 'Số tiền gốc',
      dataIndex: 'originalAmount',
      key: 'originalAmount',
      render: (val: number) => `${Number(val || 0).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Còn lại',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      render: (val: number) => (
        <span style={{ fontWeight: 'bold', color: '#cf1322' }}>
          {Number(val || 0).toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Thời hạn',
      key: 'dates',
      render: (_: any, record: IFinance_Debt) => (
        <div style={{ fontSize: 12 }}>
          <div>Bắt đầu: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
          {record.dueDate && (
            <div
              style={{
                color: dayjs().isAfter(dayjs(record.dueDate))
                  ? '#ff4d4f'
                  : '#8c8c8c',
              }}
            >
              Hạn trả: {dayjs(record.dueDate).format('DD/MM/YYYY')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: FINANCIAL_DEBT_STATUS_ENUM) => (
        <Tag color={FinancialDebtStatusHelper.getColor(status)}>
          {FinancialDebtStatusHelper.getLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: IFinance_Debt) => {
        const isActive = record.status === FINANCIAL_DEBT_STATUS_ENUM.ACTIVE
        return (
          <Space size="small">
            {isActive && (
              <>
                <Tooltip title="Thanh toán / Thu nợ">
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<Receipt size={14} />}
                    onClick={() => {
                      setSelectedDebt(record)
                      setIsPaymentOpen(true)
                    }}
                  />
                </Tooltip>
                <Tooltip title="Điều chỉnh dư nợ">
                  <Button
                    size="small"
                    icon={<Pencil size={14} />}
                    onClick={() => {
                      setSelectedDebt(record)
                      formAdjust.setFieldsValue({
                        outstandingAmount: record.outstandingAmount,
                      })
                      setIsAdjustOpen(true)
                    }}
                  />
                </Tooltip>
                <Tooltip title="Tất toán">
                  <Popconfirm
                    title="Xác nhận tất toán khoản nợ này?"
                    onConfirm={() => handleSettle(record.id)}
                  >
                    <Button
                      size="small"
                      icon={<CheckCircle2 size={14} />}
                      style={{ color: '#52c41a' }}
                    />
                  </Popconfirm>
                </Tooltip>
                <Tooltip title="Hủy bỏ">
                  <Popconfirm
                    title="Xác nhận hủy khoản nợ?"
                    onConfirm={() => handleCancel(record.id)}
                  >
                    <Button size="small" danger icon={<XCircle size={14} />} />
                  </Popconfirm>
                </Tooltip>
              </>
            )}
            <Tooltip title="Xem lịch sử">
              <Button
                size="small"
                icon={<History size={14} />}
                onClick={() => {
                  setSelectedDebt(record)
                  setIsHistoryOpen(true)
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa khoản nợ này?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                size="small"
                type="text"
                danger
                icon={<Trash2 size={14} />}
              />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="Cho vay (Cần thu về)"
              value={totalLent}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
              prefix={<ArrowUpRight size={20} style={{ marginRight: 4 }} />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="Đi vay (Cần trả)"
              value={totalBorrowed}
              precision={0}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
              prefix={<ArrowDownLeft size={20} style={{ marginRight: 4 }} />}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng danh sách sổ nợ */}
      <Card
        title="Quản lý Sổ Nợ"
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateOpen(true)}
          >
            Tạo khoản nợ mới
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'ALL', label: 'Tất cả' },
            { key: FINANCIAL_DEBT_DIRECTION_ENUM.OUTGOING, label: 'Cho vay' },
            { key: FINANCIAL_DEBT_DIRECTION_ENUM.INCOMING, label: 'Đi vay' },
          ]}
        />
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={filteredDebts}
        />
      </Card>

      {/* Modal 1: Tạo khoản nợ mới */}
      <Modal
        title="Tạo khoản nợ mới"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={() => formCreate.submit()}
        destroyOnClose
      >
        <Form
          form={formCreate}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            startDate: dayjs(),
          }}
        >
          <Form.Item
            name="name"
            label="Tên khoản nợ"
            rules={[{ required: true, message: 'Vui lòng nhập tên khoản nợ' }]}
          >
            <Input placeholder="Ví dụ: Vay mua xe, Cho Nam mượn tiền..." />
          </Form.Item>

          <Form.Item
            name="namePerson"
            label="Tên đối tác / Người liên quan"
            rules={[{ required: true, message: 'Vui lòng nhập tên đối tác' }]}
          >
            <Input placeholder="Nhập tên người vay / người cho vay" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="direction"
                label="Chiều nợ"
                rules={[{ required: true }]}
              >
                <Select
                  options={FinancialDebtDirectionHelper.getOptions()}
                  placeholder="Chọn chiều nợ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại nợ"
                rules={[{ required: true, message: 'Vui lòng chọn loại nợ' }]}
              >
                <Select
                  placeholder="Chọn phân loại"
                  options={Object.values(FINANCIAL_DEBT_TYPE_ENUM).map(
                    (val) => ({
                      label: val,
                      value: val,
                    }),
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="originalAmount"
                label="Số tiền ban đầu"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="outstandingAmount"
                label="Số tiền nợ ban đầu"
                rules={[
                  { required: true, message: 'Vui lòng nhập số tiền nợ' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueDate" label="Hạn trả">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả / Ghi chú">
            <Input.TextArea
              rows={3}
              placeholder="Ghi chú chi tiết khoản nợ..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal 2: Thanh toán / Thu nợ */}
      <Modal
        title={`Thanh toán nợ: ${selectedDebt?.name || ''}`}
        open={isPaymentOpen}
        onCancel={() => setIsPaymentOpen(false)}
        onOk={() => formPayment.submit()}
        destroyOnClose
      >
        <Form form={formPayment} layout="vertical" onFinish={handlePayment}>
          <Form.Item
            name="walletId"
            label="Chọn ví giao dịch"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Nhập ID Ví" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Số tiền thanh toán"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              max={selectedDebt?.outstandingAmount}
              min={1}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal 3: Điều chỉnh số tiền nợ */}
      <Modal
        title={`Điều chỉnh dư nợ: ${selectedDebt?.name || ''}`}
        open={isAdjustOpen}
        onCancel={() => setIsAdjustOpen(false)}
        onOk={() => formAdjust.submit()}
        destroyOnClose
      >
        <Form form={formAdjust} layout="vertical" onFinish={handleAdjust}>
          <Form.Item
            name="outstandingAmount"
            label="Số nợ mới"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item name="note" label="Lý do điều chỉnh">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal 4: Lịch sử nợ */}
      {selectedDebt && (
        <DebtHistoryModal
          debtId={selectedDebt.id}
          open={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  )
}

// Sub-component: Modal xem lịch sử biến động khoản nợ
const DebtHistoryModal: React.FC<{
  debtId: number
  open: boolean
  onClose: () => void
}> = ({ debtId, open, onClose }) => {
  const { data: historiesResponse, isLoading } = useGetFinance_Debt_Histories({
    id: debtId,
  })
  const histories = historiesResponse?.data || []

  return (
    <Modal
      title="Lịch sử biến động khoản nợ"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={histories}
        pagination={{ pageSize: 5 }}
        columns={[
          { title: 'Loại', dataIndex: 'type', key: 'type' },
          {
            title: 'Số tiền tác động',
            dataIndex: 'amount',
            key: 'amount',
            render: (v) => `${Number(v || 0).toLocaleString('vi-VN')} ₫`,
          },
          {
            title: 'Dư nợ còn lại',
            dataIndex: 'outstandingAmount',
            key: 'outstandingAmount',
            render: (v) => `${Number(v || 0).toLocaleString('vi-VN')} ₫`,
          },
          { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        ]}
      />
    </Modal>
  )
}
