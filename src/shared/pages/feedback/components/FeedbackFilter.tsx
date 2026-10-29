import React from 'react'
import { Button, Card, Col, Flex, Input, Row, Select } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type {
  FEEDBACK_FEATURE,
  FEEDBACK_STATUS,
  FEEDBACK_TYPE,
} from '@/shared/api/feedback/feedback.enum'
import {
  FeedbackFeatureHelper,
  FeedbackStatusHelper,
  FeedbackTypeHelper,
} from '@/shared/api/feedback/feedback.enum'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

interface FeedbackFilterProps {
  feature?: FEEDBACK_FEATURE
  type?: FEEDBACK_TYPE
  status?: FEEDBACK_STATUS
  search?: string
  onFeatureChange: (value?: FEEDBACK_FEATURE) => void
  onTypeChange: (value?: FEEDBACK_TYPE) => void
  onStatusChange: (value?: FEEDBACK_STATUS) => void
  onSearchChange: (value: string) => void
  onOpenModal: () => void
}

export const FeedbackFilter: React.FC<FeedbackFilterProps> = ({
  feature,
  type,
  status,
  search,
  onFeatureChange,
  onTypeChange,
  onStatusChange,
  onSearchChange,
  onOpenModal,
}) => {
  const { mode } = useThemeMode()
  const { background } = getTokens(mode)

  return (
    <Card
      style={{
        marginBottom: 20,
        borderRadius: 12,
        background: mode === 'dark' ? background.base : '#FFFFFF',
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <Row gutter={[16, 12]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm theo tiêu đề, nội dung..."
            prefix={<SearchOutlined style={{ color: '#aaa' }} />}
            allowClear
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>

        <Col xs={12} sm={6} md={5}>
          <Select
            allowClear
            placeholder="Tất cả chức năng"
            style={{ width: '100%' }}
            value={feature}
            onChange={onFeatureChange}
            options={FeedbackFeatureHelper.getOptions().map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Select
            allowClear
            placeholder="Loại phản hồi"
            style={{ width: '100%' }}
            value={type}
            onChange={onTypeChange}
            options={FeedbackTypeHelper.getOptions().map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: '100%' }}
            value={status}
            onChange={onStatusChange}
            options={FeedbackStatusHelper.getOptions().map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
        </Col>

        <Col xs={12} sm={6} md={5}>
          <Flex justify="flex-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onOpenModal}
              style={{ width: '100%' }}
            >
              Gửi phản hồi mới
            </Button>
          </Flex>
        </Col>
      </Row>
    </Card>
  )
}
