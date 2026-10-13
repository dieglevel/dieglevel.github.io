import { useEffect, useState } from 'react'
import {
  Alert,
  Tooltip as AntTooltip,
  Badge,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  theme as antdTheme,
} from 'antd'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Server,
} from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import type {
  DisksItem,
  ISystemInformation,
} from '@/shared/api/system-information/useGetSystemInformation'
import type { ThemeMode } from '@/shared/common/design-token'
import { useGetSystemInformation } from '@/shared/api/system-information/useGetSystemInformation'
import { useThemeMode } from '@/shared/provider/antd-theme.provider'
import { getTokens } from '@/shared/common/design-token'

// Giả định hook useThemeMode lấy mode hiện tại của app

const { Title, Text } = Typography

// ---------------------------------------------------------------------------
// Config & Constants
// ---------------------------------------------------------------------------
const POLL_INTERVAL_MS = 3000
const HISTORY_SIZE = 60 // 3 phút dữ liệu (60 samples * 3s)

interface Sample {
  time: string
  cpu: number
  ram: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

function formatBytes(bytes: number, digits = 2): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  )
  return `${(bytes / 1024 ** i).toFixed(digits)} ${UNITS[i]}`
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}d ${h}h ${m}m`
}

function getLevelColor(
  percent: number,
  tokens: ReturnType<typeof getTokens>,
): string {
  if (percent >= 85) return tokens.colors.error.base
  if (percent >= 70) return tokens.colors.warning.base
  return tokens.colors.success.base
}

function getLevelLabel(percent: number): string {
  if (percent >= 85) return 'Nguy hiểm'
  if (percent >= 70) return 'Cảnh báo'
  return 'Ổn định'
}

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString('vi-VN', { hour12: false })
}

// ---------------------------------------------------------------------------
// Live Status Component
// ---------------------------------------------------------------------------
function LiveStatus({
  isFetching,
  isError,
  updatedAt,
}: {
  isFetching: boolean
  isError: boolean
  updatedAt: number
}) {
  return (
    <Space size="middle" align="center">
      <Badge
        status={isError ? 'error' : isFetching ? 'processing' : 'success'}
        text={
          <Text strong style={{ fontSize: 13 }}>
            {isError ? 'Mất kết nối' : 'Trực tiếp'}
          </Text>
        }
      />
      <Text type="secondary" style={{ fontSize: 12 }}>
        Lần cuối: {updatedAt ? formatClock(updatedAt) : '--:--:--'}
      </Text>
    </Space>
  )
}

// ---------------------------------------------------------------------------
// Custom Chart Tooltip (Dynamic Theme)
// ---------------------------------------------------------------------------
const CustomChartTooltip = ({ active, payload, label, mode }: any) => {
  const appTokens = getTokens(mode)
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: appTokens.background.elevated,
          padding: '8px 12px',
          border: `1px solid ${appTokens.border.base}`,
          borderRadius: appTokens.radius.md,
          boxShadow: appTokens.shadow.elevated,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            display: 'block',
            marginBottom: 4,
            color: appTokens.text.secondary,
          }}
        >
          {label}
        </Text>
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            style={{ color: entry.color, fontSize: 13, fontWeight: 600 }}
          >
            {entry.name}: {entry.value}%
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export function SystemInfoPage() {
  const { token: antdTok } = antdTheme.useToken()
  const { mode } = useThemeMode() as { mode: ThemeMode }
  const appTokens = getTokens(mode)

  const { data, isLoading, isFetching, isError, error, dataUpdatedAt } =
    useGetSystemInformation({
      options: {
        refetchInterval: POLL_INTERVAL_MS,
      },
    })

  const rawData = data?.data
  const systemData: ISystemInformation | undefined = Array.isArray(rawData)
    ? rawData[0]
    : rawData

  const [history, setHistory] = useState<Array<Sample>>([])

  useEffect(() => {
    if (!systemData || !dataUpdatedAt) return
    const ram =
      (systemData.memory.usedBytes / systemData.memory.totalBytes) * 100
    setHistory((prev) =>
      [
        ...prev,
        {
          time: formatClock(dataUpdatedAt),
          cpu: Number(systemData.cpu.usagePercent.toFixed(1)),
          ram: Number(ram.toFixed(1)),
        },
      ].slice(-HISTORY_SIZE),
    )
  }, [dataUpdatedAt])

  return (
    <div
      style={{
        width: '100%',
        flex: 1,
        padding: '24px 16px',
        backgroundColor: appTokens.background.layout,
        transition: `background-color ${appTokens.transition.base}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <Space align="center" size="small">
          <Activity size={24} color={appTokens.colors.primary.base} />
          <Title level={3} style={{ margin: 0, color: appTokens.text.primary }}>
            System Monitor
          </Title>
        </Space>
        {systemData && (
          <LiveStatus
            isFetching={isFetching}
            isError={isError}
            updatedAt={dataUpdatedAt}
          />
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card
          bordered={false}
          style={{
            textAlign: 'center',
            padding: 48,
            borderRadius: appTokens.radius.lg,
            backgroundColor: appTokens.background.base,
            boxShadow: appTokens.shadow.elevated,
          }}
        >
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text style={{ color: appTokens.text.secondary }}>
              Đang tải dữ liệu hệ thống...
            </Text>
          </div>
        </Card>
      )}

      {/* Error Banner */}
      {isError && (
        <Alert
          type="error"
          showIcon
          message="Lỗi kết nối máy chủ"
          description={
            (error as Error | null)?.message ||
            'Không thể làm mới dữ liệu hệ thống. Đang kết nối lại...'
          }
          style={{ marginBottom: 20, borderRadius: appTokens.radius.md }}
        />
      )}

      {/* Dashboard Content */}
      {systemData ? (
        <Dashboard data={systemData} history={history} mode={mode} />
      ) : (
        !isLoading &&
        !isError && (
          <Card
            bordered={false}
            style={{
              textAlign: 'center',
              padding: 48,
              backgroundColor: appTokens.background.base,
              borderRadius: appTokens.radius.lg,
            }}
          >
            <Empty description="Chưa có dữ liệu hệ thống" />
          </Card>
        )
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard Component
// ---------------------------------------------------------------------------
function Dashboard({
  data,
  history,
  mode,
}: {
  data: ISystemInformation
  history: Array<Sample>
  mode: ThemeMode
}) {
  const { token: antdTok } = antdTheme.useToken()
  const appTokens = getTokens(mode)

  const { os, cpu, memory, disks = [] } = data

  const memPercent = (memory.usedBytes / memory.totalBytes) * 100
  const cpuPercent = cpu.usagePercent
  const maxDiskUsage = disks.length
    ? Math.max(0, ...disks.map((d) => d.usagePercent))
    : 0

  const usedShown = Math.min(memory.usedBytes, memory.totalBytes)
  const freeShown = Math.min(memory.freeBytes, memory.totalBytes - usedShown)
  const otherShown = Math.max(memory.totalBytes - usedShown - freeShown, 0)

  const memorySlices = [
    {
      name: 'Đã dùng',
      bytes: memory.usedBytes,
      shown: usedShown,
      color: getLevelColor(memPercent, appTokens),
    },
    {
      name: 'Khả dụng',
      bytes: memory.freeBytes,
      shown: freeShown,
      color: appTokens.colors.success.base,
    },
    ...(otherShown > 0
      ? [
          {
            name: 'Bộ nhớ đệm / Khác',
            bytes: otherShown,
            shown: otherShown,
            color: appTokens.colors.neutral[300],
          },
        ]
      : []),
  ]

  const diskChart = disks.map((d) => ({
    name: d.mount,
    'Đã dùng': d.usedBytes,
    'Còn lại': Math.max(d.totalBytes - d.usedBytes, 0),
  }))

  const diskColumns: ColumnsType<DisksItem> = [
    {
      title: 'Mount',
      dataIndex: 'mount',
      key: 'mount',
      render: (text) => (
        <Text strong style={{ color: appTokens.text.primary }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Filesystem',
      dataIndex: 'filesystem',
      key: 'filesystem',
      render: (text) => (
        <Text style={{ color: appTokens.text.secondary }}>{text}</Text>
      ),
    },
    {
      title: 'Dung lượng',
      dataIndex: 'totalBytes',
      key: 'totalBytes',
      align: 'right',
      render: (val: number) => formatBytes(val),
    },
    {
      title: 'Đã dùng',
      dataIndex: 'usedBytes',
      key: 'usedBytes',
      align: 'right',
      render: (val: number) => formatBytes(val),
    },
    {
      title: 'Sử dụng',
      dataIndex: 'usagePercent',
      key: 'usagePercent',
      width: 200,
      render: (p: number) => (
        <Progress
          percent={Number(p.toFixed(1))}
          size="small"
          strokeColor={getLevelColor(p, appTokens)}
          status={p >= 85 ? 'exception' : 'normal'}
        />
      ),
    },
  ]

  const cardStyle = {
    borderRadius: appTokens.radius.lg,
    backgroundColor: appTokens.background.base,
    border: `1px solid ${appTokens.border.light}`,
    boxShadow: appTokens.shadow.button,
  }

  const cpuColor = appTokens.colors.primary.base
  const ramColor = appTokens.colors.secondary.base

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 4 Cards Overview Top */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle} bodyStyle={{ padding: 20 }}>
            <Statistic
              title={
                <Space>
                  <Cpu size={16} color={cpuColor} />
                  <span style={{ color: appTokens.text.secondary }}>
                    CPU Usage
                  </span>
                </Space>
              }
              value={cpuPercent}
              precision={1}
              suffix="%"
              valueStyle={{
                color: getLevelColor(cpuPercent, appTokens),
                fontWeight: 600,
              }}
            />
            <Progress
              percent={Number(cpuPercent.toFixed(1))}
              showInfo={false}
              strokeColor={getLevelColor(cpuPercent, appTokens)}
              size="small"
              style={{ margin: '12px 0 8px 0' }}
            />
            <Text style={{ fontSize: 12, color: appTokens.text.secondary }}>
              Cấu hình: {os.cpuCores} Cores
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle} bodyStyle={{ padding: 20 }}>
            <Statistic
              title={
                <Space>
                  <MemoryStick size={16} color={ramColor} />
                  <span style={{ color: appTokens.text.secondary }}>
                    RAM Usage
                  </span>
                </Space>
              }
              value={memPercent}
              precision={1}
              suffix="%"
              valueStyle={{
                color: getLevelColor(memPercent, appTokens),
                fontWeight: 600,
              }}
            />
            <Progress
              percent={Number(memPercent.toFixed(1))}
              showInfo={false}
              strokeColor={getLevelColor(memPercent, appTokens)}
              size="small"
              style={{ margin: '12px 0 8px 0' }}
            />
            <Text style={{ fontSize: 12, color: appTokens.text.secondary }}>
              {formatBytes(memory.usedBytes)} / {formatBytes(memory.totalBytes)}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle} bodyStyle={{ padding: 20 }}>
            <Statistic
              title={
                <Space>
                  <HardDrive size={16} color={appTokens.colors.warning.base} />
                  <span style={{ color: appTokens.text.secondary }}>
                    Max Disk Usage
                  </span>
                </Space>
              }
              value={maxDiskUsage}
              precision={1}
              suffix="%"
              valueStyle={{
                color: getLevelColor(maxDiskUsage, appTokens),
                fontWeight: 600,
              }}
            />
            <Progress
              percent={Number(maxDiskUsage.toFixed(1))}
              showInfo={false}
              strokeColor={getLevelColor(maxDiskUsage, appTokens)}
              size="small"
              style={{ margin: '12px 0 8px 0' }}
            />
            <Text style={{ fontSize: 12, color: appTokens.text.secondary }}>
              Tổng số {disks.length} phân vùng
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle} bodyStyle={{ padding: 20 }}>
            <Statistic
              title={
                <Space>
                  <Clock size={16} color={appTokens.text.secondary} />
                  <span style={{ color: appTokens.text.secondary }}>
                    Uptime
                  </span>
                </Space>
              }
              value={formatUptime(os.uptimeSeconds)}
              valueStyle={{
                fontSize: 20,
                fontWeight: 600,
                color: appTokens.text.primary,
              }}
            />
            <div style={{ marginTop: 16 }}>
              <Tag
                icon={<Server size={12} />}
                color={mode === 'dark' ? 'orange' : 'volcano'}
              >
                {os.platform}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Realtime Timeline Chart */}
      <Card
        title={
          <span style={{ color: appTokens.text.primary }}>
            Hiệu năng CPU & RAM (Realtime)
          </span>
        }
        bordered={false}
        style={cardStyle}
        extra={
          <Text style={{ fontSize: 12, color: appTokens.text.secondary }}>
            {history.length}/{HISTORY_SIZE} mẫu gần đây
          </Text>
        }
      >
        <div style={{ height: 260, width: '100%' }}>
          <ResponsiveContainer>
            <AreaChart
              data={history}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cpuColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={cpuColor} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ramColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={ramColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={appTokens.border.base}
              />
              <XAxis
                dataKey="time"
                minTickGap={30}
                tick={{ fontSize: 12, fill: appTokens.text.secondary }}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: appTokens.text.secondary }}
              />
              <Tooltip content={<CustomChartTooltip mode={mode} />} />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="cpu"
                name="CPU (%)"
                stroke={cpuColor}
                fill="url(#cpuGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="ram"
                name="RAM (%)"
                stroke={ramColor}
                fill="url(#ramGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Memory & Node.js Details */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card
            title={
              <span style={{ color: appTokens.text.primary }}>
                Chi tiết phân bổ RAM
              </span>
            }
            bordered={false}
            style={{ ...cardStyle, height: '100%' }}
            extra={
              <Tag color={getLevelColor(memPercent, appTokens)}>
                {getLevelLabel(memPercent)}
              </Tag>
            }
          >
            {/* Visual RAM Bar */}
            <div
              style={{
                display: 'flex',
                height: 16,
                borderRadius: appTokens.radius.sm,
                overflow: 'hidden',
                backgroundColor: appTokens.background.input,
                marginBottom: 20,
              }}
            >
              {memorySlices.map((s) => (
                <AntTooltip
                  key={s.name}
                  title={`${s.name}: ${formatBytes(s.bytes)}`}
                >
                  <div
                    style={{
                      width: `${(s.shown / memory.totalBytes) * 100}%`,
                      backgroundColor: s.color,
                      transition: `width ${appTokens.transition.base}`,
                    }}
                  />
                </AntTooltip>
              ))}
            </div>

            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {memorySlices.map((s) => (
                <div
                  key={s.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <Space size="small">
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: s.color,
                        display: 'inline-block',
                      }}
                    />
                    <Text style={{ color: appTokens.text.primary }}>
                      {s.name}
                    </Text>
                  </Space>
                  <Text strong style={{ color: appTokens.text.primary }}>
                    {formatBytes(s.bytes)}
                  </Text>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${appTokens.border.base}`,
                  paddingTop: 10,
                  marginTop: 6,
                }}
              >
                <Text strong style={{ color: appTokens.text.primary }}>
                  Tổng dung lượng
                </Text>
                <Text strong style={{ color: appTokens.text.primary }}>
                  {formatBytes(memory.totalBytes)}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            title={
              <span style={{ color: appTokens.text.primary }}>
                Tiến trình Node.js (Process)
              </span>
            }
            bordered={false}
            style={{ ...cardStyle, height: '100%' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Statistic
                  title={
                    <span style={{ color: appTokens.text.secondary }}>
                      RSS Memory
                    </span>
                  }
                  value={formatBytes(memory.processRssBytes)}
                  valueStyle={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: appTokens.text.primary,
                  }}
                />
                <Text style={{ fontSize: 12, color: appTokens.text.secondary }}>
                  Chiếm{' '}
                  {((memory.processRssBytes / memory.totalBytes) * 100).toFixed(
                    2,
                  )}
                  % hệ thống
                </Text>
                <Progress
                  percent={Number(
                    (
                      (memory.processRssBytes / memory.totalBytes) *
                      100
                    ).toFixed(2),
                  )}
                  showInfo={false}
                  strokeColor={ramColor}
                  style={{ marginTop: 8 }}
                />
              </Col>

              <Col xs={24} sm={12}>
                <Statistic
                  title={
                    <span style={{ color: appTokens.text.secondary }}>
                      Heap Memory Used
                    </span>
                  }
                  value={formatBytes(memory.heapUsedBytes)}
                  valueStyle={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: appTokens.text.primary,
                  }}
                />
                <Text style={{ fontSize: 12, color: appTokens.text.secondary }}>
                  Chiếm{' '}
                  {(
                    (memory.heapUsedBytes / memory.processRssBytes) *
                    100
                  ).toFixed(1)}
                  % RSS
                </Text>
                <Progress
                  percent={Number(
                    (
                      (memory.heapUsedBytes / memory.processRssBytes) *
                      100
                    ).toFixed(1),
                  )}
                  showInfo={false}
                  strokeColor={cpuColor}
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Disks Card */}
      <Card
        title={
          <span style={{ color: appTokens.text.primary }}>
            Trạng thái Ổ đĩa (Disks)
          </span>
        }
        bordered={false}
        style={cardStyle}
      >
        {disks.length === 0 ? (
          <Empty description="Không tìm thấy thông tin phân vùng ổ đĩa" />
        ) : (
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={9}>
              <div
                style={{
                  height: Math.max(160, disks.length * 60),
                  width: '100%',
                }}
              >
                <ResponsiveContainer>
                  <BarChart
                    data={diskChart}
                    layout="vertical"
                    stackOffset="expand"
                    margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={60}
                      tick={{ fontSize: 12, fill: appTokens.text.secondary }}
                    />
                    <Tooltip formatter={(v) => formatBytes(Number(v))} />
                    <Bar
                      dataKey="Đã dùng"
                      stackId="a"
                      fill={appTokens.colors.warning.base}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="Còn lại"
                      stackId="a"
                      fill={appTokens.background.input}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>

            <Col xs={24} lg={15}>
              <Table
                size="small"
                rowKey="mount"
                columns={diskColumns}
                dataSource={disks}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </Col>
          </Row>
        )}
      </Card>
    </Space>
  )
}
