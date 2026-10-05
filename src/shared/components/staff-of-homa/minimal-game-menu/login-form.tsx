import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft, Lock, LogIn, User, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ANTD_INPUT_STYLE } from './auth-menu-type'
import type { Request_Login } from '@/shared/api/auth/auth.dto'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { UserRoleEnum } from '@/shared/auth/auth.type'

interface LoginFormProps {
  onBack: () => void
  onSuccess?: () => void
}

export function LoginForm({ onBack, onSuccess }: LoginFormProps) {
  const { t, i18n } = useTranslation()
  console.log('language:', i18n.language)

  const [form] = Form.useForm<Request_Login>()
  const [isLoading, setIsLoading] = useState(false)
  const { mLogin } = useMutationAuth()
  const { message } = useApp()
  const router = useRouter()

  const handleSubmit = (values: Request_Login) => {
    setIsLoading(true)
    mLogin.mutate(
      { body: { identifier: values.identifier, password: values.password } },
      {
        onSuccess(data) {
          if (data.data.user.role === UserRoleEnum.CUSTOMER) {
            message.error(
              'You do not have permission to access this application.',
            )
            setIsLoading(false)
            return
          }

          message.success('Login successful')
          AuthTokenService.setTokens(
            data.data.accessToken,
            data.data.refreshToken,
            data.data.user,
          )

          setIsLoading(false)
          onBack()
          if (onSuccess) onSuccess()
          router.invalidate()
        },
        onError() {
          setIsLoading(false)
        },
      },
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
          paddingBottom: '8px',
          marginBottom: '4px',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <span
          style={{
            color: '#fff',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {t('auth.login')}
        </span>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label={
            <span
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {t('auth.identity')}
            </span>
          }
          name="identifier"
          rules={[
            {
              required: true,
              message: t('auth.please-enter-username-or-email'),
            },
          ]}
          style={{ marginBottom: 12 }}
        >
          <Input
            prefix={
              <User
                size={16}
                color="rgba(255,255,255,0.4)"
                style={{ marginRight: 8 }}
              />
            }
            placeholder={t('auth.username/email')}
            style={ANTD_INPUT_STYLE}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label={
            <span
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {t('auth.password')}
            </span>
          }
          name="password"
          rules={[{ required: true, message: t('auth.please-enter-password') }]}
          style={{ marginBottom: 16 }}
        >
          <Input.Password
            prefix={
              <Lock
                size={16}
                color="rgba(255,255,255,0.4)"
                style={{ marginRight: 8 }}
              />
            }
            placeholder="••••••••"
            style={ANTD_INPUT_STYLE}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="text"
            htmlType="submit"
            loading={isLoading}
            icon={<LogIn size={16} />}
            style={{
              padding: 0,
              height: 'auto',
              color: '#ff4b2b',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(255, 75, 43, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {t('auth.submit-login')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
