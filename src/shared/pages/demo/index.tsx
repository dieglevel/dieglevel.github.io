/**
 * AntdShowcase.tsx
 * Trình diễn gần như toàn bộ component của Ant Design v5 kèm mock data.
 *
 * Cài đặt:
 *   npm i antd @ant-design/icons dayjs
 *
 * Dùng:
 *   import AntdShowcase from "./AntdShowcase";
 *   <AntdShowcase />
 */
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs'
import {
  // Tổng quát
  Button,
  FloatButton,
  Typography,
  // Bố cục
  Divider,
  Flex,
  Row,
  Col,
  Grid,
  Layout,
  Space,
  Splitter,
  // Điều hướng
  Anchor,
  Breadcrumb,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  // Nhập liệu
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  // Hiển thị dữ liệu
  Avatar,
  Badge,
  Calendar,
  Card,
  Carousel,
  Collapse,
  Descriptions,
  Empty,
  Image,
  List,
  Popover,
  QRCode,
  Segmented,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Tour,
  Tree,
  // Phản hồi
  Alert,
  Drawer,
  Modal,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  Spin,
  Watermark,
  App as AntApp,
  // Khác
  Affix,
} from 'antd'
import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
  HomeOutlined,
  InboxOutlined,
  LikeOutlined,
  MailOutlined,
  MessageOutlined,
  MoonOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  SmileOutlined,
  StarOutlined,
  SunOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps, TableColumnsType, TransferProps } from 'antd'

const { Title, Text, Paragraph, Link } = Typography
const { Header, Sider, Content, Footer } = Layout
const { RangePicker } = DatePicker
const { TextArea, Search, Password } = Input

/* ============================================================
 * TYPES & INTERFACES
 * ============================================================ */
interface UserItem {
  key: string
  name: string
  age: number
  email: string
  city: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  salary: number
  joined: string
}

interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
}

interface HProps {
  id: string
  children: React.ReactNode
}

interface ComponentNavProps {
  onNavigate?: () => void
}

/* ============================================================
 * MOCK DATA
 * ============================================================ */
const mockUsers: Array<UserItem> = [
  {
    key: '1',
    name: 'Nguyễn Văn An',
    age: 28,
    email: 'an.nguyen@example.com',
    city: 'Hà Nội',
    role: 'Admin',
    status: 'active',
    salary: 25000000,
    joined: '2022-03-15',
  },
  {
    key: '2',
    name: 'Trần Thị Bình',
    age: 32,
    email: 'binh.tran@example.com',
    city: 'TP. Hồ Chí Minh',
    role: 'Editor',
    status: 'inactive',
    salary: 18000000,
    joined: '2021-07-01',
  },
  {
    key: '3',
    name: 'Lê Hoàng Cường',
    age: 24,
    email: 'cuong.le@example.com',
    city: 'Đà Nẵng',
    role: 'Viewer',
    status: 'active',
    salary: 12000000,
    joined: '2023-01-20',
  },
  {
    key: '4',
    name: 'Phạm Minh Dũng',
    age: 41,
    email: 'dung.pham@example.com',
    city: 'Hải Phòng',
    role: 'Editor',
    status: 'pending',
    salary: 30000000,
    joined: '2019-11-11',
  },
  {
    key: '5',
    name: 'Hoàng Thu Hà',
    age: 29,
    email: 'ha.hoang@example.com',
    city: 'Cần Thơ',
    role: 'Admin',
    status: 'active',
    salary: 27000000,
    joined: '2020-05-05',
  },
  {
    key: '6',
    name: 'Vũ Đức Huy',
    age: 35,
    email: 'huy.vu@example.com',
    city: 'Huế',
    role: 'Viewer',
    status: 'inactive',
    salary: 15000000,
    joined: '2022-09-09',
  },
]

const cityOptions = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
].map((c) => ({ label: c, value: c }))

const cascaderOptions = [
  {
    value: 'mien-bac',
    label: 'Miền Bắc',
    children: [
      {
        value: 'ha-noi',
        label: 'Hà Nội',
        children: [
          { value: 'ba-dinh', label: 'Ba Đình' },
          { value: 'cau-giay', label: 'Cầu Giấy' },
        ],
      },
      {
        value: 'hai-phong',
        label: 'Hải Phòng',
        children: [{ value: 'le-chan', label: 'Lê Chân' }],
      },
    ],
  },
  {
    value: 'mien-nam',
    label: 'Miền Nam',
    children: [
      {
        value: 'hcm',
        label: 'TP. HCM',
        children: [
          { value: 'q1', label: 'Quận 1' },
          { value: 'q7', label: 'Quận 7' },
        ],
      },
      {
        value: 'can-tho',
        label: 'Cần Thơ',
        children: [{ value: 'ninh-kieu', label: 'Ninh Kiều' }],
      },
    ],
  },
]

const treeData = [
  {
    title: 'Công ty',
    key: '0',
    value: '0',
    children: [
      {
        title: 'Phòng Kỹ thuật',
        key: '0-0',
        value: '0-0',
        children: [
          { title: 'Frontend', key: '0-0-0', value: '0-0-0' },
          { title: 'Backend', key: '0-0-1', value: '0-0-1' },
          { title: 'DevOps', key: '0-0-2', value: '0-0-2' },
        ],
      },
      {
        title: 'Phòng Kinh doanh',
        key: '0-1',
        value: '0-1',
        children: [
          { title: 'Bán hàng', key: '0-1-0', value: '0-1-0' },
          { title: 'Marketing', key: '0-1-1', value: '0-1-1' },
        ],
      },
      { title: 'Phòng Nhân sự', key: '0-2', value: '0-2' },
    ],
  },
]

const transferData = Array.from({ length: 12 }).map((_, i) => ({
  key: String(i),
  title: `Quyền ${i + 1}`,
  description: `Mô tả quyền số ${i + 1}`,
}))

const timelineItems = [
  { color: 'green', children: 'Tạo dự án — 01/01/2026' },
  { color: 'green', children: 'Hoàn thành thiết kế — 15/02/2026' },
  { color: 'red', children: 'Phát hiện lỗi nghiêm trọng — 10/03/2026' },
  { dot: <ClockCircleOutlined />, children: 'Phát hành v1.0 — 01/05/2026' },
  { color: 'gray', children: 'Bảo trì định kỳ' },
]

const listData = Array.from({ length: 5 }).map((_, i) => ({
  title: `Bài viết số ${i + 1}: Hướng dẫn sử dụng Ant Design`,
  description: 'Ant Design là bộ thư viện UI cho ứng dụng doanh nghiệp.',
  content:
    'Nội dung mẫu cho bài viết. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
}))

const mentionsOptions = mockUsers.map((u) => ({
  value: u.email.split('@')[0],
  label: u.name,
}))

const menuItems: MenuProps['items'] = [
  { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ' },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: 'Người dùng',
    children: [
      { key: 'users-list', label: 'Danh sách' },
      { key: 'users-roles', label: 'Phân quyền' },
    ],
  },
  { key: 'mail', icon: <MailOutlined />, label: 'Hộp thư' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
]

const dropdownItems: MenuProps['items'] = [
  { key: '1', label: 'Hồ sơ', icon: <UserOutlined /> },
  { key: '2', label: 'Cài đặt', icon: <SettingOutlined /> },
  { type: 'divider' as const },
  { key: '3', label: 'Đăng xuất', danger: true },
]

const imageUrls = [
  'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
]

/* ============================================================
 * HELPER
 * ============================================================ */
const Section: React.FC<SectionProps> = ({ id, title, children }) => (
  <Card id={id} title={title} style={{ marginBottom: 24 }}>
    {children}
  </Card>
)

/** Tiêu đề từng component — có id để cột điều hướng scroll tới */
const H: React.FC<HProps> = ({ id, children }) => (
  <span id={id} style={{ display: 'block', scrollMarginTop: 80 }}>
    <Divider vertical>{children}</Divider>
  </span>
)

/** Danh sách component cho cột điều hướng (đúng thứ tự trên trang) */
const NAV: Array<{
  key: string
  title: string
  children: Array<[string, string]>
}> = [
  {
    key: 'general',
    title: 'Tổng quát',
    children: [
      ['c-button', 'Button'],
      ['c-typography', 'Typography'],
      ['c-floatbutton', 'FloatButton'],
    ],
  },
  {
    key: 'layout',
    title: 'Bố cục',
    children: [
      ['c-grid', 'Grid'],
      ['c-flex', 'Flex'],
      ['c-space', 'Space'],
      ['c-divider', 'Divider'],
      ['c-layout', 'Layout'],
      ['c-splitter', 'Splitter'],
    ],
  },
  {
    key: 'navigation',
    title: 'Điều hướng',
    children: [
      ['c-breadcrumb', 'Breadcrumb'],
      ['c-menu', 'Menu'],
      ['c-dropdown', 'Dropdown'],
      ['c-pagination', 'Pagination'],
      ['c-steps', 'Steps'],
      ['c-anchor', 'Anchor'],
    ],
  },
  {
    key: 'data-entry',
    title: 'Nhập liệu',
    children: [
      ['c-form', 'Form'],
      ['c-input', 'Input'],
      ['c-password', 'Input.Password'],
      ['c-autocomplete', 'AutoComplete'],
      ['c-input-search', 'Input.Search'],
      ['c-select', 'Select'],
      ['c-cascader', 'Cascader'],
      ['c-treeselect', 'TreeSelect'],
      ['c-inputnumber', 'InputNumber'],
      ['c-datepicker', 'DatePicker'],
      ['c-timepicker', 'TimePicker'],
      ['c-colorpicker', 'ColorPicker'],
      ['c-rangepicker', 'RangePicker'],
      ['c-radio', 'Radio'],
      ['c-checkbox', 'Checkbox'],
      ['c-rate', 'Rate'],
      ['c-slider', 'Slider'],
      ['c-switch', 'Switch'],
      ['c-mentions', 'Mentions'],
      ['c-textarea', 'TextArea'],
      ['c-upload', 'Upload'],
      ['c-upload-dragger', 'Upload.Dragger'],
      ['c-transfer', 'Transfer'],
    ],
  },
  {
    key: 'data-display',
    title: 'Hiển thị dữ liệu',
    children: [
      ['c-tour', 'Tour'],
      ['c-statistic', 'Statistic'],
      ['c-table', 'Table'],
      ['c-avatar-badge', 'Avatar & Badge'],
      ['c-tag', 'Tag'],
      ['c-card', 'Card'],
      ['c-carousel', 'Carousel'],
      ['c-collapse', 'Collapse'],
      ['c-descriptions', 'Descriptions'],
      ['c-list', 'List'],
      ['c-tabs', 'Tabs'],
      ['c-segmented', 'Segmented'],
      ['c-timeline', 'Timeline'],
      ['c-tree', 'Tree'],
      ['c-tooltip-popover', 'Tooltip & Popover'],
      ['c-image', 'Image'],
      ['c-qrcode', 'QRCode'],
      ['c-calendar', 'Calendar'],
      ['c-empty', 'Empty'],
    ],
  },
  {
    key: 'feedback',
    title: 'Phản hồi',
    children: [
      ['c-alert', 'Alert'],
      ['c-overlay', 'Message, Modal, Drawer…'],
      ['c-progress', 'Progress'],
      ['c-spin', 'Spin'],
      ['c-skeleton', 'Skeleton'],
      ['c-result', 'Result'],
      ['c-watermark', 'Watermark'],
    ],
  },
]

const statusTag: Record<string, React.ReactNode> = {
  active: (
    <Tag icon={<CheckCircleOutlined />} color="success">
      Hoạt động
    </Tag>
  ),
  inactive: <Tag color="default">Ngừng</Tag>,
  pending: (
    <Tag icon={<SyncOutlined spin />} color="processing">
      Chờ duyệt
    </Tag>
  ),
}

/* ============================================================
 * 1. TỔNG QUÁT
 * ============================================================ */
function GeneralSection() {
  return (
    <Section id="general" title="Tổng quát: Button, Typography, FloatButton">
      <H id="c-button">Button</H>
      <Space wrap>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
        <Button danger>Danger</Button>
        <Button type="primary" icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
        <Button type="primary" loading>
          Đang tải
        </Button>
        <Button disabled>Disabled</Button>
        <Button shape="circle" icon={<PlusOutlined />} />
        <Button color="purple" variant="solid">
          Purple
        </Button>
      </Space>
      <H id="c-typography">Typography</H>
      <Title level={2}>Tiêu đề H2</Title>
      <Title level={4}>Tiêu đề H4</Title>
      <Paragraph>
        Đây là đoạn văn bản mẫu. <Text strong>In đậm</Text>,{' '}
        <Text italic>in nghiêng</Text>, <Text underline>gạch chân</Text>,{' '}
        <Text delete>gạch ngang</Text>, <Text code>code</Text>,{' '}
        <Text mark>đánh dấu</Text>, <Text keyboard>Ctrl</Text>,{' '}
        <Link href="#">liên kết</Link>.
      </Paragraph>
      <Space>
        <Text type="secondary">Secondary</Text>
        <Text type="success">Success</Text>
        <Text type="warning">Warning</Text>
        <Text type="danger">Danger</Text>
      </Space>
      <Paragraph
        copyable
        editable={{ tooltip: 'Sửa' }}
        ellipsis={{ rows: 1, expandable: true }}
      >
        Đoạn văn có thể sao chép, chỉnh sửa và rút gọn. Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum
        dolor sit amet consectetur adipisicing elit.
      </Paragraph>
      <H id="c-floatbutton">FloatButton</H>
      <Text type="secondary">
        FloatButton hiển thị ở góc phải dưới màn hình.
      </Text>
    </Section>
  )
}

/* ============================================================
 * 2. BỐ CỤC
 * ============================================================ */
function LayoutSection() {
  const box = (bg: string): React.CSSProperties => ({
    background: bg,
    color: '#fff',
    padding: 12,
    textAlign: 'center',
    borderRadius: 4,
  })
  return (
    <Section
      id="layout"
      title="Bố cục: Grid, Flex, Space, Divider, Layout, Splitter"
    >
      <H id="c-grid">Grid (Row / Col)</H>
      <Row gutter={[16, 16]}>
        {[6, 6, 6, 6].map((span, i) => (
          <Col key={i} xs={24} sm={12} md={span}>
            <div style={box('#1677ff')}>col-{span}</div>
          </Col>
        ))}
        <Col span={16}>
          <div style={box('#69b1ff')}>col-16</div>
        </Col>
        <Col span={8}>
          <div style={box('#69b1ff')}>col-8</div>
        </Col>
      </Row>

      <H id="c-flex">Flex</H>
      <Flex gap="middle" justify="space-between" align="center" wrap>
        {['A', 'B', 'C', 'D'].map((t) => (
          <div key={t} style={{ ...box('#52c41a'), width: 80 }}>
            {t}
          </div>
        ))}
      </Flex>

      <H id="c-space">Space & Space.Compact</H>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space size="large">
          <Button>Một</Button>
          <Button>Hai</Button>
          <Button>Ba</Button>
        </Space>
        <Space.Compact style={{ width: '100%' }}>
          <Input defaultValue="https://ant.design" />
          <Button type="primary">Gửi</Button>
        </Space.Compact>
      </Space>

      <span id="c-divider" style={{ display: 'block', scrollMarginTop: 80 }}>
        <Divider dashed>Divider nét đứt</Divider>
      </span>

      <H id="c-layout">Layout</H>
      <Layout style={{ borderRadius: 8, overflow: 'hidden' }}>
        <Header style={{ color: '#fff' }}>Header</Header>
        <Layout>
          <Sider width={160} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['home']}
              items={menuItems}
            />
          </Sider>
          <Content style={{ padding: 24, minHeight: 160 }}>Content</Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>Footer ©2026</Footer>
      </Layout>

      <H id="c-splitter">Splitter</H>
      <Splitter style={{ height: 160, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <Splitter.Panel defaultSize="40%" min="20%">
          <Flex justify="center" align="center" style={{ height: '100%' }}>
            Panel trái
          </Flex>
        </Splitter.Panel>
        <Splitter.Panel>
          <Flex justify="center" align="center" style={{ height: '100%' }}>
            Panel phải (kéo thanh giữa)
          </Flex>
        </Splitter.Panel>
      </Splitter>
    </Section>
  )
}

/* ============================================================
 * 3. ĐIỀU HƯỚNG
 * ============================================================ */
function NavigationSection() {
  const [current, setCurrent] = useState(1)
  const [page, setPage] = useState(1)
  return (
    <Section
      id="navigation"
      title="Điều hướng: Breadcrumb, Menu, Dropdown, Pagination, Steps, Anchor"
    >
      <H id="c-breadcrumb">Breadcrumb</H>
      <Breadcrumb
        items={[
          { href: '#', title: <HomeOutlined /> },
          {
            href: '#',
            title: (
              <>
                <UserOutlined /> <span>Người dùng</span>
              </>
            ),
          },
          { title: 'Chi tiết' },
        ]}
      />
      <H id="c-menu">Menu</H>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['home']}
        items={menuItems}
      />
      <H id="c-dropdown">Dropdown</H>
      <Space wrap>
        <Dropdown menu={{ items: dropdownItems }}>
          <Button>
            Di chuột vào <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
          <Button type="primary">
            Click để mở <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown.Button menu={{ items: dropdownItems }}>
          Dropdown.Button
        </Dropdown.Button>
      </Space>
      <H id="c-pagination">Pagination</H>
      <Pagination
        current={page}
        total={120}
        onChange={setPage}
        showSizeChanger
        showQuickJumper
        showTotal={(t) => `Tổng ${t} mục`}
      />
      <H id="c-steps">Steps</H>
      <Steps
        current={current}
        onChange={setCurrent}
        items={[
          { title: 'Đăng ký', description: 'Tạo tài khoản' },
          { title: 'Xác minh', description: 'Kiểm tra email' },
          { title: 'Thanh toán', description: 'Chọn gói' },
          { title: 'Hoàn tất' },
        ]}
      />
      <Space style={{ marginTop: 16 }}>
        <Button
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          disabled={current === 3}
          onClick={() => setCurrent(current + 1)}
        >
          Tiếp
        </Button>
      </Space>
      <H id="c-anchor">Anchor</H>
      <Text type="secondary">
        Anchor được dùng ở cột điều hướng bên trái: bấm tên component để cuộn
        tới, mục đang xem tự sáng lên.
      </Text>
    </Section>
  )
}

/* ============================================================
 * 4. NHẬP LIỆU
 * ============================================================ */
function DataEntrySection() {
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const [targetKeys, setTargetKeys] = useState<Array<string>>(['1', '3'])
  const [acOptions, setAcOptions] = useState<Array<{ value: string }>>([])

  const onFinish = (values: Record<string, unknown>) => {
    console.log('Form values:', values)
    message.success('Đã lưu hồ sơ')
  }

  const handleTransferChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys as Array<string>)
  }

  return (
    <Section id="data-entry" title="Nhập liệu: Form và các control">
      <H id="c-form">Form</H>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: 'Nguyễn Văn An',
          gender: 'male',
          city: 'Hà Nội',
          skills: ['react'],
          age: 28,
          rate: 4,
          slider: 40,
          notify: true,
          color: '#1677ff',
          dob: dayjs('1998-05-20'),
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12} id="c-input">
            <Form.Item
              label="Họ tên (Input)"
              name="name"
              rules={[{ required: true, message: 'Nhập họ tên' }]}
            >
              <Input prefix={<UserOutlined />} allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-password">
            <Form.Item
              label="Mật khẩu (Password)"
              name="password"
              rules={[{ min: 6, message: 'Tối thiểu 6 ký tự' }]}
            >
              <Password />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-autocomplete">
            <Form.Item label="Email (AutoComplete)" name="email">
              <AutoComplete
                options={acOptions}
                placeholder="Gõ tên để gợi ý"
                onSearch={(v: string) =>
                  setAcOptions(
                    !v || v.includes('@')
                      ? []
                      : ['gmail.com', 'yahoo.com', 'example.com'].map((d) => ({
                          value: `${v}@${d}`,
                        })),
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-input-search">
            <Form.Item label="Tìm kiếm (Input.Search)">
              <Search
                placeholder="Từ khoá"
                enterButton
                onSearch={(v: string) => message.info(`Tìm: ${v}`)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-select">
            <Form.Item label="Thành phố (Select)" name="city">
              <Select options={cityOptions} showSearch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Kỹ năng (Select multiple)" name="skills">
              <Select
                mode="multiple"
                options={[
                  { label: 'React', value: 'react' },
                  { label: 'Vue', value: 'vue' },
                  { label: 'Angular', value: 'angular' },
                  { label: 'Node.js', value: 'node' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-cascader">
            <Form.Item label="Địa chỉ (Cascader)" name="address">
              <Cascader options={cascaderOptions} placeholder="Chọn khu vực" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-treeselect">
            <Form.Item label="Phòng ban (TreeSelect)" name="department">
              <TreeSelect
                treeData={treeData}
                treeDefaultExpandAll
                placeholder="Chọn phòng ban"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} id="c-inputnumber">
            <Form.Item label="Tuổi (InputNumber)" name="age">
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} id="c-datepicker">
            <Form.Item label="Ngày sinh (DatePicker)" name="dob">
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} id="c-timepicker">
            <Form.Item label="Giờ (TimePicker)" name="time">
              <TimePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6} id="c-colorpicker">
            <Form.Item label="Màu (ColorPicker)" name="color">
              <ColorPicker showText />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-rangepicker">
            <Form.Item label="Khoảng thời gian (RangePicker)" name="range">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-radio">
            <Form.Item label="Giới tính (Radio)" name="gender">
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Gói (Radio.Button)" name="plan">
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                options={['Free', 'Pro', 'Enterprise']}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-checkbox">
            <Form.Item label="Sở thích (Checkbox)" name="hobbies">
              <Checkbox.Group
                options={['Đọc sách', 'Du lịch', 'Thể thao', 'Âm nhạc']}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8} id="c-rate">
            <Form.Item label="Đánh giá (Rate)" name="rate">
              <Rate allowHalf />
            </Form.Item>
          </Col>
          <Col xs={24} md={8} id="c-slider">
            <Form.Item label="Mức độ (Slider)" name="slider">
              <Slider marks={{ 0: '0', 50: '50', 100: '100' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8} id="c-switch">
            <Form.Item
              label="Nhận thông báo (Switch)"
              name="notify"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
          <Col span={24} id="c-mentions">
            <Form.Item label="Ghi chú (Mentions — gõ @)" name="note">
              <Mentions
                rows={2}
                options={mentionsOptions}
                placeholder="Gõ @ để nhắc tên đồng nghiệp"
              />
            </Form.Item>
          </Col>
          <Col span={24} id="c-textarea">
            <Form.Item label="Giới thiệu (TextArea)" name="bio">
              <TextArea rows={3} showCount maxLength={200} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-upload">
            <Form.Item
              label="Ảnh đại diện (Upload)"
              name="avatar"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} id="c-upload-dragger">
            <Form.Item label="Tài liệu (Upload.Dragger)">
              <Upload.Dragger beforeUpload={() => false} multiple>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file vào đây hoặc bấm để chọn
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
          <Col span={24} id="c-transfer">
            <Form.Item label="Phân quyền (Transfer)">
              <Transfer
                dataSource={transferData}
                targetKeys={targetKeys}
                onChange={handleTransferChange}
                render={(item) => item.title}
                titles={['Có sẵn', 'Đã cấp']}
                showSearch
                listStyle={{ width: '100%', height: 260 }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, v: boolean) =>
                    v
                      ? Promise.resolve()
                      : Promise.reject(new Error('Cần đồng ý điều khoản')),
                },
              ]}
            >
              <Checkbox>Tôi đồng ý với điều khoản sử dụng</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Space>
          <Button type="primary" htmlType="submit">
            Lưu hồ sơ
          </Button>
          <Button onClick={() => form.resetFields()}>Đặt lại</Button>
        </Space>
      </Form>
    </Section>
  )
}

/* ============================================================
 * 5. HIỂN THỊ DỮ LIỆU
 * ============================================================ */
function DataDisplaySection() {
  const [tourOpen, setTourOpen] = useState(false)
  const [segment, setSegment] = useState<string | number>('Ngày')
  const tableRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  const columns: TableColumnsType<UserItem> = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      render: (t: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <a href="#link">{t}</a>
        </Space>
      ),
      sorter: (a: UserItem, b: UserItem) => a.name.localeCompare(b.name),
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      sorter: (a: UserItem, b: UserItem) => a.age - b.age,
    },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      filters: cityOptions.map((c) => ({ text: c.label, value: c.value })),
      onFilter: (v, r: UserItem) => r.city === v,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (r: string) => (
        <Tag
          color={r === 'Admin' ? 'red' : r === 'Editor' ? 'blue' : 'default'}
        >
          {r}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => statusTag[s],
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      align: 'right' as const,
      render: (v: number) => v.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="Sửa">
            <Button size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm title="Xoá người dùng này?" okText="Xoá" cancelText="Huỷ">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Section id="data-display" title="Hiển thị dữ liệu">
      <H id="c-tour">Tour</H>
      <Button type="primary" onClick={() => setTourOpen(true)}>
        Bắt đầu Tour hướng dẫn
      </Button>

      <H id="c-statistic">Statistic</H>
      <Row gutter={16} ref={statsRef}>
        <Col xs={12} md={6}>
          <Statistic
            title="Người dùng"
            value={1128}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col xs={12} md={6}>
          <Statistic
            title="Doanh thu (₫)"
            value={93512000}
            groupSeparator="."
          />
        </Col>
        <Col xs={12} md={6}>
          <Statistic
            title="Tăng trưởng"
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Col>
        <Col xs={12} md={6}>
          <Statistic
            title="Tỉ lệ rời bỏ"
            value={9.3}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Col>
        <Col xs={24} style={{ marginTop: 16 }}>
          <Statistic.Countdown
            title="Đếm ngược khuyến mãi"
            value={Date.now() + 1000 * 60 * 60 * 24 * 2}
            format="D [ngày] HH:mm:ss"
          />
        </Col>
      </Row>

      <H id="c-table">Table</H>
      <div ref={tableRef}>
        <Table
          columns={columns}
          dataSource={mockUsers}
          rowSelection={{ type: 'checkbox' }}
          pagination={{ pageSize: 4 }}
          scroll={{ x: 900 }}
          expandable={{
            expandedRowRender: (r: UserItem) => (
              <p style={{ margin: 0 }}>
                Ngày vào làm: {dayjs(r.joined).format('DD/MM/YYYY')}
              </p>
            ),
          }}
        />
      </div>

      <H id="c-avatar-badge">Avatar & Badge</H>
      <Space size="large" wrap>
        <Avatar size={48} icon={<UserOutlined />} />
        <Avatar size={48} style={{ backgroundColor: '#f56a00' }}>
          A
        </Avatar>
        <Avatar
          size={48}
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
        />
        <Avatar.Group max={{ count: 3 }}>
          {mockUsers.map((u) => (
            <Avatar key={u.key} style={{ backgroundColor: '#1677ff' }}>
              {u.name.split(' ').pop()?.[0]}
            </Avatar>
          ))}
        </Avatar.Group>
        <Badge count={5}>
          <Avatar shape="square" size="large" icon={<MailOutlined />} />
        </Badge>
        <Badge count={120} overflowCount={99}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge dot>
          <Avatar shape="square" size="large" />
        </Badge>
        <Badge status="success" text="Online" />
        <Badge status="error" text="Lỗi" />
        <Badge.Ribbon text="Hot" color="red">
          <Card size="small" style={{ width: 140 }}>
            Có ribbon
          </Card>
        </Badge.Ribbon>
      </Space>

      <H id="c-tag">Tag</H>
      <Space wrap ref={tagsRef}>
        {[
          'magenta',
          'red',
          'volcano',
          'orange',
          'gold',
          'lime',
          'green',
          'cyan',
          'blue',
          'geekblue',
          'purple',
        ].map((c) => (
          <Tag key={c} color={c}>
            {c}
          </Tag>
        ))}
        <Tag closable>Có thể đóng</Tag>
        <Tag.CheckableTag checked>Checkable</Tag.CheckableTag>
      </Space>

      <H id="c-card">Card</H>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card
            cover={
              <img
                alt="cover"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="s" />,
              <EditOutlined key="e" />,
              <EllipsisOutlined key="m" />,
            ]}
          >
            <Card.Meta
              avatar={
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              }
              title="Thẻ có ảnh bìa"
              description="Mô tả ngắn cho thẻ"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Thẻ có tiêu đề" extra={<a href="#">Xem thêm</a>}>
            <p>Nội dung thẻ thứ nhất</p>
            <p>Nội dung thẻ thứ hai</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading title="Đang tải" />
        </Col>
      </Row>

      <H id="c-carousel">Carousel</H>
      <Carousel autoplay>
        {['#364d79', '#1677ff', '#52c41a', '#fa8c16'].map((bg, i) => (
          <div key={bg}>
            <h3
              style={{
                height: 160,
                color: '#fff',
                lineHeight: '160px',
                textAlign: 'center',
                background: bg,
                margin: 0,
              }}
            >
              Slide {i + 1}
            </h3>
          </div>
        ))}
      </Carousel>

      <H id="c-collapse">Collapse</H>
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'Ant Design là gì?',
            children: (
              <p>
                Bộ thư viện UI dành cho ứng dụng doanh nghiệp, viết bằng React.
              </p>
            ),
          },
          {
            key: '2',
            label: 'Có hỗ trợ TypeScript không?',
            children: <p>Có, viết hoàn toàn bằng TypeScript.</p>,
          },
          {
            key: '3',
            label: 'Có hỗ trợ dark mode không?',
            children: <p>Có, qua ConfigProvider với theme.darkAlgorithm.</p>,
          },
        ]}
      />

      <H id="c-descriptions">Descriptions</H>
      <Descriptions
        bordered
        column={{ xs: 1, sm: 2, md: 3 }}
        items={[
          { key: '1', label: 'Họ tên', children: mockUsers[0].name },
          { key: '2', label: 'Email', children: mockUsers[0].email },
          { key: '3', label: 'Thành phố', children: mockUsers[0].city },
          { key: '4', label: 'Vai trò', children: mockUsers[0].role },
          {
            key: '5',
            label: 'Trạng thái',
            children: statusTag[mockUsers[0].status],
          },
          {
            key: '6',
            label: 'Ngày vào làm',
            children: dayjs(mockUsers[0].joined).format('DD/MM/YYYY'),
          },
        ]}
      />

      <H id="c-list">List</H>
      <List
        itemLayout="vertical"
        pagination={{ pageSize: 2 }}
        dataSource={listData}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <Space key="s">
                <StarOutlined />
                156
              </Space>,
              <Space key="l">
                <LikeOutlined />
                42
              </Space>,
              <Space key="m">
                <MessageOutlined />2
              </Space>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href="#">{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />

      <H id="c-tabs">Tabs</H>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Tổng quan',
            icon: <AppstoreOutlined />,
            children: 'Nội dung tab Tổng quan',
          },
          {
            key: '2',
            label: 'Người dùng',
            icon: <UserOutlined />,
            children: 'Nội dung tab Người dùng',
          },
          {
            key: '3',
            label: 'Cài đặt',
            icon: <SettingOutlined />,
            children: 'Nội dung tab Cài đặt',
          },
        ]}
      />
      <Tabs
        type="card"
        items={[1, 2, 3].map((i) => ({
          key: String(i),
          label: `Card tab ${i}`,
          children: `Nội dung ${i}`,
        }))}
      />

      <H id="c-segmented">Segmented</H>
      <Segmented
        options={['Ngày', 'Tuần', 'Tháng', 'Năm']}
        value={segment}
        onChange={setSegment}
      />
      <Text style={{ marginLeft: 12 }}>Đang xem theo: {segment}</Text>

      <H id="c-timeline">Timeline</H>
      <Timeline items={timelineItems} />

      <H id="c-tree">Tree</H>
      <Tree checkable defaultExpandAll treeData={treeData} />

      <H id="c-tooltip-popover">Tooltip & Popover</H>
      <Space>
        <Tooltip title="Đây là tooltip">
          <Button>Hover Tooltip</Button>
        </Tooltip>
        <Popover
          title="Tiêu đề Popover"
          content={
            <div>
              <p>Nội dung 1</p>
              <p>Nội dung 2</p>
            </div>
          }
        >
          <Button type="primary">Hover Popover</Button>
        </Popover>
        <Popover content="Mở bằng click" trigger="click">
          <Button>Click Popover</Button>
        </Popover>
      </Space>

      <H id="c-image">Image</H>
      <Image.PreviewGroup>
        <Space>
          {imageUrls.map((src) => (
            <Image
              key={src}
              width={120}
              height={80}
              style={{ objectFit: 'cover' }}
              src={src}
            />
          ))}
        </Space>
      </Image.PreviewGroup>

      <H id="c-qrcode">QRCode</H>
      <Space>
        <QRCode value="https://ant.design" />
        <QRCode
          value="https://ant.design"
          color="#1677ff"
          icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
      </Space>

      <H id="c-calendar">Calendar</H>
      <div
        style={{ maxWidth: 360, border: '1px solid #f0f0f0', borderRadius: 8 }}
      >
        <Calendar fullscreen={false} />
      </div>

      <H id="c-empty">Empty</H>
      <Flex gap="large" wrap>
        <Empty description="Chưa có dữ liệu" />
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có kết quả"
        >
          <Button type="primary">Tạo mới</Button>
        </Empty>
      </Flex>

      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={[
          {
            title: 'Thống kê',
            description: 'Các chỉ số chính của hệ thống.',
          },
          {
            title: 'Bảng dữ liệu',
            description: 'Sắp xếp, lọc, chọn và mở rộng từng dòng.',
          },
          {
            title: 'Tag',
            description: 'Nhãn màu để phân loại.',
          },
        ]}
      />
    </Section>
  )
}

/* ============================================================
 * 6. PHẢN HỒI
 * ============================================================ */
function FeedbackSection() {
  const { message, notification, modal } = AntApp.useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(true)

  return (
    <Section id="feedback" title="Phản hồi">
      <H id="c-alert">Alert</H>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert message="Lưu thành công" type="success" showIcon />
        <Alert message="Phiên bản mới đã có" type="info" showIcon closable />
        <Alert
          message="Dung lượng sắp đầy"
          description="Bạn đã dùng 90% dung lượng lưu trữ."
          type="warning"
          showIcon
        />
        <Alert
          message="Không kết nối được máy chủ"
          type="error"
          showIcon
          action={
            <Button size="small" danger>
              Thử lại
            </Button>
          }
        />
        <Alert banner message="Hệ thống bảo trì lúc 23:00 tối nay" />
      </Space>

      <H id="c-overlay">Message, Notification, Modal, Drawer, Popconfirm</H>
      <Space wrap>
        <Button onClick={() => message.success('Thao tác thành công')}>
          Message success
        </Button>
        <Button onClick={() => message.error('Có lỗi xảy ra')}>
          Message error
        </Button>
        <Button onClick={() => message.loading('Đang xử lý...', 1.5)}>
          Message loading
        </Button>
        <Button
          onClick={() =>
            notification.open({
              message: 'Thông báo mới',
              description: 'Bạn có 3 tin nhắn chưa đọc.',
              icon: <SmileOutlined style={{ color: '#1677ff' }} />,
            })
          }
        >
          Notification
        </Button>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Mở Modal
        </Button>
        <Button
          onClick={() =>
            modal.confirm({
              title: 'Xoá dự án?',
              content:
                'Dự án và toàn bộ dữ liệu liên quan sẽ bị xoá vĩnh viễn.',
              okText: 'Xoá',
              okType: 'danger',
              cancelText: 'Huỷ',
              onOk: () => message.success('Đã xoá dự án'),
            })
          }
        >
          Modal.confirm
        </Button>
        <Button onClick={() => setDrawerOpen(true)}>Mở Drawer</Button>
        <Popconfirm
          title="Xoá mục này?"
          description="Hành động không thể hoàn tác."
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => message.success('Đã xoá')}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button danger>Popconfirm</Button>
        </Popconfirm>
      </Space>

      <Modal
        title="Chi tiết người dùng"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        okText="Đóng"
        cancelText="Huỷ"
      >
        <Descriptions
          column={1}
          items={[
            { key: '1', label: 'Họ tên', children: mockUsers[1].name },
            { key: '2', label: 'Email', children: mockUsers[1].email },
            { key: '3', label: 'Thành phố', children: mockUsers[1].city },
          ]}
        />
      </Modal>

      <Drawer
        title="Bộ lọc nâng cao"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Button type="primary" onClick={() => setDrawerOpen(false)}>
            Áp dụng
          </Button>
        }
      >
        <Form layout="vertical">
          <Form.Item label="Thành phố">
            <Select options={cityOptions} mode="multiple" />
          </Form.Item>
          <Form.Item label="Khoảng tuổi">
            <Slider range defaultValue={[20, 40]} />
          </Form.Item>
          <Form.Item label="Chỉ hiện đang hoạt động">
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>

      <H id="c-progress">Progress</H>
      <Row gutter={16} align="middle">
        <Col xs={24} md={12}>
          <Progress percent={30} />
          <Progress percent={50} status="active" />
          <Progress percent={70} status="exception" />
          <Progress percent={100} />
          <Progress percent={60} steps={5} />
        </Col>
        <Col xs={24} md={12}>
          <Space wrap>
            <Progress type="circle" percent={75} size={80} />
            <Progress type="circle" percent={100} size={80} />
            <Progress type="dashboard" percent={60} size={80} />
            <Progress
              type="circle"
              percent={90}
              size={80}
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
          </Space>
        </Col>
      </Row>

      <H id="c-spin">Spin</H>
      <Space align="start" size="large" wrap>
        <Spin />
        <Spin size="large" />
        <Spin spinning={spinning} tip="Đang tải...">
          <Alert
            style={{ width: 280 }}
            message="Khối nội dung"
            description="Bật Spin để phủ lớp đang tải lên đây."
          />
        </Spin>
        <Switch
          checked={spinning}
          onChange={setSpinning}
          checkedChildren="Đang tải"
          unCheckedChildren="Xong"
        />
      </Space>

      <H id="c-skeleton">Skeleton</H>
      <Switch
        checked={skeletonLoading}
        onChange={setSkeletonLoading}
        style={{ marginBottom: 16 }}
      />
      <Skeleton loading={skeletonLoading} avatar active paragraph={{ rows: 3 }}>
        <List.Item.Meta
          avatar={<Avatar src={listData[0].avatar} />}
          title={listData[0].title}
          description={listData[0].content}
        />
      </Skeleton>
      <Space style={{ marginTop: 16 }}>
        <Skeleton.Button active />
        <Skeleton.Input active />
        <Skeleton.Avatar active />
        <Skeleton.Image active />
      </Space>

      <H id="c-result">Result</H>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Result
            status="success"
            title="Thanh toán thành công"
            subTitle="Mã đơn hàng: 2026100500123"
            extra={<Button type="primary">Xem đơn hàng</Button>}
          />
        </Col>
        <Col xs={24} md={12}>
          <Result
            status="404"
            title="404"
            subTitle="Không tìm thấy trang bạn yêu cầu."
            extra={<Button>Về trang chủ</Button>}
          />
        </Col>
      </Row>

      <H id="c-watermark">Watermark</H>
      <Watermark content={['Bảo mật', 'Nội bộ']}>
        <div
          style={{
            height: 200,
            padding: 16,
            border: '1px dashed #d9d9d9',
            borderRadius: 8,
          }}
        >
          <Paragraph>Nội dung tài liệu nội bộ có watermark phía sau.</Paragraph>
        </div>
      </Watermark>
    </Section>
  )
}

/* ============================================================
 * COMPONENT CHÍNH
 * ============================================================ */
/* ============================================================
 * CỘT ĐIỀU HƯỚNG COMPONENT
 * ============================================================ */
const HEADER_OFFSET = 80

function flash(id: string) {
  const el = document.getElementById(id)
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  el.animate(
    [
      { backgroundColor: 'rgba(22,119,255,0.18)' },
      { backgroundColor: 'transparent' },
    ],
    { duration: 1200, easing: 'ease-out' },
  )
}

function ComponentNav({ onNavigate }: ComponentNavProps) {
  const [q, setQ] = useState('')
  const kw = q.trim().toLowerCase()

  const items = NAV.map((s) => {
    const children = s.children
      .filter(([, t]) => !kw || t.toLowerCase().includes(kw))
      .map(([id, t]) => ({ key: id, href: `#${id}`, title: t }))
    return {
      key: s.key,
      href: `#${s.key}`,
      title: `${s.title} (${children.length})`,
      children,
    }
  }).filter((s) => !kw || s.children.length)

  const total = NAV.reduce((n, s) => n + s.children.length, 0)

  return (
    <Flex vertical gap={12} style={{ height: '100%' }}>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={`Tìm trong ${total} component`}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        {items.length ? (
          <Anchor
            affix={false}
            targetOffset={HEADER_OFFSET}
            items={items}
            onClick={(e, link) => {
              setTimeout(() => flash(link.href.slice(1)), 350)
              onNavigate?.()
            }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có component khớp"
          />
        )}
      </div>
    </Flex>
  )
}

export default function AntdShowcase() {
  const [dark, setDark] = useState(false)
  const [primary, setPrimary] = useState('#1677ff')
  const [navOpen, setNavOpen] = useState(false)
  const screens = Grid.useBreakpoint()

  return (
    <AntApp>
      <Layout style={{ minHeight: '100vh' }}>
        <Affix offsetTop={0}>
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              Ant Design Showcase
            </Title>
            <Space>
              <ColorPicker
                value={primary}
                onChange={(c) => setPrimary(c.toHexString())}
                size="small"
              />
              <Switch
                checked={dark}
                onChange={setDark}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Space>
          </Header>
        </Affix>

        <Content style={{ padding: 24 }}>
          <Row gutter={24}>
            {/* Cột điều hướng: cố định khi cuộn, chỉ hiện trên màn hình lớn */}
            <Col xs={0} lg={6} xl={5}>
              <Card
                size="small"
                title="Component"
                style={{
                  position: 'sticky',
                  top: HEADER_OFFSET,
                  height: `calc(100vh - ${HEADER_OFFSET + 24}px)`,
                }}
                styles={{ body: { height: 'calc(100% - 38px)' } }}
              >
                <ComponentNav />
              </Card>
            </Col>
            <Col xs={24} lg={18} xl={19}>
              <GeneralSection />
              <LayoutSection />
              <NavigationSection />
              <DataEntrySection />
              <DataDisplaySection />
              <FeedbackSection />
            </Col>
          </Row>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Ant Design Showcase ©2026
        </Footer>
      </Layout>

      <FloatButton.Group
        trigger="hover"
        type="primary"
        icon={<CustomerServiceOutlined />}
        style={{ insetInlineEnd: 24 }}
      >
        <FloatButton icon={<QuestionCircleOutlined />} tooltip="Trợ giúp" />
        <FloatButton
          icon={<MessageOutlined />}
          badge={{ count: 3 }}
          tooltip="Tin nhắn"
        />
      </FloatButton.Group>
      {/* Màn hình nhỏ: mở danh sách component trong Drawer */}
      {!screens.lg && (
        <FloatButton
          icon={<UnorderedListOutlined />}
          tooltip="Danh sách component"
          onClick={() => setNavOpen(true)}
          style={{ insetInlineEnd: 152 }}
        />
      )}
      <Drawer
        title="Component"
        placement="left"
        width={300}
        open={navOpen && !screens.lg}
        onClose={() => setNavOpen(false)}
      >
        <ComponentNav onNavigate={() => setNavOpen(false)} />
      </Drawer>
      <FloatButton.BackTop style={{ insetInlineEnd: 88 }} />
    </AntApp>
  )
}
