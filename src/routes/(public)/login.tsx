import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Button, Card, Flex, Form, Input } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import type { WriteItemProps } from '@/shared/components/form/write-item'
import type { Request_Login } from '@/shared/api/auth/auth.dto'
import WriteItem from '@/shared/components/form/write-item'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'
import { UserRoleEnum } from '@/shared/auth/auth.type'
import { useAuthStore } from '@/shared/auth/auth.store'

export const Route = createFileRoute('/(public)/login')({
  component: LoginComponent,
  beforeLoad: () => {
    const loadToken = AuthTokenService.loadTokens()

    useAuthStore.setState({
      accessToken: loadToken?.accessToken || null,
      refreshToken: loadToken?.refreshToken || null,
      user: loadToken?.user || null,
      isAuthenticated: !!loadToken,
    })

    const { isAuthenticated } = useAuthStore.getState()

    if (isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

type LoginField = WriteItemProps<React.ElementType, Request_Login>

export function LoginComponent() {
  const router = useRouter()
  const [form] = useForm<Request_Login>()
  const [isLoading, setIsLoading] = useState(false)
  const { mLogin } = useMutationAuth()
  const { message } = useApp()

  const field: Array<LoginField> = [
    {
      form: {
        label: 'Email',
        name: 'email',
        rules: [{ required: true, message: 'Please input your email!' }],
      },
      component: Input,
      componentProps: {
        placeholder: 'Email',
        autoComplete: 'username',
      },
    } as WriteItemProps<typeof Input, Request_Login>,
    {
      form: {
        label: 'Password',
        name: 'password',
        rules: [{ required: true, message: 'Please input your password!' }],
      },
      component: Input.Password,
      componentProps: {
        placeholder: 'Password',
        autoComplete: 'current-password',
      },
    } as WriteItemProps<typeof Input.Password, Request_Login>,
  ]

  const handleLogin = (values: Request_Login) => {
    setIsLoading(true)
    try {
      mLogin.mutate(
        {
          body: {
            email: values.email,
            password: values.password,
          },
        },
        {
          onSuccess(data) {
            const response = data

            if (response.user.role === UserRoleEnum.CUSTOMER) {
              message.error(
                'You do not have permission to access this application.',
              )
              return
            }

            message.success('Login successful')

            AuthTokenService.setTokens(
              response.access_token,
              response.refresh_token,
              response.user,
            )

            router.navigate({
              to: '/dashboard',
              replace: true,
            })
          },
        },
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      flex={1}
      style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}
    >
      <Card title="Login" style={{ width: 400 }}>
        <Form layout="vertical" form={form} onFinish={handleLogin}>
          {field.map((item) => (
            <WriteItem key={item.form.name} {...item} />
          ))}
          <Form.Item>
            <Flex style={{ gap: 8 }} vertical>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  width: '100%',
                }}
                loading={isLoading}
              >
                Login
              </Button>
              <Button
                style={{
                  width: '100%',
                }}
                onClick={() => router.navigate({ to: '/sign-up' })}
              >
                Sign Up
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}
