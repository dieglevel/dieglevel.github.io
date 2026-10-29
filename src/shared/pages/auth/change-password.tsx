import { useMemo, useState } from 'react'
import { Button, Form, Input, Typography, theme } from 'antd'
import { Check, KeyRound, Lightbulb, Lock, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useWatch } from 'antd/es/form/Form'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from '@tanstack/react-router'
import styles from './ChangePassword.module.css'
import { useMutationAuth } from '@/shared/api/auth/auth.mutation'

export interface ChangePasswordValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function ChangePassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { message } = useApp()
  const { token } = theme.useToken()
  const [form] = Form.useForm<ChangePasswordValues>()
  const [loading, setLoading] = useState(false)
  const { mChangePassword } = useMutationAuth()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const newPassword = useWatch('newPassword', form) ?? ''
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const currentPassword = useWatch('currentPassword', form) ?? ''

  const rules = useMemo(
    () => [
      {
        key: 'length',
        label: t('change-password.rules.length', {
          defaultValue: 'Ít nhất 8 ký tự',
        }),
        ok: newPassword.length >= 8,
      },
      {
        key: 'case',
        label: t('change-password.rules.case', {
          defaultValue: 'Có cả chữ hoa và chữ thường',
        }),
        ok: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
      },
      {
        key: 'number',
        label: t('change-password.rules.number', {
          defaultValue: 'Có ít nhất 1 chữ số',
        }),
        ok: /\d/.test(newPassword),
      },
      {
        key: 'special',
        label: t('change-password.rules.special', {
          defaultValue: 'Có ít nhất 1 ký tự đặc biệt (!@#$…)',
        }),
        ok: /[^A-Za-z0-9]/.test(newPassword),
      },
      {
        key: 'different',
        label: t('change-password.rules.different', {
          defaultValue: 'Khác mật khẩu hiện tại',
        }),
        ok: newPassword.length > 0 && newPassword !== currentPassword,
      },
    ],
    [newPassword, currentPassword, t],
  )

  // Độ mạnh: chỉ tính 4 quy tắc đầu (quy tắc "khác mật khẩu cũ" là điều kiện riêng)
  const score = rules.slice(0, 4).filter((r) => r.ok).length
  const levels = [
    { label: '', color: token.colorFillSecondary },
    {
      label: t('change-password.strength.weak', { defaultValue: 'Yếu' }),
      color: token.colorError,
    },
    {
      label: t('change-password.strength.fair', { defaultValue: 'Trung bình' }),
      color: token.colorWarning,
    },
    {
      label: t('change-password.strength.good', { defaultValue: 'Khá' }),
      color: token.colorPrimary,
    },
    {
      label: t('change-password.strength.strong', { defaultValue: 'Mạnh' }),
      color: token.colorSuccess,
    },
  ]
  const level = levels[newPassword ? Math.max(score, 1) : 0]

  const handleFinish = async (values: ChangePasswordValues) => {
    setLoading(true)
    try {
      await mChangePassword.mutateAsync(
        {
          body: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        },
        {
          onSuccess: () => {
            message.success(
              t('change-password.success', {
                defaultValue: 'Đã đổi mật khẩu thành công',
              }),
            )
            form.resetFields()
          },
        },
      )
    } catch {
      message.error(
        t('change-password.error', {
          defaultValue:
            'Không đổi được mật khẩu. Kiểm tra lại mật khẩu hiện tại.',
        }),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* ---------- Form ---------- */}
        <section className={styles.formSide}>
          <header className={styles.head}>
            <span className={styles.headIcon}>
              <KeyRound size={22} />
            </span>
            <div>
              <Typography.Title level={4} className={styles.title}>
                {t('change-password.title', { defaultValue: 'Đổi mật khẩu' })}
              </Typography.Title>
              <Typography.Text type="secondary" className={styles.subtitle}>
                {t('change-password.subtitle', {
                  defaultValue:
                    'Bạn sẽ cần đăng nhập lại trên các thiết bị khác.',
                })}
              </Typography.Text>
            </div>
          </header>

          <Form<ChangePasswordValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            autoComplete="off"
            onFinish={handleFinish}
          >
            <Form.Item
              name="currentPassword"
              label={t('change-password.current', {
                defaultValue: 'Mật khẩu hiện tại',
              })}
              rules={[
                {
                  required: true,
                  message: t('change-password.currentRequired', {
                    defaultValue: 'Nhập mật khẩu hiện tại',
                  }),
                },
              ]}
            >
              <Input.Password
                size="large"
                autoComplete="current-password"
                prefix={<Lock size={16} />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={t('change-password.new', { defaultValue: 'Mật khẩu mới' })}
              rules={[
                {
                  required: true,
                  message: t('change-password.newRequired', {
                    defaultValue: 'Nhập mật khẩu mới',
                  }),
                },
                {
                  validator: (_, value?: string) =>
                    !value || rules.every((r) => r.ok)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            t('change-password.newInvalid', {
                              defaultValue: 'Mật khẩu chưa đáp ứng đủ yêu cầu',
                            }),
                          ),
                        ),
                },
              ]}
            >
              <Input.Password
                size="large"
                autoComplete="new-password"
                prefix={<Lock size={16} />}
                placeholder="••••••••"
              />
            </Form.Item>

            {/* Thanh độ mạnh mật khẩu */}
            <div className={styles.meter} aria-live="polite">
              <div className={styles.meterBars}>
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={styles.meterBar}
                    style={
                      newPassword && i <= score
                        ? { background: level.color }
                        : newPassword && i === 1 && score === 0
                          ? { background: level.color }
                          : undefined
                    }
                  />
                ))}
              </div>
              <span
                className={styles.meterLabel}
                style={{ color: level.color }}
              >
                {level.label}
              </span>
            </div>

            <Form.Item
              name="confirmPassword"
              label={t('change-password.confirm', {
                defaultValue: 'Xác nhận mật khẩu mới',
              })}
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: t('change-password.confirmRequired', {
                    defaultValue: 'Nhập lại mật khẩu mới',
                  }),
                },
                ({ getFieldValue }) => ({
                  validator: (_, value?: string) =>
                    !value || getFieldValue('newPassword') === value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            t('change-password.confirmMismatch', {
                              defaultValue: 'Mật khẩu xác nhận không khớp',
                            }),
                          ),
                        ),
                }),
              ]}
            >
              <Input.Password
                size="large"
                autoComplete="new-password"
                prefix={<ShieldCheck size={16} />}
                placeholder="••••••••"
              />
            </Form.Item>

            <div className={styles.actions}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
              >
                {t('change-password.submit', {
                  defaultValue: 'Cập nhật mật khẩu',
                })}
              </Button>
            </div>
          </Form>
        </section>

        {/* ---------- Checklist yêu cầu ---------- */}
        <aside className={styles.rulesSide}>
          <Typography.Title level={5} className={styles.rulesTitle}>
            {t('change-password.rulesTitle', {
              defaultValue: 'Mật khẩu mới cần có',
            })}
          </Typography.Title>

          <ul className={styles.rules}>
            {rules.map((r) => (
              <li
                key={r.key}
                className={`${styles.rule} ${r.ok ? styles.ok : ''}`}
              >
                <span className={styles.ruleIcon}>
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>{r.label}</span>
              </li>
            ))}
          </ul>

          <div className={styles.tip}>
            <Lightbulb size={16} />
            <span>
              {t('change-password.tip', {
                defaultValue:
                  'Một cụm từ dài dễ nhớ (vd: ba-từ-ngẫu-nhiên-2026!) an toàn hơn một chuỗi ngắn phức tạp.',
              })}
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ChangePassword
