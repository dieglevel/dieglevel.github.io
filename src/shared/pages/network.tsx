/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Alert, Button, Flex, Input, InputNumber, Typography } from 'antd'
import {
  ActivityIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  GaugeIcon,
  MonitorPlayIcon,
  PauseIcon,
  PlayIcon,
  RadioIcon,
  TimerIcon,
  WifiIcon,
  WifiOffIcon,
} from 'lucide-react'

const { Title, Text } = Typography

// ====== PALETTE (đồng bộ theme Blossom) ======
const C = {
  bg: '#3D1F10',
  accent: '#B74C36',
  ok: '#4CAF50',
  warn: '#E9A23B',
  bad: '#D64545',
  card: '#FFF8F3',
  border: 'rgba(183, 76, 54, 0.25)',
  textDim: 'rgba(61, 31, 16, 0.55)',
}

// Bitrate mặc định Moonlight
const STREAM_TIERS = [
  { label: '4K @ 60fps', bitrate: 80 },
  { label: '1440p @ 60fps', bitrate: 40 },
  { label: '1080p @ 60fps', bitrate: 20 },
  { label: '720p @ 60fps', bitrate: 10 },
]

const WINDOW_SIZE = 120 // giữ 120 mẫu ≈ 2 phút lịch sử
const PROBE_INTERVAL = 1000 // probe HTTP mỗi giây
const STUN_INTERVAL = 5000 // probe UDP/STUN mỗi 5 giây

interface Sample {
  t: number // timestamp
  ms: number | null // null = mất gói / timeout
}

// ====== ƯỚC LƯỢNG UDP RTT QUA STUN (WebRTC) ======
// Browser không gửi UDP thô được. STUN chạy trên UDP, nên thời gian
// lấy được srflx candidate ≈ 1 vòng UDP tới STUN server (ước lượng thô).
const measureStunRtt = (timeoutMs = 3000): Promise<number | null> =>
  new Promise((resolve) => {
    let settled = false
    const done = (v: number | null) => {
      if (settled) return
      settled = true
      try {
        pc.close()
      } catch {
        /* ignore */
      }
      resolve(v)
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    pc.createDataChannel('probe')

    const start = performance.now()
    pc.onicecandidate = (e) => {
      // srflx = candidate lấy từ STUN server → UDP đã đi và về
      if (e.candidate?.candidate.includes('srflx')) {
        done(performance.now() - start)
      }
    }

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => done(null))

    setTimeout(() => done(null), timeoutMs)
  })

// ====== TÍNH TOÁN THỐNG KÊ TRÊN CỬA SỔ MẪU ======
const computeStats = (samples: Array<Sample>) => {
  const ok = samples.filter((s) => s.ms !== null).map((s) => s.ms as number)
  if (samples.length === 0 || ok.length === 0) {
    return { avg: null, jitter: null, lossPct: samples.length ? 100 : null }
  }
  const avg = ok.reduce((a, b) => a + b, 0) / ok.length
  const jitter = Math.sqrt(
    ok.reduce((a, b) => a + (b - avg) ** 2, 0) / ok.length,
  )
  const lossPct = ((samples.length - ok.length) / samples.length) * 100
  return { avg, jitter, lossPct }
}

const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString('vi-VN', { hour12: false })

// ====== CHART SVG THUẦN: latency theo thời gian ======
function LatencyChart({ samples }: { samples: Array<Sample> }) {
  const W = 640
  const H = 180
  const PAD = { top: 12, right: 12, bottom: 24, left: 40 }

  if (samples.length < 2) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ height: H, color: C.textDim, fontSize: 13 }}
      >
        Đang thu thập dữ liệu...
      </Flex>
    )
  }

  const okValues = samples
    .filter((s) => s.ms !== null)
    .map((s) => s.ms as number)
  const maxY = Math.max(20, Math.ceil(Math.max(...okValues, 0) * 1.2))

  const x = (i: number) =>
    PAD.left + (i / (WINDOW_SIZE - 1)) * (W - PAD.left - PAD.right)
  const y = (ms: number) =>
    PAD.top + (1 - ms / maxY) * (H - PAD.top - PAD.bottom)

  // Đường latency: ngắt đoạn tại các mẫu mất gói
  let path = ''
  let penDown = false
  samples.forEach((s, i) => {
    if (s.ms === null) {
      penDown = false
      return
    }
    path += `${penDown ? 'L' : 'M'}${x(i).toFixed(1)},${y(s.ms).toFixed(1)} `
    penDown = true
  })

  // Vạch đỏ đánh dấu mẫu mất gói
  const lostMarks = samples
    .map((s, i) => (s.ms === null ? i : -1))
    .filter((i) => i >= 0)

  const first = samples[0]
  const mid = samples[Math.floor(samples.length / 2)]
  const last = samples[samples.length - 1]

  const gridLines = [0.25, 0.5, 0.75].map((f) => Math.round(maxY * f))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* Lưới ngang + nhãn trục Y */}
      {gridLines.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(v)}
            y2={y(v)}
            stroke={C.border}
            strokeDasharray="3 4"
          />
          <text
            x={PAD.left - 6}
            y={y(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill={C.textDim}
          >
            {v}ms
          </text>
        </g>
      ))}

      {/* Vùng mất gói */}
      {lostMarks.map((i) => (
        <line
          key={i}
          x1={x(i)}
          x2={x(i)}
          y1={PAD.top}
          y2={H - PAD.bottom}
          stroke={C.bad}
          strokeOpacity={0.35}
          strokeWidth={3}
        />
      ))}

      {/* Đường latency */}
      <path d={path} fill="none" stroke={C.accent} strokeWidth={2} />

      {/* Nhãn thời gian trục X */}
      <text x={PAD.left} y={H - 6} fontSize="10" fill={C.textDim}>
        {fmtTime(first.t)}
      </text>
      <text
        x={W / 2}
        y={H - 6}
        fontSize="10"
        fill={C.textDim}
        textAnchor="middle"
      >
        {fmtTime(mid.t)}
      </text>
      <text
        x={W - PAD.right}
        y={H - 6}
        fontSize="10"
        fill={C.textDim}
        textAnchor="end"
      >
        {fmtTime(last.t)}
      </text>
    </svg>
  )
}

export default function NetworkMonitorPage() {
  const [host, setHost] = useState('')
  const [port, setPort] = useState<number>(47989)
  const [monitoring, setMonitoring] = useState(false)

  const [samples, setSamples] = useState<Array<Sample>>([])
  const [udpSamples, setUdpSamples] = useState<Array<Sample>>([])

  const [downloadMbps, setDownloadMbps] = useState<number | null>(null)
  const [uploadMbps, setUploadMbps] = useState<number | null>(null)
  const [speedTestedAt, setSpeedTestedAt] = useState<number | null>(null)
  const [speedRunning, setSpeedRunning] = useState(false)

  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const monitoringRef = useRef(false)

  // ====== VÒNG LẶP MONITOR ======
  useEffect(() => {
    monitoringRef.current = monitoring
    if (!monitoring) return

    setSamples([])
    setUdpSamples([])
    setStartedAt(Date.now())

    // Probe HTTP latency mỗi giây
    const httpProbe = async () => {
      const start = performance.now()
      let ms: number | null = null
      try {
        await fetch(`http://${host.trim()}:${port}/`, {
          mode: 'no-cors',
          cache: 'no-store',
          signal: AbortSignal.timeout(2000),
        })
        ms = performance.now() - start
      } catch {
        ms = null // timeout / lỗi = mất gói
      }
      if (!monitoringRef.current) return
      setSamples((prev) => [...prev, { t: Date.now(), ms }].slice(-WINDOW_SIZE))
    }

    // Probe UDP (STUN) mỗi 5 giây
    const udpProbe = async () => {
      const ms = await measureStunRtt()
      if (!monitoringRef.current) return
      setUdpSamples((prev) =>
        [...prev, { t: Date.now(), ms }].slice(-Math.ceil(WINDOW_SIZE / 5)),
      )
    }

    httpProbe()
    udpProbe()
    const t1 = setInterval(httpProbe, PROBE_INTERVAL)
    const t2 = setInterval(udpProbe, STUN_INTERVAL)
    const t3 = setInterval(() => setNow(Date.now()), 1000)

    return () => {
      clearInterval(t1)
      clearInterval(t2)
      clearInterval(t3)
    }
  }, [monitoring, host, port])

  // ====== SPEED TEST (chạy tay, không chạy liên tục để đỡ tốn băng thông) ======
  const runSpeedTest = async () => {
    setSpeedRunning(true)
    try {
      // Download 25MB
      const BYTES_DL = 25_000_000
      const res = await fetch(
        `https://speed.cloudflare.com/__down?bytes=${BYTES_DL}`,
        { cache: 'no-store' },
      )
      const reader = res.body?.getReader()
      let received = 0
      const s1 = performance.now()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          received += value.length
        }
      }
      setDownloadMbps((received * 8) / ((performance.now() - s1) / 1000) / 1e6)

      // Upload 10MB
      const payload = new Uint8Array(10_000_000)
      const s2 = performance.now()
      await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body: payload,
      })
      setUploadMbps(
        (payload.length * 8) / ((performance.now() - s2) / 1000) / 1e6,
      )
      setSpeedTestedAt(Date.now())
    } catch {
      /* giữ giá trị cũ */
    } finally {
      setSpeedRunning(false)
    }
  }

  // ====== THỐNG KÊ ======
  const stats = useMemo(() => computeStats(samples), [samples])
  const udpStats = useMemo(() => computeStats(udpSamples), [udpSamples])

  // Verdict tổng
  const verdict = useMemo(() => {
    if (stats.avg === null) return null
    const loss = stats.lossPct ?? 0
    const jit = stats.jitter ?? 0
    if (stats.avg < 20 && loss < 1 && jit < 5)
      return { text: 'GOOD', color: C.ok, icon: <WifiIcon size={18} /> }
    if (stats.avg < 50 && loss < 3 && jit < 10)
      return { text: 'OK', color: C.warn, icon: <WifiIcon size={18} /> }
    return { text: 'BAD', color: C.bad, icon: <WifiOffIcon size={18} /> }
  }, [stats])

  // Tier stream cao nhất khả thi
  const streamVerdict = useMemo(() => {
    if (stats.avg === null) return null
    if (stats.avg >= 80 || (stats.lossPct ?? 0) > 5)
      return { text: 'Không đủ ổn định để stream', ok: false }
    // Chưa đo tốc độ → chỉ đánh giá theo latency
    if (downloadMbps === null || uploadMbps === null) {
      return stats.avg < 5
        ? { text: '4K60 (LAN — chưa đo băng thông)', ok: true }
        : { text: 'Chạy speed test để biết mức tối đa', ok: true }
    }
    const usable = Math.min(downloadMbps, uploadMbps)
    const tier = STREAM_TIERS.find((t) => usable >= t.bitrate * 1.2)
    return tier
      ? { text: `${tier.label} ✓`, ok: true }
      : { text: 'Băng thông quá thấp (< 12 Mbps)', ok: false }
  }, [stats, downloadMbps, uploadMbps])

  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0
  const fmtElapsed = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`

  // ====== TILE ======
  const Tile = ({
    icon,
    label,
    value,
    unit,
    color,
  }: {
    icon: React.ReactNode
    label: string
    value: string
    unit?: string
    color?: string
  }) => (
    <div
      style={{
        flex: '1 1 140px',
        minWidth: 140,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '12px 14px',
      }}
    >
      <Flex align="center" gap={6} style={{ color: C.accent, marginBottom: 4 }}>
        {icon}
        <Text style={{ fontSize: 12, color: C.textDim }}>{label}</Text>
      </Flex>
      <Flex align="baseline" gap={4}>
        <span style={{ fontSize: 24, fontWeight: 700, color: color ?? C.bg }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 12, color: C.textDim }}>{unit}</span>}
      </Flex>
    </div>
  )

  const fmt = (v: number | null, digits = 1) =>
    v === null ? '—' : v.toFixed(digits)

  return (
    <Flex
      vertical
      gap={16}
      style={{ maxWidth: 760, margin: '0 auto', padding: 24 }}
    >
      {/* ====== HEADER ====== */}
      <Flex justify="space-between" align="center" wrap gap={12}>
        <Title level={3} style={{ color: C.bg, margin: 0 }}>
          <Flex align="center" gap={10}>
            <MonitorPlayIcon size={26} color={C.accent} />
            Network Monitor
          </Flex>
        </Title>
        {monitoring && (
          <Flex align="center" gap={6} style={{ color: C.textDim }}>
            <TimerIcon size={16} />
            <Text style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtElapsed}
            </Text>
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.bad,
                display: 'inline-block',
              }}
            />
          </Flex>
        )}
      </Flex>

      {/* ====== INPUT + START/STOP ====== */}
      <Flex gap={8} wrap>
        <Input
          placeholder="IP máy host chạy Apollo (vd: 192.168.1.10)"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          disabled={monitoring}
          style={{ flex: '1 1 240px' }}
          size="large"
          prefix={<WifiIcon size={16} color={C.accent} />}
        />
        <InputNumber
          value={port}
          onChange={(v) => setPort(v ?? 47989)}
          disabled={monitoring}
          min={1}
          max={65535}
          size="large"
          style={{ width: 100 }}
        />
        <Button
          type="primary"
          size="large"
          icon={monitoring ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          onClick={() => setMonitoring((m) => !m)}
          disabled={!host.trim()}
          style={{ background: monitoring ? C.bad : C.accent }}
        >
          {monitoring ? 'Dừng' : 'Bắt đầu'}
        </Button>
        <Button
          size="large"
          loading={speedRunning}
          onClick={runSpeedTest}
          icon={<GaugeIcon size={16} />}
        >
          Speed test
        </Button>
      </Flex>

      {/* ====== VERDICT ====== */}
      {verdict && streamVerdict && (
        <Flex gap={12} wrap>
          <Flex
            align="center"
            gap={8}
            style={{
              flex: '1 1 200px',
              background: verdict.color,
              color: '#fff',
              borderRadius: 12,
              padding: '12px 16px',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {verdict.icon}
            Connection: {verdict.text}
          </Flex>
          <Flex
            align="center"
            gap={8}
            style={{
              flex: '1 1 240px',
              background: streamVerdict.ok ? C.card : 'rgba(214,69,69,0.08)',
              border: `1px solid ${streamVerdict.ok ? C.border : C.bad}`,
              color: streamVerdict.ok ? C.bg : C.bad,
              borderRadius: 12,
              padding: '12px 16px',
              fontWeight: 600,
            }}
          >
            <MonitorPlayIcon size={18} color={C.accent} />
            Streaming: {streamVerdict.text}
          </Flex>
        </Flex>
      )}

      {/* ====== STAT TILES ====== */}
      <Flex gap={10} wrap>
        <Tile
          icon={<ActivityIcon size={14} />}
          label="Latency"
          value={fmt(stats.avg, 0)}
          unit="ms"
        />
        <Tile
          icon={<GaugeIcon size={14} />}
          label="Jitter"
          value={fmt(stats.jitter, 1)}
          unit="ms"
        />
        <Tile
          icon={<WifiOffIcon size={14} />}
          label="Packet Loss"
          value={fmt(stats.lossPct, 1)}
          unit="%"
          color={
            (stats.lossPct ?? 0) > 3
              ? C.bad
              : (stats.lossPct ?? 0) > 0
                ? C.warn
                : undefined
          }
        />
        <Tile
          icon={<ArrowDownToLine size={14} />}
          label="Download"
          value={fmt(downloadMbps, 0)}
          unit="Mbps"
        />
        <Tile
          icon={<ArrowUpFromLine size={14} />}
          label="Upload"
          value={fmt(uploadMbps, 0)}
          unit="Mbps"
        />
        <Tile
          icon={<RadioIcon size={14} />}
          label="UDP latency (STUN)"
          value={fmt(udpStats.avg, 0)}
          unit="ms"
        />
        <Tile
          icon={<RadioIcon size={14} />}
          label="UDP loss (STUN)"
          value={fmt(udpStats.lossPct, 1)}
          unit="%"
        />
      </Flex>

      {speedTestedAt && (
        <Text style={{ fontSize: 12, color: C.textDim }}>
          Speed test lúc {fmtTime(speedTestedAt)}
        </Text>
      )}

      {/* ====== CHART ====== */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Flex justify="space-between" align="center" wrap gap={8}>
          <Text strong style={{ color: C.bg }}>
            Latency theo thời gian (2 phút gần nhất)
          </Text>
          <Flex gap={12} style={{ fontSize: 12, color: C.textDim }}>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 14,
                  height: 3,
                  background: C.accent,
                  verticalAlign: 'middle',
                  marginRight: 4,
                }}
              />
              Latency
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: 12,
                  background: C.bad,
                  opacity: 0.5,
                  verticalAlign: 'middle',
                  marginRight: 4,
                }}
              />
              Mất gói
            </span>
          </Flex>
        </Flex>
        <LatencyChart samples={samples} />
      </div>

      <Alert
        type="info"
        showIcon
        message="Về chỉ số UDP"
        description="Trình duyệt không gửi được UDP thô tới host, nên UDP latency/loss ở đây được ước lượng qua STUN (WebRTC) tới server internet — phản ánh chất lượng đường UDP ra ngoài của máy này, không phải UDP trực tiếp tới máy host. Moonlight stream bằng UDP nên chỉ số này vẫn hữu ích khi stream qua Internet."
      />
    </Flex>
  )
}
