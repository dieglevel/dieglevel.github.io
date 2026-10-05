import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import useApp from 'antd/es/app/useApp'
import { ArrowLeft, Lock, Mail, User, UserPlus, X } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ANTD_INPUT_STYLE } from './auth-menu-type'
import type { Request_Register } from '@/shared/api/auth/auth.dto'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'

interface RegisterFormProps {
  onBack: () => void
  onSuccessToLogin: () => void
}

export function RegisterForm({ onBack, onSuccessToLogin }: RegisterFormProps) {
  const { t } = useTranslation()

  const [form] = Form.useForm<Request_Register>()
  const [isLoading, setIsLoading] = useState(false)
  const { message } = useApp()
  const { mRegister } = useMutationAuth()
  const router = useRouter()

  const handleSubmit = (values: Request_Register) => {
    setIsLoading(true)
    try {
      mRegister.mutate(
        {
          body: {
            email: values.email,
            password: values.password,
            username: values.username,
          },
        },
        {
          onSuccess(data) {
            const response = data

            message.success('Sign up successful')
          },
        },
      )
    } catch (error) {
      message.error('Sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
            color: '#ff6b4b',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {t('auth.register')}
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
              {t('auth.username')}
            </span>
          }
          name="username"
          rules={[
            { required: true, message: t('auth.please-enter-username') + '!' },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input
            prefix={
              <User
                size={16}
                color="rgba(255,255,255,0.4)"
                style={{ marginRight: 8 }}
              />
            }
            placeholder={t('auth.username')}
            style={ANTD_INPUT_STYLE}
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
              {t('auth.email')}
            </span>
          }
          name="email"
          rules={[
            { required: true, message: t('auth.please-enter-email') + '!' },
            { type: 'email', message: t('auth.invalid-email') },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input
            prefix={
              <Mail
                size={16}
                color="rgba(255,255,255,0.4)"
                style={{ marginRight: 8 }}
              />
            }
            placeholder={t('auth.email')}
            style={ANTD_INPUT_STYLE}
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
          rules={[
            { required: true, message: t('auth.please-enter-password') + '!' },
          ]}
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
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="text"
            htmlType="submit"
            loading={isLoading}
            icon={<UserPlus size={16} />}
            style={{
              padding: 0,
              height: 'auto',
              color: '#ff6b4b',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(255, 107, 75, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {t('auth.create-account')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
