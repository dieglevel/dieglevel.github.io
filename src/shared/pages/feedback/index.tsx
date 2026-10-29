import React, { useState } from 'react'
import { Card, Empty, Flex, Pagination, Space, Spin, Typography } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import { FeedbackFilter } from './components/FeedbackFilter'
import { FeedbackCard } from './components/FeedbackCard'
import { FeedbackModal } from './components/FeedbackModal'
import type { IFeedback } from '@/shared/api/feedback/feedback.type'
import type {
  FEEDBACK_STATUS,
  FEEDBACK_TYPE,
} from '@/shared/api/feedback/feedback.enum'
import { FEEDBACK_FEATURE } from '@/shared/api/feedback/feedback.enum'
import { useGetFeedbackList } from '@/shared/api/feedback/useGetFeedbackList'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Title, Text } = Typography

export const FeedbackPage: React.FC = () => {
  const { mode } = useThemeMode()
  const { background } = getTokens(mode)

  const [modalOpen, setModalOpen] = useState(false)
  const [feature, setFeature] = useState<FEEDBACK_FEATURE | undefined>(
    undefined,
  )
  const [type, setType] = useState<FEEDBACK_TYPE | undefined>(undefined)
  const [status, setStatus] = useState<FEEDBACK_STATUS | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: response, isLoading } = useGetFeedbackList({
    queryParams: {
      feature,
      type,
      status,
      search: search.trim() || undefined,
      page,
      limit: pageSize,
    },
  })

  const rawData = response?.data as unknown as
    | {
        data?: Array<IFeedback>
        items?: Array<IFeedback>
        meta?: { total?: number }
        totalItems?: number
        total?: number
      }
    | undefined

  const feedbackList: Array<IFeedback> = rawData?.data || rawData?.items || []
  const total =
    rawData?.meta?.total ?? rawData?.totalItems ?? rawData?.total ?? 0

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 16px',
        width: '100%',
      }}
    >
      {/* Header Banner */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: mode === 'dark' ? background.base : '#FFFFFF',
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
              <CommentOutlined style={{ marginRight: 10, color: '#1677ff' }} />
              Hòm thư góp ý & Phản hồi
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Chia sẻ ý kiến đóng góp, phản hồi trải nghiệm hoặc báo cáo sự cố
              kỹ thuật để giúp hệ thống hoàn thiện hơn.
            </Text>
          </div>
        </Flex>
      </Card>

      {/* Filter toolbar */}
      <FeedbackFilter
        feature={feature}
        type={type}
        status={status}
        search={search}
        onFeatureChange={(val) => {
          setFeature(val)
          setPage(1)
        }}
        onTypeChange={(val) => {
          setType(val)
          setPage(1)
        }}
        onStatusChange={(val) => {
          setStatus(val)
          setPage(1)
        }}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onOpenModal={() => setModalOpen(true)}
      />

      {/* Feedback Items List */}
      {isLoading ? (
        <Flex justify="center" align="center" style={{ minHeight: 280 }}>
          <Spin size="large" />
        </Flex>
      ) : feedbackList.length === 0 ? (
        <Card
          style={{
            borderRadius: 12,
            textAlign: 'center',
            padding: '48px 0',
            background: mode === 'dark' ? background.base : '#FFFFFF',
          }}
        >
          <Empty
            description={
              <Space direction="vertical" size={4}>
                <Text strong>Chưa có phản hồi nào</Text>
                <Text type="secondary">
                  Hãy là người đầu tiên đóng góp ý kiến hoặc phản ánh vấn đề cho
                  hệ thống!
                </Text>
              </Space>
            }
          />
        </Card>
      ) : (
        <div>
          {feedbackList.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}

          {/* Pagination */}
          {total > pageSize && (
            <Flex
              justify="flex-end"
              style={{ marginTop: 24, marginBottom: 32 }}
            >
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger={false}
                onChange={(newPage) => setPage(newPage)}
                showTotal={(totalItems) => `Tổng cộng ${totalItems} phản hồi`}
              />
            </Flex>
          )}
        </div>
      )}

      {/* Submit Feedback Modal */}
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultFeature={feature || FEEDBACK_FEATURE.OTHER}
      />
    </div>
  )
}

export default FeedbackPage
