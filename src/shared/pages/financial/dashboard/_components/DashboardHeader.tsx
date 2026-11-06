import React from 'react'
import {
  Button,
  DatePicker,
  Segmented,
  Select,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { WalletOverviewItem } from '@/shared/api/financial/dashboard/dashboard.type'
import { DashboardTimeFrame } from '@/shared/api/financial/dashboard/dashboard.type'

const { Title, Text } = Typography

interface DashboardHeaderProps {
  timeFrame: DashboardTimeFrame
  setTimeFrame: (tf: DashboardTimeFrame) => void
  /** 0 = kỳ hiện tại, -1 = kỳ trước, ... */
  offset: number
  setOffset: (offset: number) => void
  selectedWalletId?: number
  setSelectedWalletId: (id?: number) => void
  wallets: Array<WalletOverviewItem>
  period?: {
    startDate: string
    endDate: string
    cycleStartDate: number
  }
  onNavigateToCreateTransaction: () => void
}

/** Tiêu đề + MỘT hàng bộ lọc dùng chung cho toàn bộ biểu đồ bên dưới */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeFrame,
  setTimeFrame,
  offset,
  setOffset,
  selectedWalletId,
  setSelectedWalletId,
  wallets,
  period,
  onNavigateToCreateTransaction,
}) => {
  const { t } = useTranslation('dashboard')

  const periodLabel =
    period?.startDate && period.endDate
      ? `${dayjs(period.startDate).format('DD/MM')} – ${dayjs(period.endDate).format('DD/MM/YYYY')}`
      : null

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 16,
        marginBottom: 20,
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0 }}>
          {t('header.title')}
        </Title>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: 4,
          }}
        >
          <Text type="secondary">{t('header.subtitle')}</Text>
          {periodLabel && (
            <Tag
              icon={<Calendar size={12} aria-hidden />}
              style={{
                margin: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {timeFrame === DashboardTimeFrame.MONTHLY &&
              period &&
              period.cycleStartDate > 1
                ? `${t('header.cycleDayNotice', { day: period.cycleStartDate })} · ${periodLabel}`
                : periodLabel}
            </Tag>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Segmented<DashboardTimeFrame>
          value={timeFrame}
          onChange={setTimeFrame}
          options={[
            { value: DashboardTimeFrame.WEEKLY, label: t('header.week') },
            { value: DashboardTimeFrame.MONTHLY, label: t('header.month') },
            { value: DashboardTimeFrame.YEARLY, label: t('header.year') },
          ]}
        />
        <PeriodNavigator
          timeFrame={timeFrame}
          offset={offset}
          setOffset={setOffset}
          periodStart={period?.startDate}
        />
        <Select
          aria-label={t('header.allWallets')}
          placeholder={t('header.allWallets')}
          allowClear
          value={selectedWalletId}
          onChange={(val) => setSelectedWalletId(val)}
          style={{ minWidth: 160 }}
          options={wallets.map((w) => ({ value: w.id, label: w.name }))}
        />
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          onClick={onNavigateToCreateTransaction}
        >
          {t('header.newTransaction')}
        </Button>
      </div>
    </div>
  )
}

const UNIT = {
  [DashboardTimeFrame.WEEKLY]: 'week',
  [DashboardTimeFrame.MONTHLY]: 'month',
  [DashboardTimeFrame.YEARLY]: 'year',
  [DashboardTimeFrame.CUSTOM]: 'month',
} as const satisfies Record<DashboardTimeFrame, 'week' | 'month' | 'year'>

interface PeriodNavigatorProps {
  timeFrame: DashboardTimeFrame
  offset: number
  setOffset: (offset: number) => void
  /** Ngày bắt đầu của kỳ đang xem (BE trả về, đã tính chu kỳ tháng) */
  periodStart?: string
}

/**
 * ‹ [chọn kỳ] › + "Về kỳ hiện tại". Kỳ được BE tính theo offset nên vẫn đúng
 * với chu kỳ tháng bắt đầu giữa tháng.
 */
const PeriodNavigator: React.FC<PeriodNavigatorProps> = ({
  timeFrame,
  offset,
  setOffset,
  periodStart,
}) => {
  const { t } = useTranslation('dashboard')
  const unit = UNIT[timeFrame]
  const isCurrent = offset === 0

  // Chọn trên lịch → quy ra offset so với kỳ đang xem
  const jumpTo = (picked: Dayjs | null) => {
    if (!picked || !periodStart) return
    const current = dayjs(periodStart)
    const diff =
      unit === 'week'
        ? Math.round(
            picked.startOf('week').diff(current.startOf('week'), 'day') / 7,
          )
        : picked.startOf(unit).diff(current.startOf(unit), unit)
    setOffset(Math.min(0, offset + diff))
  }

  const pickerFormat =
    unit === 'week' ? '[W]w · YYYY' : unit === 'year' ? 'YYYY' : 'MM/YYYY'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Tooltip title={t('header.prevPeriod')}>
        <Button
          aria-label={t('header.prevPeriod')}
          icon={<ChevronLeft size={16} />}
          onClick={() => setOffset(offset - 1)}
        />
      </Tooltip>
      <DatePicker
        picker={unit}
        aria-label={t('header.pickPeriod')}
        value={periodStart ? dayjs(periodStart) : null}
        format={pickerFormat}
        allowClear={false}
        inputReadOnly
        disabledDate={(d) => d.isAfter(dayjs(), unit)}
        onChange={jumpTo}
        style={{ width: unit === 'year' ? 96 : 128 }}
      />
      <Tooltip title={t('header.nextPeriod')}>
        <Button
          aria-label={t('header.nextPeriod')}
          icon={<ChevronRight size={16} />}
          disabled={isCurrent}
          onClick={() => setOffset(Math.min(0, offset + 1))}
        />
      </Tooltip>
      {!isCurrent && (
        <Button type="link" onClick={() => setOffset(0)}>
          {t(`header.backToCurrent.${unit}`)}
        </Button>
      )}
    </div>
  )
}
