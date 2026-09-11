export type AuthView = 'menu' | 'login' | 'register' | 'success'

export interface MinimalGameMenuProps {
  onLoginSuccess?: () => void
  onRegisterSuccess?: () => void
}
export interface RequestRegister {
  username: string
  email: string
  password: string
}

export const ANTD_INPUT_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 0,
  color: '#fff',
  boxShadow: 'none',
  paddingLeft: 0,
  paddingRight: 0,
}
