import { Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  ChevronRight,
  Lock,
  LogIn,
  LogOut,
  Mail,
  User,
  UserPlus,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Form, Input } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { Request_Login, Request_SignUp } from '@/shared/api/auth/auth.dto'
import type { AuthView, MinimalGameMenuProps } from './auth-menu-type'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { UserRoleEnum } from '@/shared/auth/auth.type'
import { LogoutService } from '@/shared/auth/logout.service'
import { useAuthStore } from '@/shared/auth/auth.store'
import { getAppMenu } from '@/shared/common/menu'

export function MinimalGameMenu({
  onLoginSuccess,
  onRegisterSuccess,
}: MinimalGameMenuProps) {
  const [openGroup, setOpenGroup] = useState<string | null>('finance')
  const [authView, setAuthView] = useState<AuthView>('menu')
  const [, setSuccessMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const [loginForm] = Form.useForm<Request_Login>()
  const [registerForm] = Form.useForm<Request_SignUp>()

  const { isAuthenticated } = useAuthStore()
  const AppMenu = getAppMenu(isAuthenticated)

  const { mLogin, mLogout } = useMutationAuth()
  const { message } = useApp()
  const router = useRouter()

  const switchView = (view: AuthView) => {
    loginForm.resetFields()
    registerForm.resetFields()
    setAuthView(view)
  }

  const triggerSuccess = (
    msg: string,
    nextView: AuthView = 'menu',
    callback?: () => void,
  ) => {
    setSuccessMessage(msg)
    setAuthView('success')
    if (callback) callback()

    setTimeout(() => {
      switchView(nextView)
    }, 300)
  }

  const handleLogout = () => {
    mLogout.mutate(
      {},
      {
        onSuccess: () => {
          LogoutService.logout(false)
          message.success('Logout successful')
        },
      },
    )
    triggerSuccess('LOGGED OUT', 'menu')
  }

  const handleLoginSubmit = (values: Request_Login) => {
    setIsLoading(true)
    mLogin.mutate(
      {
        body: {
          identifier: values.identifier,
          password: values.password,
        },
      },
      {
        onSuccess(data) {
          const response = data

          if (response.data.user.role === UserRoleEnum.CUSTOMER) {
            message.error(
              'You do not have permission to access this application.',
            )
            setIsLoading(false)
            return
          }

          AuthTokenService.setTokens(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.user,
          )

          setIsLoading(false)
          triggerSuccess('ACCESS GRANTED', 'menu', onLoginSuccess)
          router.invalidate()
        },
        onError() {
          setIsLoading(false)
        },
      },
    )
  }

  const handleRegisterSubmit = (_values: Request_SignUp) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      triggerSuccess('ACCOUNT CREATED', 'login', onRegisterSuccess)
    }, 800)
  }

  const antdInputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 0,
    color: '#fff',
    boxShadow: 'none',
    paddingLeft: 0,
    paddingRight: 0,
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '60px',
        right: '5%',
        zIndex: 10,
        width: '260px',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className="minimal-game-menu"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 12px 8px 20px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {authView === 'menu' && (
            <motion.nav
              key="main-menu"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              <motion.div
                style={{
                  display: 'flex',
                  gap: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                }}
              >
                {!isAuthenticated ? (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => switchView('login')}
                      style={{
                        border: 'none',
                        padding: 0,
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 800,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => switchView('register')}
                      style={{
                        border: 'none',
                        padding: 0,
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        color: '#ff6b4b',
                        fontSize: '14px',
                        fontWeight: 800,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserPlus size={16} />
                      <span>Register</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      border: 'none',
                      padding: 0,
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      color: '#ff6b4b',
                      fontSize: '14px',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </motion.button>
                )}
              </motion.div>

              {AppMenu.map((group, index) => {
                const isOpen = openGroup === group.id
                const hasChildren = !!group.children?.length

                return (
                  <motion.div
                    key={group.id}
                    style={{ display: 'flex', flexDirection: 'column' }}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <button
                      type="button"
                      style={{
                        position: 'relative',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        padding: '4px 0',
                        cursor: hasChildren ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        fontSize: '18px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: 'white',
                      }}
                      onClick={() => {
                        if (!hasChildren) return
                        setOpenGroup((current) =>
                          current === group.id ? null : group.id,
                        )
                      }}
                    >
                      <motion.span
                        style={{
                          position: 'absolute',
                          right: 'calc(100% + 8px)',
                          width: '3px',
                          borderRadius: '999px',
                          background: '#ff4b2b',
                        }}
                        animate={{
                          height: isOpen ? 22 : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: isOpen
                            ? '#ffffff'
                            : 'rgba(255, 255, 255, 0.55)',
                        }}
                      >
                        <span style={{ display: 'flex' }}>{group.icon}</span>
                        <span>{group.label}</span>
                      </div>

                      {hasChildren && (
                        <motion.span
                          style={{ display: 'flex', opacity: 0.75 }}
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={18} />
                        </motion.span>
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {hasChildren && isOpen && (
                        <motion.div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            paddingLeft: '16px',
                            overflow: 'hidden',
                          }}
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                            marginTop: 10,
                          }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {group.children!.map((item) => (
                            <Link
                              key={item.id}
                              to={item.link || '/'}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: 'rgba(255, 255, 255, 0.6)',
                                textDecoration: 'none',
                                fontSize: '15px',
                                padding: '3px 0',
                              }}
                            >
                              {({ isActive }) => (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: isActive
                                      ? '#ff4b2b'
                                      : 'rgba(255, 255, 255, 0.6)',
                                  }}
                                >
                                  <span style={{ display: 'flex' }}>
                                    {item.icon}
                                  </span>
                                  <span>{item.label}</span>
                                </div>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.nav>
          )}

          {authView === 'login' && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                  paddingBottom: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => switchView('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
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
                  }}
                >
                  LOGIN
                </span>
                <button
                  type="button"
                  onClick={() => switchView('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <Form
                form={loginForm}
                layout="vertical"
                onFinish={handleLoginSubmit}
                requiredMark={false}
              >
                <Form.Item
                  label={
                    <span
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    >
                      IDENTIFIER
                    </span>
                  }
                  name="identifier"
                  rules={[
                    { required: true, message: 'Please input identifier!' },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    prefix={<User size={16} color="rgba(255,255,255,0.4)" />}
                    placeholder="Username / Email"
                    style={antdInputStyle}
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    >
                      PASSWORD
                    </span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input.Password
                    prefix={<Lock size={16} color="rgba(255,255,255,0.4)" />}
                    placeholder="••••••••"
                    style={antdInputStyle}
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
                      color: '#ff4b2b',
                      fontWeight: 800,
                      letterSpacing: '1.5px',
                    }}
                  >
                    SUBMIT LOGIN
                  </Button>
                </Form.Item>
              </Form>
            </motion.div>
          )}

          {authView === 'register' && (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                  paddingBottom: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => switchView('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
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
                  }}
                >
                  REGISTER
                </span>
                <button
                  type="button"
                  onClick={() => switchView('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegisterSubmit}
                requiredMark={false}
              >
                <Form.Item
                  label={
                    <span
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    >
                      USERNAME
                    </span>
                  }
                  name="username"
                  rules={[
                    { required: true, message: 'Please input username!' },
                  ]}
                  style={{ marginBottom: 10 }}
                >
                  <Input
                    prefix={<User size={16} color="rgba(255,255,255,0.4)" />}
                    placeholder="Username"
                    style={antdInputStyle}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    >
                      EMAIL
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: 'Please input email!' },
                    { type: 'email', message: 'Invalid email format!' },
                  ]}
                  style={{ marginBottom: 10 }}
                >
                  <Input
                    prefix={<Mail size={16} color="rgba(255,255,255,0.4)" />}
                    placeholder="Email address"
                    style={antdInputStyle}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    >
                      PASSWORD
                    </span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input.Password
                    prefix={<Lock size={16} color="rgba(255,255,255,0.4)" />}
                    placeholder="••••••••"
                    style={antdInputStyle}
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
                      color: '#ff6b4b',
                      fontWeight: 800,
                      letterSpacing: '1.5px',
                    }}
                  >
                    CREATE ACCOUNT
                  </Button>
                </Form.Item>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
