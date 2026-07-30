import FloatingMenu from './floating-menu'

interface WalletLayoutProps {
  children: React.ReactNode
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  return (
    <>
      {children}
      <FloatingMenu />
    </>
  )
}
