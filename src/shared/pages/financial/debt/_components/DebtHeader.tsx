import React from 'react'
import { Button, Flex, Typography } from 'antd'
import { Plus } from 'lucide-react'

const { Title, Text } = Typography

interface DebtHeaderProps {
  isMobile: boolean
  totalCount: number
  activeCount: number
  onOpenCreate: () => void
}

export const DebtHeader: React.FC<DebtHeaderProps> = ({
  isMobile,
  totalCount,
  activeCount,
  onOpenCreate,
}) => {
  return (
    <Flex
      vertical={isMobile}
      justify="space-between"
      align={isMobile ? 'stretch' : 'center'}
      gap={isMobile ? 12 : 0}
      style={{ marginBottom: 20 }}
    >
      <div>
        <Flex align="center" gap={10}>
          {/* <div
            style={{
              padding: 8,
              borderRadius: 10,
              backgroundColor: '#e6f4ff',
              color: '#1677ff',
              display: 'flex',
            }}
          >
            <WalletCards size={22} />
          </div> */}
          <div>
            <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
              Quản lý Sổ Nợ & Khoản Vay
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Theo dõi chi tiết {totalCount} khoản nợ ({activeCount} khoản đang
              hoạt động)
            </Text>
          </div>
        </Flex>
      </div>

      <Button
        type="primary"
        size="large"
        icon={<Plus size={18} />}
        onClick={onOpenCreate}
        style={{
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)',
        }}
      >
        Tạo khoản nợ mới
      </Button>
    </Flex>
  )
}
