import React from 'react'
import { Avatar, Card, Flex, Image, Space, Tag, Typography } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PictureOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { IFeedback } from '@/shared/api/feedback/feedback.type'
import {
  FEEDBACK_STATUS,
  FeedbackFeatureHelper,
  FeedbackStatusHelper,
  FeedbackTypeHelper,
} from '@/shared/api/feedback/feedback.enum'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Title, Text, Paragraph } = Typography

interface FeedbackCardProps {
  item: IFeedback
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ item }) => {
  const { mode } = useThemeMode()
  const { background } = getTokens(mode)

  const renderStatusIcon = (status: FEEDBACK_STATUS) => {
    switch (status) {
      case FEEDBACK_STATUS.RESOLVED:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case FEEDBACK_STATUS.IN_REVIEW:
        return <SyncOutlined spin style={{ color: '#1890ff' }} />
      case FEEDBACK_STATUS.REJECTED:
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      case FEEDBACK_STATUS.PENDING:
      default:
        return <ClockCircleOutlined style={{ color: '#faad14' }} />
    }
  }

  const submitterName =
    item.account?.username || item.contactName || 'Người dùng ẩn danh'

  return (
    <Card
      hoverable
      style={{
        marginBottom: 16,
        borderRadius: 12,
        background: mode === 'dark' ? background.base : '#FFFFFF',
        transition: 'all 0.2s ease-in-out',
      }}
      styles={{
        body: { padding: '20px 24px' },
      }}
    >
      <Flex vertical gap={12}>
        {/* Header: Title and Status */}
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={8}>
          <Space orientation="horizontal" size={8} wrap>
            <Tag color={FeedbackTypeHelper.getColor(item.type)}>
              {FeedbackTypeHelper.getLabel(item.type)}
            </Tag>
            <Tag color={FeedbackFeatureHelper.getColor(item.feature)}>
              {FeedbackFeatureHelper.getLabel(item.feature)}
            </Tag>
            <Title level={5} style={{ margin: 0 }}>
              {item.title}
            </Title>
          </Space>

          <Tag
            icon={renderStatusIcon(item.status)}
            color={FeedbackStatusHelper.getColor(item.status)}
            style={{ fontWeight: 500, padding: '2px 8px' }}
          >
            {FeedbackStatusHelper.getLabel(item.status)}
          </Tag>
        </Flex>

        {/* Content */}
        <Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
          style={{
            margin: 0,
            color: mode === 'dark' ? '#E2E8F0' : '#4B5563',
            whiteSpace: 'pre-line',
          }}
        >
          {item.content}
        </Paragraph>

        {/* Attached Images */}
        {item.files && item.files.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <Space size={6} align="center" style={{ marginBottom: 6 }}>
              <PictureOutlined style={{ fontSize: 13, color: '#888' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Ảnh đính kèm ({item.files.length}):
              </Text>
            </Space>
            <Image.PreviewGroup>
              <Space wrap size={10}>
                {item.files.map((file) => (
                  <Image
                    key={file.id}
                    src={file.url ?? undefined}
                    alt={file.originalName || 'Ảnh đính kèm'}
                    width={80}
                    height={80}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          </div>
        )}

        {/* Footer: Submitter info and timestamp */}
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={8}
          style={{ marginTop: 4 }}
        >
          <Space orientation="horizontal" size={8}>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {submitterName}
            </Text>
          </Space>

          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(item.createdAt).format('HH:mm - DD/MM/YYYY')}
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}
