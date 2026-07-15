import React, { useEffect, useState } from 'react'
import { ArrowLeftRight, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  theme,
} from 'antd'
import type { Wallet } from '../App'

const { Title, Text } = Typography

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Math.abs(n),
  )

const TYPE_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Account' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'ewallet', label: 'E-Wallet' },
]

const COLORS = [
  '#5b5fef',
  '#10b981',
  '#f59e0b',
  '#e11d48',
  '#8b5cf6',
  '#3b82f6',
  '#06b6d4',
  '#ec4899',
]

const EMPTY_WALLET: Omit<Wallet, 'id'> = {
  name: '',
  type: 'bank',
  balance: 0,
  currency: 'USD',
  color: '#5b5fef',
  icon: '🏦',
}

// ─── Wallet Card Component ──────────────────────────────────────────────────
function WalletCard({
  wallet,
  onEdit,
  onDelete,
}: {
  wallet: Wallet
  onEdit: () => void
  onDelete: () => void
}) {
  const [visible, setVisible] = useState(false)
  const isNegative = wallet.balance < 0

  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-md group"
      style={{
        background: `linear-gradient(135deg, ${wallet.color}e0, ${wallet.color}90)`,
        aspectRatio: '16/9',
        minHeight: 180,
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      />
      <div
        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-2xl">{wallet.icon}</span>
          <p className="text-sm font-semibold text-white mt-1 mb-0">
            {wallet.name}
          </p>
          <p className="text-xs text-white/70 mb-0">
            {TYPE_OPTIONS.find((o) => o.value === wallet.type)?.label}
          </p>
        </div>
        <Space size={4}>
          <Button
            type="text"
            size="small"
            icon={
              visible ? (
                <EyeOff size={14} color="white" />
              ) : (
                <Eye size={14} color="white" />
              )
            }
            onClick={() => setVisible(!visible)}
            className="hover:bg-white/20 text-white border-none flex items-center justify-center"
          />
          <Button
            type="text"
            size="small"
            icon={<Pencil size={14} color="white" />}
            onClick={onEdit}
            className="hover:bg-white/20 text-white border-none flex items-center justify-center"
          />
          <Button
            type="text"
            size="small"
            icon={<Trash2 size={14} color="white" />}
            onClick={onDelete}
            className="hover:bg-white/20 text-white border-none flex items-center justify-center"
          />
        </Space>
      </div>

      {/* Bottom row */}
      <div className="relative z-10">
        {wallet.lastFour && (
          <p className="text-xs text-white/60 mb-1 tracking-widest">
            ●●●● ●●●● ●●●● {wallet.lastFour}
          </p>
        )}
        <p
          className="text-2xl font-bold text-white mb-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {visible ? (isNegative ? '-' : '') + fmt(wallet.balance) : '●●●●●'}
        </p>
        <p className="text-xs text-white/60 mt-0.5 mb-0">{wallet.currency}</p>
      </div>
    </div>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export function Wallets() {
  const [wallets, setWallets] = useState<Array<Wallet>>([])
  const { modal } = App.useApp() // Hook từ Ant Design App component để mở confirm xóa nhanh
  const { token } = theme.useToken() // Lấy mã màu theme tự động của antd

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editTarget, setEditTarget] = useState<Wallet | null>(null)

  const [walletForm] = Form.useForm()
  const [transferForm] = Form.useForm()

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0)
  const totalAssets = wallets
    .filter((w) => w.balance > 0)
    .reduce((s, w) => s + w.balance, 0)
  const totalDebt = wallets
    .filter((w) => w.balance < 0)
    .reduce((s, w) => s + w.balance, 0)

  // Đồng bộ form khi ấn Edit
  useEffect(() => {
    if (modalMode === 'edit' && editTarget) {
      walletForm.setFieldsValue(editTarget)
    } else {
      walletForm.setFieldsValue(EMPTY_WALLET)
    }
  }, [modalMode, editTarget, walletForm])

  // Hành động với Wallet
  const handleWalletSave = () => {
    walletForm.validateFields().then((values) => {
      if (modalMode === 'add') {
        setWallets((prev) => [...prev, { ...values, id: `w${Date.now()}` }])
      } else if (modalMode === 'edit' && editTarget) {
        setWallets((prev) =>
          prev.map((w) => (w.id === editTarget.id ? { ...w, ...values } : w)),
        )
      }
      setIsWalletModalOpen(false)
    })
  }

  const handleDeleteWallet = (target: Wallet) => {
    modal.confirm({
      title: `Delete ${target.name}?`,
      content:
        'This action cannot be undone and will permanently delete this wallet.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        setWallets((prev) => prev.filter((w) => w.id !== target.id))
      },
    })
  }

  // Hành động Chuyển tiền
  const handleTransfer = () => {
    transferForm.validateFields().then((values) => {
      const { from, to, amount } = values
      const numAmount = parseFloat(amount)
      setWallets((prev) =>
        prev.map((w) => {
          if (w.id === from) return { ...w, balance: w.balance - numAmount }
          if (w.id === to) return { ...w, balance: w.balance + numAmount }
          return w
        }),
      )
      setIsTransferModalOpen(false)
      transferForm.resetFields()
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={3} className="!mb-0">
            Wallets
          </Title>
          <Text type="secondary">Manage your accounts & balances</Text>
        </div>
        <Space size="middle">
          <Button
            icon={<ArrowLeftRight size={15} />}
            onClick={() => setIsTransferModalOpen(true)}
            disabled={wallets.length < 2}
          >
            Transfer
          </Button>
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              background: 'linear-gradient(135deg,#5b5fef,#8b5cf6)',
              border: 'none',
            }}
            onClick={() => {
              setModalMode('add')
              setIsWalletModalOpen(true)
            }}
          >
            Add Wallet
          </Button>
        </Space>
      </div>

      {/* Summary Stats Cards */}
      <Row gutter={[16, 16]}>
        {[
          {
            label: 'Total Balance',
            value: totalBalance,
          },
          {
            label: 'Total Assets',
            value: totalAssets,
          },
          {
            value: totalDebt,
            label: 'Total Debt',
          },
        ].map((s) => (
          <Col xs={24} sm={8} key={s.label}>
            <Card
              bordered
              size="small"
              style={{ backgroundColor: token.colorBgContainer }}
            >
              <Text type="secondary" className="text-xs">
                {s.label}
              </Text>
              <div
                className="text-xl font-bold mt-1"
                style={{
                  color: s.color,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {s.value < 0 ? '-' : ''}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Math.abs(s.value))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Wallet Cards Grid Responsive */}
      <Row gutter={[16, 16]}>
        {wallets.map((w) => (
          <Col xs={24} md={12} xl={8} key={w.id}>
            <WalletCard
              wallet={w}
              onEdit={() => {
                setEditTarget(w)
                setModalMode('edit')
                setIsWalletModalOpen(true)
              }}
              onDelete={() => handleDeleteWallet(w)}
            />
          </Col>
        ))}
        {/* Add wallet placeholder */}
        <Col xs={24} md={12} xl={8}>
          <button
            onClick={() => {
              setModalMode('add')
              setIsWalletModalOpen(true)
            }}
            className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80"
            style={{
              borderColor: token.colorBorder,
              backgroundColor: token.colorBgContainer,
              minHeight: 180,
              aspectRatio: '16/9',
              cursor: 'pointer',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: token.colorBgLayout }}
            >
              <Plus size={18} style={{ color: token.colorPrimary }} />
            </div>
            <Text type="secondary" className="text-sm font-medium">
              Add New Wallet
            </Text>
          </button>
        </Col>
      </Row>

      {/* ─── Add/Edit Wallet Modal ────────────────────────────────────────── */}
      <Modal
        title={modalMode === 'add' ? 'Add Wallet' : 'Edit Wallet'}
        open={isWalletModalOpen}
        onOk={handleWalletSave}
        onCancel={() => setIsWalletModalOpen(false)}
        okText="Save Wallet"
        cancelText="Cancel"
        destroyOnClose
        centered
      >
        <Form
          form={walletForm}
          layout="vertical"
          initialValues={EMPTY_WALLET}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Wallet Name"
            rules={[{ required: true, message: 'Please enter wallet name' }]}
          >
            <Input placeholder="e.g. Chase Savings" size="large" />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={TYPE_OPTIONS} size="large" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="balance"
                label="Balance ($)"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="0.00" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'VND', label: 'VND' },
                    { value: 'GBP', label: 'GBP' },
                  ]}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="icon" label="Icon (emoji)">
            <Input placeholder="🏦" size="large" />
          </Form.Item>

          <Form.Item name="color" label="Color">
            <Form.Item
              shouldUpdate={(prev, curr) => prev.color !== curr.color}
              noStyle
            >
              {({ getFieldValue, setFieldsValue }) => (
                <Space wrap size={8}>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFieldsValue({ color: c })}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 border-none cursor-pointer"
                      style={{
                        backgroundColor: c,
                        outline:
                          getFieldValue('color') === c
                            ? `2px solid ${token.colorText}`
                            : 'none',
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </Space>
              )}
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      {/* ─── Transfer Modal ────────────────────────────────────────────────── */}
      <Modal
        title="Transfer Between Wallets"
        open={isTransferModalOpen}
        onOk={handleTransfer}
        onCancel={() => setIsTransferModalOpen(false)}
        okText="Transfer"
        cancelText="Cancel"
        destroyOnClose
        centered
      >
        <Form form={transferForm} layout="vertical" className="mt-4">
          <Form.Item
            name="from"
            label="From Wallet"
            rules={[{ required: true, message: 'Select source wallet' }]}
          >
            <Select
              size="large"
              options={wallets.map((w) => ({
                value: w.id,
                label: `${w.icon} ${w.name}`,
              }))}
              onChange={() => transferForm.setFieldValue('to', undefined)} // Reset ví nhận nếu ví gửi đổi
            />
          </Form.Item>

          {/* Dùng shouldUpdate để lọc ví nhận không được trùng với ví gửi */}
          <Form.Item
            shouldUpdate={(prev, curr) => prev.from !== curr.from}
            noStyle
          >
            {({ getFieldValue }) => (
              <Form.Item
                name="to"
                label="To Wallet"
                rules={[
                  { required: true, message: 'Select destination wallet' },
                ]}
              >
                <Select
                  size="large"
                  disabled={!getFieldValue('from')}
                  options={wallets
                    .filter((w) => w.id !== getFieldValue('from'))
                    .map((w) => ({
                      value: w.id,
                      label: `${w.icon} ${w.name}`,
                    }))}
                />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount ($)"
            rules={[{ required: true, message: 'Enter amount' }]}
          >
            <Input type="number" placeholder="0.00" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
