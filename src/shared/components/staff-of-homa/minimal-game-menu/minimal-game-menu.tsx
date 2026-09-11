import { Link } from '@tanstack/react-router'
import { App } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, LogIn, LogOut, UserPlus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import type { AuthView, MinimalGameMenuProps } from './auth-menu-type'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'
import { useAuthStore } from '@/shared/auth/auth.store'
import { LogoutService } from '@/shared/auth/logout.service'
import { getAppMenu } from '@/shared/common/menu'

export function MinimalGameMenu({
  onLoginSuccess,
  onRegisterSuccess,
}: MinimalGameMenuProps) {
  const [openGroup, setOpenGroup] = useState<string | null>('finance')
  const [authView, setAuthView] = useState<AuthView>('menu')

  const { isAuthenticated } = useAuthStore()
  const AppMenu = useMemo(() => getAppMenu(isAuthenticated), [isAuthenticated])

  const { mLogout } = useMutationAuth()
  const { message } = App.useApp()

  const switchView = useCallback((view: AuthView) => {
    setAuthView(view)
  }, [])

  const handleLogout = useCallback(() => {
    mLogout.mutate(
      {},
      {
        onSuccess: () => {
          LogoutService.logout(false)
          message.success('Logout successful')
          setAuthView('menu')
        },
      },
    )
  }, [mLogout, message])

  const handleLoginSuccess = useCallback(() => {
    setAuthView('menu')
    onLoginSuccess?.()
  }, [onLoginSuccess])

  const handleRegisterSuccess = useCallback(() => {
    onRegisterSuccess?.()
    switchView('login')
  }, [onRegisterSuccess, switchView])

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '60px',
        right: '10%',
        zIndex: 10,
        width: 'max-content',
        maxWidth: 'calc(100vw - 40px)',
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
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          overflowX: 'visible',
          padding: '8px 12px 8px 30px',
          scrollbarWidth: 'none',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {authView === 'menu' && (
            <motion.nav
              key="main-menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Mapping App Menu */}
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
                        gap: '8px',
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
                        {/* Icon micro animation */}
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
                                activeProps={{
                                  style: {
                                    color: '#ff4b2b',
                                    fontWeight: 700,
                                    textShadow:
                                      '0 0 10px rgba(255, 75, 43, 0.6)',
                                  },
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
                                    transition={{
                                      duration: 0.2,
                                      ease: 'easeOut',
                                    }}
                                    whileHover={{
                                      x: 9,
                                      color: '#ff6b4b',
                                    }}
                                  >
                                    {/* Active item indicator */}
                                    <motion.span
                                      style={{
                                        position: 'absolute',
                                        right: 'calc(100% + 8px)',
                                        width: '3px',
                                        borderRadius: '999px',
                                        background: '#ff4b2b',
                                        boxShadow:
                                          '0 0 8px rgba(255, 75, 43, 0.7)',
                                      }}
                                      initial={false}
                                      animate={{
                                        height: isActive ? 14 : 0,
                                        opacity: isActive ? 1 : 0,
                                      }}
                                      transition={{
                                        duration: 0.2,
                                      }}
                                    />

                                    {/* Icon */}
                                    <motion.span
                                      animate={{
                                        scale: isActive ? 1.08 : 1,
                                      }}
                                      transition={{
                                        type: 'spring',
                                        stiffness: 450,
                                        damping: 22,
                                      }}
                                      style={{
                                        display: 'flex',
                                      }}
                                    >
                                      {item.icon}
                                    </motion.span>

                                    <span>{item.label}</span>

                                    {/* Hover underline sweep */}
                                    <motion.span
                                      style={{
                                        position: 'absolute',
                                        left: 0,
                                        bottom: 0,
                                        height: '1px',
                                        width: '100%',
                                        background: 'rgba(255, 107, 75, 0.65)',
                                        transformOrigin: 'left',
                                      }}
                                      initial={{
                                        scaleX: 0,
                                        opacity: 0,
                                      }}
                                      whileHover={{
                                        scaleX: 1,
                                        opacity: 1,
                                      }}
                                      transition={{
                                        duration: 0.25,
                                        ease: 'easeOut',
                                      }}
                                    />
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

              {/* Separator Line */}
              <div
                style={{
                  height: '1px',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)',
                  margin: '8px 0',
                }}
              />

              {/* Auth Button Action Bar */}
              <motion.div
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
                  delay: AppMenu.length * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {!isAuthenticated ? (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => switchView('login')}
                      style={{
                        flex: 1,
                        position: 'relative',
                        background: 'rgba(255, 75, 43, 0.1)',
                        border: '1px solid rgba(255, 75, 43, 0.4)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#ff4b2b',
                        boxShadow: '0 0 10px rgba(255, 75, 43, 0.15)',
                      }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: 'rgba(255, 75, 43, 0.2)',
                        borderColor: '#ff4b2b',
                        boxShadow: '0 0 16px rgba(255, 75, 43, 0.4)',
                        color: '#ffffff',
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => switchView('register')}
                      style={{
                        flex: 1,
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#ffffff',
                      }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderColor: '#ffffff',
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
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
                      width: '100%',
                      position: 'relative',
                      background: 'rgba(255, 75, 43, 0.1)',
                      border: '1px solid rgba(255, 75, 43, 0.4)',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      color: '#ff4b2b',
                      boxShadow: '0 0 10px rgba(255, 75, 43, 0.15)',
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: 'rgba(255, 75, 43, 0.2)',
                      borderColor: '#ff4b2b',
                      boxShadow: '0 0 16px rgba(255, 75, 43, 0.4)',
                      color: '#ffffff',
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </motion.button>
                )}
              </motion.div>
            </motion.nav>
          )}

          {/* Login Form View */}
          {authView === 'login' && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <LoginForm
                onBack={() => switchView('menu')}
                onSuccess={handleLoginSuccess}
              />
            </motion.div>
          )}

          {/* Register Form View */}
          {authView === 'register' && (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <RegisterForm
                onBack={() => switchView('menu')}
                onSuccessToLogin={handleRegisterSuccess}
              />
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

export default MinimalGameMenu
