import React, { useCallback, useEffect, useRef, useState } from 'react'

// Độ phân giải dùng để PHÂN TÍCH chuyển động (nhỏ, để tính toán nhanh)
const PROCESS_WIDTH = 80
const PROCESS_HEIGHT = 60
const PROCESS_INTERVAL_MS = 100 // ~10fps phân tích, đủ nhạy mà tiết kiệm pin/CPU
const DISPLAY_WIDTH = 320
const DISPLAY_HEIGHT = 240

type Role = 'host' | 'client' | null

// Vùng chọn (ROI), tính theo tỉ lệ 0..1 so với khung hình đang HIỂN THỊ (đã zoom)
interface Rect {
  x: number
  y: number
  w: number
  h: number
}

const MotionDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null) // canvas hiển thị (đã zoom)
  const processCanvasRef = useRef<HTMLCanvasElement | null>(null) // canvas ẩn để phân tích
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastProcessTimeRef = useRef<number>(0)
  const motionRef = useRef<boolean>(false)
  const wsRef = useRef<WebSocket | null>(null)
  const videoSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isStarted, setIsStarted] = useState(false)
  const [motionDetected, setMotionDetected] = useState(false)
  const [sensitivity, setSensitivity] = useState(30)
  const [threshold, setThreshold] = useState(5)
  const [zoom, setZoom] = useState(1)
  const [roi, setRoi] = useState<Rect | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [role, setRole] = useState<Role>(null)
  const [serverUrl, setServerUrl] = useState('wss://192.168.68.82:8080')
  const [wsStatus, setWsStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')
  const [alarmEnabled, setAlarmEnabled] = useState(false)

  // ---------- Âm thanh báo động (phát file mp3) ----------
  // Đặt file này trong thư mục public/ của dự án Vite, ví dụ:
  //   public/freesound_community-security-alarm-80493.mp3
  // Vite sẽ phục vụ mọi file trong public/ tại đường dẫn gốc "/", nên
  // đường dẫn dưới đây trỏ đúng tới file mà không cần import.
  const ALARM_SOUND_PATH = '/freesound_community-security-alarm-80493.mp3'

  const enableAlarm = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ALARM_SOUND_PATH)
    }
    const audio = audioRef.current
    // Thao tác bấm nút này là "cử chỉ người dùng" giúp mở khóa phát âm thanh,
    // vì trình duyệt chặn phát tự động nếu chưa có tương tác nào.
    audio
      .play()
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        setAlarmEnabled(true)
      })
      .catch((err) => {
        console.error('Không thể phát thử âm thanh:', err)
        alert(
          'Không thể phát âm thanh. Kiểm tra lại đường dẫn file mp3 trong mã nguồn.',
        )
      })
  }, [])

  const playAlarm = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    audio
      .play()
      .then(() => {
        // Tắt âm thanh sau 1000ms (1 giây)
        setTimeout(() => {
          audio.pause()
          audio.currentTime = 0 // Đưa về đầu nếu muốn reset
        }, 1000)
      })
      .catch((err) => console.error('Lỗi phát âm thanh báo động:', err))
  }, [])

  // ---------- WebSocket: chia sẻ báo động qua mạng LAN ----------
  const connectWs = useCallback(() => {
    wsRef.current?.close()
    setWsStatus('connecting')
    try {
      const ws = new WebSocket(serverUrl)
      ws.onopen = () => setWsStatus('connected')
      ws.onclose = () => setWsStatus('disconnected')
      ws.onerror = () => setWsStatus('disconnected')
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data)
          if (data.type === 'motion') playAlarm()
        } catch {
          // bỏ qua message không hợp lệ
        }
      }
      wsRef.current = ws
    } catch (err) {
      console.error('Không thể kết nối WebSocket:', err)
      setWsStatus('disconnected')
    }
  }, [serverUrl, playAlarm])

  useEffect(() => () => wsRef.current?.close(), [])

  // ---------- Camera ----------
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        videoSizeRef.current = {
          w: videoRef.current.videoWidth,
          h: videoRef.current.videoHeight,
        }
        setIsStarted(true)
      }
    } catch (err) {
      console.error('Lỗi truy cập camera:', err)
      alert('Không thể mở Camera. Vui lòng cấp quyền truy cập!')
    }
  }, [])

  useEffect(
    () => () => streamRef.current?.getTracks().forEach((t) => t.stop()),
    [],
  )

  // ---------- Chọn vùng (ROI) bằng chuột / chạm trên khung hiển thị ----------
  const getRelativePos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect()
    const point = 'touches' in e ? e.touches[0] : e
    const x = (point.clientX - rect.left) / rect.width
    const y = (point.clientY - rect.top) / rect.height
    return { x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) }
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = displayCanvasRef.current
    if (!canvas) return
    dragStartRef.current = getRelativePos(e, canvas)
    setIsDragging(true)
    setRoi(null)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current) return
    const canvas = displayCanvasRef.current
    if (!canvas) return
    const pos = getRelativePos(e, canvas)
    const start = dragStartRef.current
    setRoi({
      x: Math.min(start.x, pos.x),
      y: Math.min(start.y, pos.y),
      w: Math.abs(pos.x - start.x),
      h: Math.abs(pos.y - start.y),
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    dragStartRef.current = null
    // Vùng chọn quá nhỏ (coi như bấm nhầm) -> bỏ, quay lại phân tích toàn khung
    setRoi((prev) => (prev && prev.w > 0.02 && prev.h > 0.02 ? prev : null))
  }

  // ---------- Vòng lặp: vẽ khung đã zoom (mỗi frame) + phân tích chuyển động trên ROI (throttled) ----------
  useEffect(() => {
    let animationFrameId: number
    const sensitivitySum = sensitivity * 3

    const processFrame = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(processFrame)

      const video = videoRef.current
      const displayCanvas = displayCanvasRef.current
      const processCanvas = processCanvasRef.current
      const { w: vw, h: vh } = videoSizeRef.current
      if (!video || !displayCanvas || !processCanvas || !vw || !vh) return
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return

      // Vùng nguồn đã zoom, canh giữa khung hình gốc
      const zoomedW = vw / zoom
      const zoomedH = vh / zoom
      const zoomedX = (vw - zoomedW) / 2
      const zoomedY = (vh - zoomedH) / 2

      const displayCtx = displayCanvas.getContext('2d')
      if (displayCtx) {
        displayCtx.drawImage(
          video,
          zoomedX,
          zoomedY,
          zoomedW,
          zoomedH,
          0,
          0,
          displayCanvas.width,
          displayCanvas.height,
        )
      }

      // ROI (nếu có) áp lên vùng đã zoom, quy đổi về tọa độ gốc của video để cắt phân tích
      let sx = zoomedX,
        sy = zoomedY,
        sw = zoomedW,
        sh = zoomedH
      if (roi) {
        sx = zoomedX + roi.x * zoomedW
        sy = zoomedY + roi.y * zoomedH
        sw = roi.w * zoomedW
        sh = roi.h * zoomedH
      }
      if (sw <= 0 || sh <= 0) return
      if (timestamp - lastProcessTimeRef.current < PROCESS_INTERVAL_MS) return
      lastProcessTimeRef.current = timestamp

      const ctx = processCanvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, PROCESS_WIDTH, PROCESS_HEIGHT)
      const currData = ctx.getImageData(
        0,
        0,
        PROCESS_WIDTH,
        PROCESS_HEIGHT,
      ).data

      if (prevFrameDataRef.current) {
        const prevData = prevFrameDataRef.current
        let changedPixels = 0
        const totalPixels = PROCESS_WIDTH * PROCESS_HEIGHT

        for (let i = 0; i < currData.length; i += 4) {
          const currSum = currData[i] + currData[i + 1] + currData[i + 2]
          const prevSum = prevData[i] + prevData[i + 1] + prevData[i + 2]
          if (Math.abs(currSum - prevSum) > sensitivitySum) changedPixels++
        }

        const newMotion = (changedPixels / totalPixels) * 100 > threshold
        if (newMotion !== motionRef.current) {
          motionRef.current = newMotion
          setMotionDetected(newMotion)
          if (newMotion) {
            playAlarm()
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({ type: 'motion', ts: Date.now() }),
              )
            }
          }
        }
      }
      prevFrameDataRef.current = currData
    }

    if (isStarted && role === 'host')
      animationFrameId = requestAnimationFrame(processFrame)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isStarted, role, sensitivity, threshold, zoom, roi, playAlarm])

  // ---------- Màn hình chọn vai trò ----------
  if (!role) {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <h2>Giám sát Chuyển động</h2>
        <p>Chọn vai trò cho thiết bị này:</p>
        <button
          onClick={() => setRole('host')}
          style={{
            margin: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          📷 Thiết bị giám sát (Host)
        </button>
        <button
          onClick={() => setRole('client')}
          style={{
            margin: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            background: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          🔊 Chỉ nhận báo động (Client)
        </button>
      </div>
    )
  }

  // ---------- Giao diện Client ----------
  if (role === 'client') {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <h2>Nhận báo động chuyển động</h2>
        <button
          onClick={() => setRole(null)}
          style={{
            marginBottom: '15px',
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
          }}
        >
          ← Đổi vai trò
        </button>
        <div style={{ maxWidth: '320px', margin: '0 auto', textAlign: 'left' }}>
          <label>
            Địa chỉ máy chủ trung gian (WebSocket):
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="wss://192.168.68.82:8080"
              style={{
                width: '100%',
                padding: '8px',
                margin: '6px 0',
                boxSizing: 'border-box',
              }}
            />
          </label>
          <button
            onClick={connectWs}
            style={{
              width: '100%',
              padding: '10px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              marginBottom: '10px',
            }}
          >
            Kết nối
          </button>
          {!alarmEnabled && (
            <button
              onClick={enableAlarm}
              style={{
                width: '100%',
                padding: '10px',
                background: '#ffc107',
                border: 'none',
                borderRadius: '6px',
                marginBottom: '10px',
              }}
            >
              🔊 Bật âm thanh cảnh báo
            </button>
          )}
          {alarmEnabled && (
            <button
              onClick={playAlarm}
              style={{
                width: '100%',
                padding: '8px',
                background: '#eee',
                border: '1px solid #ccc',
                borderRadius: '6px',
                marginBottom: '10px',
                fontSize: '13px',
              }}
            >
              🔊 Thử âm thanh
            </button>
          )}
          <div
            style={{
              padding: '10px',
              borderRadius: '6px',
              color: '#fff',
              textAlign: 'center',
              background:
                wsStatus === 'connected'
                  ? '#52c41a'
                  : wsStatus === 'connecting'
                    ? '#faad14'
                    : '#ff4d4f',
            }}
          >
            {wsStatus === 'connected'
              ? '✅ Đã kết nối — sẽ phát âm thanh khi có báo động'
              : wsStatus === 'connecting'
                ? '⏳ Đang kết nối...'
                : '❌ Chưa kết nối'}
          </div>
        </div>
      </div>
    )
  }

  // ---------- Giao diện Host ----------
  return (
    <div
      style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}
    >
      <h2>Giám sát Chuyển động (Host)</h2>
      <button
        onClick={() => setRole(null)}
        style={{
          marginBottom: '15px',
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
        }}
      >
        ← Đổi vai trò
      </button>

      {!isStarted && (
        <button
          onClick={startCamera}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          Bật Camera
        </button>
      )}

      {isStarted && (
        <>
          <div
            style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: motionDetected ? '#ff4d4f' : '#52c41a',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '6px',
            }}
          >
            {motionDetected
              ? '⚠️ PHÁT HIỆN CHUYỂN ĐỘNG!'
              : '✅ Không có chuyển động'}
          </div>

          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginTop: '15px',
              touchAction: 'none',
            }}
          >
            <canvas
              ref={displayCanvasRef}
              width={DISPLAY_WIDTH}
              height={DISPLAY_HEIGHT}
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '8px',
                border: '2px solid #ccc',
                display: 'block',
                cursor: 'crosshair',
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            />
            {roi && (
              <div
                style={{
                  position: 'absolute',
                  left: `${roi.x * 100}%`,
                  top: `${roi.y * 100}%`,
                  width: `${roi.w * 100}%`,
                  height: `${roi.h * 100}%`,
                  border: '2px dashed #ff4d4f',
                  background: 'rgba(255,77,79,0.15)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#666',
              maxWidth: '400px',
              margin: '6px auto',
            }}
          >
            Kéo trên khung hình để chọn vùng cần kiểm tra chuyển động. Không
            chọn = kiểm tra toàn bộ khung.
          </p>
          {roi && (
            <button
              onClick={() => setRoi(null)}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                marginBottom: '10px',
              }}
            >
              Xóa vùng chọn
            </button>
          )}

          <div
            style={{
              margin: '20px 0',
              textAlign: 'left',
              maxWidth: '320px',
              display: 'inline-block',
            }}
          >
            <label>
              Thu phóng (Zoom): {zoom.toFixed(1)}x
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </label>
            <br />
            <br />
            <label>
              Độ nhạy điểm ảnh (Sensitivity): {sensitivity}
              <input
                type="range"
                min="10"
                max="100"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </label>
            <br />
            <br />
            <label>
              Ngưỡng diện tích (Threshold %): {threshold}%
              <input
                type="range"
                min="1"
                max="30"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </label>
          </div>

          <hr style={{ maxWidth: '320px', margin: '20px auto' }} />

          <div
            style={{ maxWidth: '320px', margin: '0 auto', textAlign: 'left' }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>
              🔊 Âm thanh báo động
            </p>
            {!alarmEnabled && (
              <button
                onClick={enableAlarm}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#ffc107',
                  border: 'none',
                  borderRadius: '6px',
                  marginBottom: '10px',
                }}
              >
                Bật âm thanh cảnh báo
              </button>
            )}
            {alarmEnabled && (
              <button
                onClick={playAlarm}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#eee',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '13px',
                }}
              >
                Thử âm thanh
              </button>
            )}

            <p style={{ fontWeight: 'bold', margin: '14px 0 6px' }}>
              Chia sẻ báo động cho thiết bị khác
            </p>
            <label>
              Địa chỉ máy chủ trung gian (WebSocket):
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="wss://192.168.68.82:8080"
                style={{
                  width: '100%',
                  padding: '8px',
                  margin: '6px 0',
                  boxSizing: 'border-box',
                }}
              />
            </label>
            <button
              onClick={connectWs}
              style={{
                width: '100%',
                padding: '10px',
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                marginBottom: '10px',
              }}
            >
              Kết nối & Bắt đầu chia sẻ
            </button>
            <div
              style={{
                padding: '10px',
                borderRadius: '6px',
                color: '#fff',
                textAlign: 'center',
                background:
                  wsStatus === 'connected'
                    ? '#52c41a'
                    : wsStatus === 'connecting'
                      ? '#faad14'
                      : '#ff4d4f',
              }}
            >
              {wsStatus === 'connected'
                ? '✅ Đang chia sẻ báo động'
                : wsStatus === 'connecting'
                  ? '⏳ Đang kết nối...'
                  : '❌ Chưa kết nối máy chủ chia sẻ'}
            </div>
          </div>

          <canvas
            ref={processCanvasRef}
            width={PROCESS_WIDTH}
            height={PROCESS_HEIGHT}
            style={{ display: 'none' }}
          />
        </>
      )}

      <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
    </div>
  )
}

export default MotionDetector
