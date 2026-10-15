import { useEffect, useState } from 'react'
import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
} from 'antd'
import ImgCrop from 'antd-img-crop'
import dayjs from 'dayjs'
import { Camera, RotateCcw, Save, UserRound } from 'lucide-react'
import type { UploadProps } from 'antd'
import { FileType } from '@/shared/api/upload/file.enum'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'
import { useGetProfile } from '@/shared/api/profile/useGetProfile'
import { useMutationProfile } from '@/shared/api/profile/profile.mutation'
import { useMutationUpload } from '@/shared/api/upload/file.mutation'
import { createUploadFormData } from '@/shared/api/upload/file.type'
import { useAuthStore } from '@/shared/auth/auth.store'

const { Title, Text } = Typography

export function ProfileForm() {
  const { message } = App.useApp()

  const { mode } = useThemeMode()
  const { colors, background, border, shadow } = getTokens(mode)

  const { mUpdate } = useMutationProfile()
  const { mUpload } = useMutationUpload()

  const { data, isLoading, refetch } = useGetProfile({})
  const profile = data?.data || null

  const [form] = Form.useForm<{
    firstName: string
    lastName: string
    dateOfBirth: dayjs.Dayjs | null
  }>()
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar?.url ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [updating, setUpdating] = useState(false)

  const { user, setUser } = useAuthStore()

  useEffect(() => {
    if (data?.data) {
      setUser(profile)
    }
  }, [data])

  useEffect(() => {
    form.setFieldsValue({
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      dateOfBirth: profile?.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
    })

    setAvatarUrl(profile?.avatar?.url ?? '')
    setAvatarFile(null)
  }, [profile, form])

  const handleAvatarChange: UploadProps['beforeUpload'] = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file.')
      return Upload.LIST_IGNORE
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size must not exceed 5 MB.')
      return Upload.LIST_IGNORE
    }

    const previewUrl = URL.createObjectURL(file)

    setAvatarUrl((previousUrl) => {
      if (previousUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousUrl)
      }
      return previewUrl
    })

    setAvatarFile(file)
    return false
  }

  const handleSubmit = async (values: {
    firstName: string
    lastName: string
    dateOfBirth: dayjs.Dayjs | null
  }) => {
    try {
      setUpdating(true)

      let avatarId: number | undefined

      // Upload avatar only when a new file is selected
      if (avatarFile) {
        setUploadingAvatar(true)

        const uploadResponse = await mUpload.mutateAsync({
          body: createUploadFormData({
            file: avatarFile,
            fileType: FileType.PROFILE_AVATAR,
          }),
        })

        avatarId = uploadResponse.data.id
      }

      await mUpdate.mutateAsync(
        {
          body: {
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dateOfBirth?.toISOString() ?? null,
            ...(avatarId !== undefined && { avatarId }),
          },
        },
        {
          onSuccess: () => {
            refetch()
          },
        },
      )

      message.success('Profile updated successfully.')
    } catch {
      message.error('Unable to update profile.')
    } finally {
      setUploadingAvatar(false)
      setUpdating(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue({
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      dateOfBirth: profile?.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
    })

    setAvatarUrl(profile?.avatar?.url ?? '')
    setAvatarFile(null)
  }

  return (
    <Flex vertical gap={32} style={{ padding: 24 }}>
      <Card
        style={{
          maxWidth: 672,
          margin: '0 auto',
          width: '100%',
          borderRadius: 12,
          boxShadow: shadow.elevated,
        }}
        styles={{}}
      >
        {/* Header */}
        <div style={{}}>
          <Title level={4} style={{ marginBottom: 4, marginTop: 4 }}>
            Personal Profile
          </Title>
          <Text type="secondary">
            Manage your account details and update your public profile
            information.
          </Text>
        </div>

        {/* Avatar Section */}
        <div
          style={{
            marginBottom: 32,
            padding: 16,
            borderRadius: 8,
            backgroundColor: background.layout,
            border: `1px solid ${border.light}`,
          }}
        >
          <Flex align="center" gap={24} wrap="wrap">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                size={96}
                src={avatarUrl || undefined}
                icon={<UserRound size={40} />}
                style={{
                  border: `2px solid ${background.base}`,
                  boxShadow: shadow.button,
                  backgroundColor: colors.neutral.soft,
                }}
              />
              <ImgCrop
                rotationSlider
                aspect={1}
                modalTitle="Crop avatar"
                modalOk="Apply"
                modalCancel="Cancel"
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={handleAvatarChange}
                />
              </ImgCrop>
            </div>

            <Flex vertical gap={8}>
              <ImgCrop
                rotationSlider
                aspect={1}
                modalTitle="Crop avatar"
                modalOk="Apply"
                modalCancel="Cancel"
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={handleAvatarChange}
                >
                  <Button size="small" icon={<Camera size={14} />}>
                    Upload photo
                  </Button>
                </Upload>
              </ImgCrop>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Allowed formats: JPG, PNG, or WebP. Max size: 5 MB.
              </Text>
            </Flex>
          </Flex>
        </div>

        {/* Form Section */}
        <Form<{
          firstName: string
          lastName: string
          dateOfBirth: dayjs.Dayjs | null
        }>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>First name</span>}
                name="firstName"
                rules={[
                  {
                    max: 100,
                    message: 'First name cannot exceed 100 characters.',
                  },
                ]}
              >
                <Input placeholder="Enter first name" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Last name</span>}
                name="lastName"
                rules={[
                  {
                    max: 100,
                    message: 'Last name cannot exceed 100 characters.',
                  },
                ]}
              >
                <Input placeholder="Enter last name" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Date of birth</span>}
            name="dateOfBirth"
          >
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              format="DD/MM/YYYY"
              placeholder="Select date of birth"
              disabledDate={(date) => date.isAfter(dayjs(), 'day')}
            />
          </Form.Item>

          {/* Form Actions */}
          <Flex justify="end">
            <Space size="middle">
              <Button
                icon={<RotateCcw size={16} />}
                onClick={handleReset}
                disabled={updating || uploadingAvatar}
              >
                Reset
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={16} />}
                loading={updating || uploadingAvatar}
              >
                Save changes
              </Button>
            </Space>
          </Flex>
        </Form>
      </Card>
    </Flex>
  )
}
