import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button, Card, Flex, Form, Input } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useForm } from 'antd/es/form/Form'
import type { WriteItemProps } from '@/shared/components/form/write-item'
import type { Request_SignUp } from '@/shared/api/auth/auth.dto'
import WriteItem from '@/shared/components/form/write-item'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'
import { UserRoleEnum } from '@/shared/auth/auth.type'

export const Route = createFileRoute('/(public)/sign-up')({
  component: RouteComponent,
})

type LoginField = WriteItemProps<React.ElementType, Request_SignUp>

function RouteComponent() {
  const router = useRouter()
  const [form] = useForm<Request_SignUp>()
  const { mSignup } = useMutationAuth()
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
    } as WriteItemProps<typeof Input, Request_SignUp>,
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
    } as WriteItemProps<typeof Input.Password, Request_SignUp>,
  ]

  const handleSignUp = (values: Request_SignUp) => {
    try {
      mSignup.mutate(
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

            message.success('Sign up successful')

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
    } catch (error) {
      message.error('Sign up failed. Please try again.')
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}
    >
      <Card title="Sign Up" style={{ width: 400 }}>
        <Form layout="vertical" form={form} onFinish={handleSignUp}>
          {field.map((item) => (
            <WriteItem key={item.form.name} {...item} />
          ))}
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              style={{
                width: '100%',
              }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}
