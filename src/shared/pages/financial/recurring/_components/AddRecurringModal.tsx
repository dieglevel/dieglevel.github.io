import React, { useEffect } from 'react'
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
} from 'antd'
import dayjs from 'dayjs'
import type { IFinancialRecurring } from '..'

interface AddRecurringModalProps {
  open: boolean
  initialValues?: IFinancialRecurring | null
  onClose: () => void
  onSuccess?: () => void
}

export function AddRecurringModal({
  open,
  initialValues,
  onClose,
  onSuccess,
}: AddRecurringModalProps) {
  const [form] = Form.useForm()

  // Dynamic Form Fields Watchers
  const frequency = Form.useWatch('frequency', form)
  const reminderOnly = Form.useWatch('reminderOnly', form)

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        nextRunAt: initialValues.nextRunAt
          ? dayjs(initialValues.nextRunAt)
          : undefined,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        transactionType: 'expense',
        frequency: 'MONTHLY',
        recurringType: 'BILL',
        isActive: true,
        isAutoCreate: true,
        reminderOnly: false,
        dayOfMonth: 1,
        nextRunAt: dayjs(),
      })
    }
  }, [initialValues, open, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        nextRunAt: values.nextRunAt
          ? values.nextRunAt.toISOString()
          : new Date().toISOString(),
      }
      console.log('Submitted Payload:', payload)

      // TODO: Gọi API Mutation tạo/sửa ở đây
      onSuccess?.()
      onClose()
    } catch (err) {
      // Validate failed
    }
  }

  return (
    <Modal
      title={
        initialValues
          ? 'Chỉnh sửa Cấu hình Định kỳ'
          : 'Thêm Cấu hình Định kỳ Mới'
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={initialValues ? 'Lưu thay đổi' : 'Tạo thiết lập'}
      cancelText="Hủy"
      width={640}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Tên & Loại Giao dịch */}
        <Row gutter={16}>
          <Col xs={24} sm={15}>
            <Form.Item
              name="name"
              label="Tên thiết lập"
              rules={[
                { required: true, message: 'Vui lòng nhập tên thiết lập!' },
              ]}
            >
              <Input placeholder="Ví dụ: Tiền nhà, Tiền điện, Lương..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={9}>
            <Form.Item
              name="transactionType"
              label="Loại giao dịch"
              rules={[{ required: true }]}
            >
              <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                <Radio.Button
                  value="expense"
                  style={{ width: '50%', textAlign: 'center' }}
                >
                  Chi
                </Radio.Button>
                <Radio.Button
                  value="income"
                  style={{ width: '50%', textAlign: 'center' }}
                >
                  Thu
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Số tiền & Phân loại */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="amount"
              label="Số tiền"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
                suffix="VND"
                placeholder="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="recurringType"
              label="Phân loại"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'BILL', label: 'Hóa đơn (Bill)' },
                  {
                    value: 'SUBSCRIPTION',
                    label: 'Gói dịch vụ (Subscription)',
                  },
                  { value: 'SALARY', label: 'Lương (Salary)' },
                  { value: 'OTHER', label: 'Khác (Other)' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }}>Tần suất & Chu kỳ lặp</Divider>

        {/* Dynamic Frequency Settings */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="frequency"
              label="Chu kỳ lặp"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'MONTHLY', label: 'Hàng tháng (Monthly)' },
                  { value: 'WEEKLY', label: 'Hàng tuần (Weekly)' },
                  {
                    value: 'EVERY_N_DAYS',
                    label: 'Số ngày tùy chỉnh (N days)',
                  },
                ]}
              />
            </Form.Item>
          </Col>

          {frequency === 'MONTHLY' && (
            <Col xs={24} sm={12}>
              <Form.Item
                name="dayOfMonth"
                label="Ngày trong tháng (1-31)"
                rules={[{ required: true, type: 'number', min: 1, max: 31 }]}
              >
                <InputNumber
                  min={1}
                  max={31}
                  style={{ width: '100%' }}
                  placeholder="Ngày 1 - 31"
                />
              </Form.Item>
            </Col>
          )}

          {frequency === 'EVERY_N_DAYS' && (
            <Col xs={24} sm={12}>
              <Form.Item
                name="intervalDays"
                label="Số ngày lặp lại"
                rules={[{ required: true, type: 'number', min: 1 }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="Ví dụ: 10"
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12}>
            <Form.Item
              name="nextRunAt"
              label="Lần chạy tiếp theo"
              rules={[{ required: true, message: 'Chọn ngày bắt đầu chạy!' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }}>Ví & Danh mục</Divider>

        {/* Wallet & Category */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="walletId"
              label="Ví thanh toán"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn ví"
                options={[
                  { value: 1, label: 'Ví chính' },
                  { value: 2, label: 'Thẻ tín dụng' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="categoryId" label="Danh mục thu chi">
              <Select
                allowClear
                placeholder="Chọn danh mục"
                options={[
                  { value: 101, label: 'Nhà ở & Tiện ích' },
                  { value: 102, label: 'Giải trí & Dịch vụ' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Tùy chọn nâng cao */}
        <Row gutter={16}>
          <Col xs={12} sm={8}>
            <Form.Item
              name="reminderOnly"
              label="Chỉ gửi nhắc nhở"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
          </Col>

          {!reminderOnly && (
            <Col xs={12} sm={8}>
              <Form.Item
                name="isAutoCreate"
                label="Tự động tạo GD"
                valuePropName="checked"
              >
                <Switch size="small" defaultChecked />
              </Form.Item>
            </Col>
          )}

          <Col xs={12} sm={8}>
            <Form.Item
              name="isActive"
              label="Kích hoạt ngay"
              valuePropName="checked"
            >
              <Switch size="small" defaultChecked />
            </Form.Item>
          </Col>
        </Row>

        {/* Merchant & Tags */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="merchant" label="Merchant / Đơn vị">
              <Input placeholder="Ví dụ: Spotify, EVN, Netflix..." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="tags" label="Thẻ (Tags)">
              <Select mode="tags" placeholder="Nhập thẻ rồi ấn Enter" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
