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
  const [successMessage, setSuccessMessage] = useState<string>('')
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

  // Hàm kích hoạt hiệu ứng thành công trước khi chuyển màn hình
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

  // Tùy chỉnh style cho Antd Input không dùng viền/background
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
        right: '10%',
        zIndex: 10,
        width: '260px',
        userSelect: 'none',
      }}
      initial={{
        opacity: 0,
        y: -20,
        filter: 'blur(8px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Top fade */}
      <div
        style={{
          position: 'absolute',
          top: -2,
          left: -30,
          right: -30,
          height: 36,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

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
          padding: '8px 12px 8px 30px',
          scrollbarWidth: 'none',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* ================= VIEW 1: MENU CHÍNH ================= */}
          {authView === 'menu' && (
            <motion.nav
              key="main-menu"
              initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* Quick Action Bar */}
              <motion.div
                style={{
                  display: 'flex',
                  gap: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
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
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
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
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
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
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </motion.button>
                )}
              </motion.div>

              {/* App Menu List */}
              {AppMenu.map((group, index) => {
                const isOpen = openGroup === group.id
                const hasChildren = !!group.children?.length

                return (
                  <motion.div
                    key={group.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    initial={{
                      opacity: 0,
                      x: 24,
                      filter: 'blur(6px)',
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() => {
                      if (hasChildren) {
                        setOpenGroup(group.id)
                      }
                    }}
                  >
                    <motion.button
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
                        userSelect: 'none',
                        color: 'white',
                      }}
                      whileHover={
                        hasChildren
                          ? {
                              x: -5,
                              scale: 1.04,
                              transition: {
                                duration: 0.2,
                                ease: 'easeOut',
                              },
                            }
                          : undefined
                      }
                      whileTap={hasChildren ? { scale: 0.98 } : undefined}
                      onClick={() => {
                        if (!hasChildren) return

                        setOpenGroup((current) =>
                          current === group.id ? null : group.id,
                        )
                      }}
                    >
                      {/* Active group indicator */}
                      <motion.span
                        style={{
                          position: 'absolute',
                          right: 'calc(100% + 12px)',
                          width: '3px',
                          borderRadius: '999px',
                          background: '#ff4b2b',
                          boxShadow: '0 0 12px rgba(255, 75, 43, 0.65)',
                        }}
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: isOpen ? 22 : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.25,
                          ease: 'easeOut',
                        }}
                      />

                      <motion.div
                        animate={{
                          color: isOpen
                            ? '#ffffff'
                            : 'rgba(255, 255, 255, 0.55)',
                          textShadow: isOpen
                            ? '0 0 14px rgba(255, 255, 255, 0.35)'
                            : '0 0 0 rgba(255,255,255,0)',
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <motion.span
                          animate={{
                            scale: isOpen ? 1.08 : 1,
                            rotate: isOpen ? -3 : 0,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 20,
                          }}
                          style={{
                            display: 'flex',
                          }}
                        >
                          {group.icon}
                        </motion.span>

                        <span>{group.label}</span>
                      </motion.div>

                      {/* Chevron */}
                      {hasChildren && (
                        <motion.span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.75,
                          }}
                          animate={{
                            rotate: isOpen ? 90 : 0,
                            x: isOpen ? 2 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <ChevronRight size={18} />
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Submenu */}
                    <AnimatePresence initial={false} mode="popLayout">
                      {hasChildren && isOpen && (
                        <motion.div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            paddingLeft: '20px',
                            overflow: 'hidden',
                            transformOrigin: 'top',
                          }}
                          initial={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                            scaleY: 0.85,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                            marginTop: 12,
                            scaleY: 1,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                            scaleY: 0.85,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {group.children!.map((item, childIndex) => (
                            <motion.div
                              key={item.id}
                              initial={{
                                opacity: 0,
                                x: 18,
                                filter: 'blur(5px)',
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                filter: 'blur(0px)',
                              }}
                              exit={{
                                opacity: 0,
                                x: 10,
                                filter: 'blur(4px)',
                              }}
                              transition={{
                                duration: 0.28,
                                delay: childIndex * 0.055,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <Link
                                to={item.link || '/'}
                                style={{
                                  position: 'relative',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  textDecoration: 'none',
                                  fontSize: '15px',
                                  fontWeight: 500,
                                  letterSpacing: '0.5px',
                                  padding: '3px 0',
                                }}
                              >
                                {({ isActive }) => (
                                  <motion.div
                                    style={{
                                      position: 'relative',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      width: '100%',
                                    }}
                                    animate={{
                                      x: isActive ? 4 : 0,
                                      color: isActive
                                        ? '#ff4b2b'
                                        : 'rgba(255, 255, 255, 0.6)',
                                    }}
                                    whileHover={{
                                      x: 9,
                                      color: '#ff6b4b',
                                    }}
                                  >
                                    <span style={{ display: 'flex' }}>
                                      {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                  </motion.div>
                                )}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.nav>
          )}

          {/* ================= VIEW 2: FORM LOGIN (ANTD) ================= */}
          {authView === 'login' && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
                  onClick={() => switchView('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
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
                  LOGIN
                </span>
                <button
                  type="button"
                  onClick={() => switchView('menu')}
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

              {/* Antd Form Login */}
              <Form
                form={loginForm}
                layout="vertical"
                onFinish={handleLoginSubmit}
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
                      Identifier
                    </span>
                  }
                  name="identifier"
                  rules={[
                    { required: true, message: 'Please input identifier!' },
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
                    placeholder="Username / Email"
                    style={antdInputStyle}
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
                      Password
                    </span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: 'Please input password!' },
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
                    SUBMIT LOGIN
                  </Button>
                </Form.Item>
              </Form>
            </motion.div>
          )}

          {/* ================= VIEW 3: FORM REGISTER (ANTD) ================= */}
          {authView === 'register' && (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
                  onClick={() => switchView('menu')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
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
                  onClick={() => switchView('menu')}
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

              {/* Antd Form Register */}
              <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegisterSubmit}
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
                  rules={[
                    { required: true, message: 'Please input username!' },
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
                    placeholder="Username"
                    style={antdInputStyle}
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
                    { type: 'email', message: 'Invalid email format!' },
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
                    style={antdInputStyle}
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
                  rules={[
                    { required: true, message: 'Please input password!' },
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: -2,
          left: -30,
          right: -30,
          height: 36,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </motion.div>
  )
}
