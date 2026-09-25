import {
  Bell,
  BookOpen,
  CheckCircle2,
  Compass,
  CreditCard,
  HelpCircle,
  Key,
  Settings,
  Shield,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import type { BookSection } from './type'

const IntroContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: '#434343' }}>
      Cuốn sổ tay này đưa bạn làm quen với nền tảng qua các bước cơ bản. Hệ
      thống được thiết kế tối giản để tối ưu hóa 80% thời gian thao tác.
    </p>
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: '#F6FFED',
        border: '1px solid #B7EB8F',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <CheckCircle2 size={20} color="#52C41A" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13.5, color: '#274B16', fontWeight: 500 }}>
        Mọi dữ liệu của bạn đã được khởi tạo và sẵn sàng sử dụng.
      </span>
    </div>
  </div>
)

const StartContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: '#434343' }}>
      Hoàn tất thiết lập tài khoản và kết nối dữ liệu ban đầu chỉ trong 3 bước
      ngắn gọn:
    </p>
    <ol
      style={{
        margin: 0,
        paddingLeft: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        color: '#262626',
        fontSize: 14,
      }}
    >
      <li>Xác thực địa chỉ Email cá nhân.</li>
      <li>Tải lên danh sách dữ liệu mẫu (.csv / .xlsx).</li>
      <li>Gửi lời mời tham gia cho các thành viên trong nhóm.</li>
    </ol>
  </div>
)
export const DEFAULT_SECTIONS: Array<BookSection> = [
  {
    key: 'intro',
    label: 'Giới thiệu',
    icon: BookOpen,
    badge: 'Tổng quan',
    title: 'Chào mừng bạn đến với Hướng Dẫn Sử Dụng',
    subtitle: 'Nền tảng quản trị công việc thế hệ mới',
    content: <IntroContent />,
    tip: 'Bạn có thể dùng phím mũi tên ← → trên bàn phím để chuyển trang nhanh.',
  },
  {
    key: 'start',
    label: 'Bắt đầu',
    icon: Compass,
    badge: 'Bước 1: Khởi tạo',
    title: 'Thiết Lập Tài Khoản',
    subtitle: 'Chỉ mất chưa đầy 3 phút để bắt đầu',
    content: <StartContent />,
    tip: 'Hãy chuẩn bị sẵn danh sách thành viên để gửi lời mời đồng loạt.',
  },
  {
    key: 'config',
    label: 'Cấu hình',
    icon: Settings,
    badge: 'Bước 2: Tùy biến',
    title: 'Cấu Hình Hệ Thống',
    subtitle: 'Linh hoạt điều chỉnh theo quy trình riêng của doanh nghiệp',
    items: [
      {
        key: 'permission',
        label: 'Tùy chỉnh phân quyền',
        icon: UserCheck,
        badge: 'Hot',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0 }}>
              Bạn có thể phân quyền chi tiết cho từng vai trò Admin, Manager
              hoặc Member trong mục <b>Cài đặt {'>'} Phân quyền</b>.
            </p>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: '#FAFAFA',
                border: '1px solid #F0F0F0',
                fontSize: 13,
              }}
            >
              <b>Lưu ý:</b> Quyền Admin mới có thể thay đổi cấu hình bảo mật
              toàn hệ thống.
            </div>
          </div>
        ),
      },
      {
        key: 'security',
        label: 'Bảo mật tài khoản & 2FA',
        icon: Shield,
        content: (
          <p style={{ margin: 0 }}>
            Bật xác thực 2 yếu tố (2FA) trong phần <b>Bảo mật</b> để đảm bảo an
            toàn tuyệt đối cho dữ liệu của bạn via Authenticator App.
          </p>
        ),
      },
      {
        key: 'notification',
        label: 'Thông báo & Email',
        icon: Bell,
        content: (
          <p style={{ margin: 0 }}>
            Điều chỉnh tần suất nhận email tổng hợp, hoặc tắt hoàn toàn thông
            báo đẩy trong mục <b>Cài đặt {'>'} Thông báo</b>.
          </p>
        ),
      },
    ],
    tip: 'Nên kiểm tra lại danh sách phân quyền hàng tháng.',
  },
  {
    key: 'account',
    label: 'Tài khoản',
    icon: Users,
    badge: 'Tài khoản',
    title: 'Quản Lý Tài Khoản',
    subtitle: 'Theo dõi thành viên và lịch sử thanh toán',
    items: [
      {
        key: 'members',
        label: 'Danh sách thành viên',
        icon: Users,
        content: (
          <p style={{ margin: 0 }}>
            Thêm mới, tạm khóa hoặc xóa thành viên khỏi tổ chức tại mục{' '}
            <b>Quản lý thành viên</b>.
          </p>
        ),
      },
      {
        key: 'billing',
        label: 'Gói dịch vụ & Hóa đơn',
        icon: CreditCard,
        content: (
          <p style={{ margin: 0 }}>
            Quản lý hóa đơn VAT, thẻ tín dụng và gia hạn gói dịch vụ
            Pro/Enterprise.
          </p>
        ),
      },
      {
        key: 'api-keys',
        label: 'Quản lý API Keys',
        icon: Key,
        content: (
          <p style={{ margin: 0 }}>
            Tạo và quản lý các chuỗi API Key để kết nối với các ứng dụng bên thứ
            3.
          </p>
        ),
      },
    ],
  },
  {
    key: 'tips',
    label: 'Mẹo hay',
    icon: Sparkles,
    badge: 'Tăng năng suất',
    title: 'Phím Tắt Nhanh',
    subtitle: 'Thao tác không cần nhấc tay khỏi bàn phím',
    content: (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: 12,
            background: '#F5F5F5',
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          <kbd
            style={{
              background: '#FFF',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #CCC',
            }}
          >
            Ctrl + K
          </kbd>{' '}
          Tìm kiếm nhanh
        </div>
        <div
          style={{
            padding: 12,
            background: '#F5F5F5',
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          <kbd
            style={{
              background: '#FFF',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #CCC',
            }}
          >
            Shift + ?
          </kbd>{' '}
          Bảng phím tắt
        </div>
      </div>
    ),
  },
  {
    key: 'faq',
    label: 'Hỏi đáp',
    icon: HelpCircle,
    badge: 'Hỗ trợ',
    title: 'Câu Hỏi Thường Gặp',
    items: [
      {
        key: 'faq-1',
        label: 'Liên hệ hỗ trợ 24/7',
        content: (
          <p style={{ margin: 0 }}>
            Vui lòng liên hệ đội ngũ Support qua LiveChat 24/7 ở góc phải màn
            hình.
          </p>
        ),
      },
      {
        key: 'faq-2',
        label: 'Khôi phục mật khẩu',
        content: (
          <p style={{ margin: 0 }}>
            Chọn <b>Quên mật khẩu</b> tại trang đăng nhập, hệ thống sẽ gửi link
            đặt lại mật khẩu vào email đã đăng ký.
          </p>
        ),
      },
      {
        key: 'faq-3',
        label: 'Xuất báo cáo dữ liệu',
        content: (
          <p style={{ margin: 0 }}>
            Có. Vào{' '}
            <b>
              Cài đặt {'>'} Dữ liệu {'>'} Xuất báo cáo
            </b>{' '}
            để tải về định dạng .csv hoặc .xlsx.
          </p>
        ),
      },
    ],
  },
]
