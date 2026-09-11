import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import useApp from 'antd/es/app/useApp'
import { ArrowLeft, Lock, Mail, User, UserPlus, X } from 'lucide-react'
import { ANTD_INPUT_STYLE } from './auth-menu-type'
import type { RequestRegister } from './auth-menu-type'

interface RegisterFormProps {
  onBack: () => void
  onSuccessToLogin: () => void
}

export function RegisterForm({ onBack, onSuccessToLogin }: RegisterFormProps) {
  const [form] = Form.useForm<RequestRegister>()
  const [isLoading, setIsLoading] = useState(false)
  const { message } = useApp()

  const handleSubmit = (values: RequestRegister) => {
    setIsLoading(true)
    setTimeout(() => {
      message.success('Registration successful! Please login.')
      setIsLoading(false)
      onSuccessToLogin()
    }, 1000)
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
          REGISTER
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
              Username
            </span>
          }
          name="username"
          rules={[{ required: true, message: 'Please input username!' }]}
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
            placeholder="Username"
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
              Email
            </span>
          }
          name="email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Invalid email!' },
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
            placeholder="Email address"
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
              Password
            </span>
          }
          name="password"
          rules={[{ required: true, message: 'Please input password!' }]}
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
            CREATE ACCOUNT
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
