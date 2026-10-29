import React, { useEffect, useState } from 'react'
import {
  App,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
} from 'antd'
import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import type { Feedback_Create_Request } from '@/shared/api/feedback/feedback.type'
import {
  FEEDBACK_FEATURE,
  FEEDBACK_TYPE,
  FeedbackFeatureHelper,
  FeedbackTypeHelper,
} from '@/shared/api/feedback/feedback.enum'
import { useMutationFeedback } from '@/shared/api/feedback/feedback.mutation'
import { useMutationUpload } from '@/shared/api/upload/file.mutation'
import { createUploadFormData } from '@/shared/api/upload/file.type'
import { FileType } from '@/shared/api/upload/file.enum'
import { useAuthStore } from '@/shared/auth/auth.store'

const { Text, Paragraph } = Typography
const { TextArea } = Input

export interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  defaultFeature?: FEEDBACK_FEATURE
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  defaultFeature = FEEDBACK_FEATURE.OTHER,
}) => {
  const { message } = App.useApp()
  const [form] = Form.useForm<Feedback_Create_Request>()
  const { user, isAuthenticated } = useAuthStore()

  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [uploading, setUploading] = useState(false)

  const { mFeedback_Create } = useMutationFeedback()
  const { mUpload } = useMutationUpload()

  useEffect(() => {
    if (open) {
      setFileList([])
      form.resetFields()
      form.setFieldsValue({
        feature: defaultFeature,
        type: FEEDBACK_TYPE.BUG,
        contactEmail: '',
        contactName:
          [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '',
      })
    }
  }, [open, defaultFeature, user, form])

  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList)
  }

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error(`${file.name} không phải là file ảnh hợp lệ.`)
      return Upload.LIST_IGNORE
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error(`Kích thước ảnh ${file.name} vượt quá 5MB.`)
      return Upload.LIST_IGNORE
    }
    return false // Prevent automatic upload, we upload on submit
  }

  const handleSubmit = async (values: Feedback_Create_Request) => {
    try {
      setUploading(true)

      const fileIds: Array<number> = []

      // Upload each selected file to /static/upload using staticFile module pattern
      for (const item of fileList) {
        if (item.originFileObj) {
          const uploadRes = await mUpload.mutateAsync({
            body: createUploadFormData({
              file: item.originFileObj,
              fileType: FileType.OTHER,
            }),
          })
          if (uploadRes.data.id) {
            fileIds.push(uploadRes.data.id)
          }
        }
      }

      const payload: Feedback_Create_Request = {
        title: values.title.trim(),
        content: values.content.trim(),
        feature: values.feature,
        type: values.type,
        contactEmail: values.contactEmail?.trim() || undefined,
        contactName: values.contactName?.trim() || undefined,
        ...(fileIds.length > 0 && { fileIds }),
      }

      await mFeedback_Create.mutateAsync(
        { body: payload },
        {
          onSuccess: () => {
            message.success('Cảm ơn bạn! Phản hồi đã được gửi thành công.')
            onClose()
          },
          onError: () => {
            message.error('Không thể gửi phản hồi, vui lòng thử lại sau.')
          },
        },
      )
    } catch {
      message.error('Có lỗi xảy ra trong quá trình tải ảnh hoặc gửi phản hồi.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal
      title={
        <Space direction="vertical" size={2}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            Gửi phản hồi & Báo lỗi
          </span>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
            Ý kiến của bạn giúp chúng tôi cải thiện chất lượng hệ thống tốt hơn
            mỗi ngày.
          </Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="feature"
              label="Chức năng / Trang liên quan"
              rules={[{ required: true, message: 'Vui lòng chọn chức năng' }]}
            >
              <Select
                placeholder="Chọn chức năng"
                options={FeedbackFeatureHelper.getOptions().map((opt) => ({
                  value: opt.value,
                  label: (
                    <Space>
                      <Tag color={opt.color} style={{ marginInlineEnd: 4 }}>
                        {opt.value}
                      </Tag>
                      <span>{opt.label}</span>
                    </Space>
                  ),
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Loại phản hồi"
              rules={[
                { required: true, message: 'Vui lòng chọn loại phản hồi' },
              ]}
            >
              <Select
                placeholder="Chọn loại phản hồi"
                options={FeedbackTypeHelper.getOptions().map((opt) => ({
                  value: opt.value,
                  label: (
                    <Space>
                      <Tag color={opt.color} style={{ marginInlineEnd: 4 }}>
                        {opt.label}
                      </Tag>
                    </Space>
                  ),
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề ngắn gọn' },
            { max: 255, message: 'Tiêu đề tối đa 255 ký tự' },
          ]}
        >
          <Input placeholder="Ví dụ: Lỗi hiển thị biểu đồ chi tiêu khi đổi tháng..." />
        </Form.Item>

        <Form.Item
          name="content"
          label="Mô tả chi tiết"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập nội dung phản hồi chi tiết',
            },
            { min: 10, message: 'Nội dung tối thiểu 10 ký tự' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải, các bước tái hiện lỗi, hoặc ý tưởng cải tiến của bạn..."
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh / Ảnh chụp màn hình đính kèm (1-N ảnh)"
          extra="Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh."
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={handleBeforeUpload}
            onChange={handleUploadChange}
            multiple
            accept="image/*"
          >
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="contactName"
              label="Tên người gửi"
              rules={[{ max: 100, message: 'Tối đa 100 ký tự' }]}
            >
              <Input
                placeholder="Họ và tên của bạn"
                disabled={isAuthenticated && !!user}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="contactEmail"
              label="Email liên hệ (nếu cần nhận phản hồi)"
              rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Flex justify="flex-end" gap={12} style={{ marginTop: 12 }}>
          <Button
            onClick={onClose}
            disabled={uploading || mFeedback_Create.isPending}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={uploading || mFeedback_Create.isPending}
          >
            Gửi phản hồi
          </Button>
        </Flex>
      </Form>
    </Modal>
  )
}
