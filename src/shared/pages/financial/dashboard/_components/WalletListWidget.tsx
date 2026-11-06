import React, { useMemo, useState } from 'react'
import { Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Wallet } from 'lucide-react'
import { WidgetCard } from './WidgetCard'
import { SegmentedBar } from './SegmentedBar'
import { MAX_CATEGORY_SLOTS, getVizColors } from './viz'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { convertCurrency } from '@/shared/utils/helper/format-money'
import { IconRenderer } from '@/shared/components/icon-picker/icon-re-render'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

const { Text } = Typography

interface WalletListWidgetProps {
  wallets: Array<WalletOverviewItem>
  onNavigateToWallet: () => void
}

/** Danh sách ví + thanh phân bổ số dư (chỉ các ví có số dư dương) */
export const WalletListWidget: React.FC<WalletListWidgetProps> = ({
  wallets,
  onNavigateToWallet,
}) => {
  const { t } = useTranslation('dashboard')
  const { mode } = useThemeMode()
  const { state, radius } = getTokens(mode)
  const viz = getVizColors(mode)
  const [activeKey, setActiveKey] = useState<string | number | null>(null)

  const rows = useMemo(() => {
    const sorted = [...wallets].sort(
      (a, b) => Number(b.balance) - Number(a.balance),
    )
    // Màu theo ví (màu người dùng đặt) → nếu không có thì theo slot cố định; quá 5 ví → xám
    return sorted.map((w, i) => ({
      ...w,
      balance: Number(w.balance || 0),
      swatch:
        w.color || (i < MAX_CATEGORY_SLOTS ? viz.categorical[i] : viz.other),
    }))
  }, [wallets, viz])

  const positiveTotal = rows.reduce((s, w) => s + Math.max(0, w.balance), 0)

  return (
    <WidgetCard
      icon={<Wallet size={18} />}
      title={t('wallets.title')}
      action={{ label: t('wallets.manage'), onClick: onNavigateToWallet }}
    >
      {rows.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            padding: '40px 0',
          }}
        >
          <Empty description={t('wallets.empty')} />
        </div>
      ) : (
        <>
          {positiveTotal > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Text
                type="secondary"
                style={{ display: 'block', marginBottom: 6 }}
              >
                {t('wallets.allocation')}
              </Text>
              <SegmentedBar
                ariaLabel={t('wallets.allocation')}
                activeKey={activeKey}
                onHover={setActiveKey}
                segments={rows.map((w) => ({
                  key: w.id,
                  label: w.name,
                  value: Math.max(0, w.balance),
                  color: w.swatch,
                  detail: `${convertCurrency(w.balance)} · ${Math.round((Math.max(0, w.balance) / positiveTotal) * 100)}%`,
                }))}
              />
            </div>
          )}

          <ul
            style={{ listStyle: 'none', margin: 0, padding: 0 }}
            onMouseLeave={() => setActiveKey(null)}
          >
            {rows.map((w) => (
              <li
                key={w.id}
                onMouseEnter={() => setActiveKey(w.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 8px',
                  borderRadius: radius.sm,
                  background: activeKey === w.id ? state.hover : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: radius.md,
                    display: 'grid',
                    placeItems: 'center',
                    background: `color-mix(in srgb, ${w.swatch} 16%, transparent)`,
                    color: w.swatch,
                  }}
                >
                  {w.icon ? (
                    <IconRenderer iconName={w.icon} />
                  ) : (
                    <Wallet size={18} />
                  )}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text strong ellipsis style={{ display: 'block' }}>
                    {w.name}
                  </Text>
                  <Text type="secondary">
                    {w.type || t('wallets.defaultType')}
                  </Text>
                </div>
                <Text strong type={w.balance < 0 ? 'danger' : undefined}>
                  {convertCurrency(w.balance)}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </WidgetCard>
  )
}
