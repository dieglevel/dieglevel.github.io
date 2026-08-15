import React, { useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Card,
  Col,
  Input,
  List,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  DislikeOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { AnimatePresence, motion } from 'motion/react'
import { TRACK_MUSIC } from './track'

const { Title, Text } = Typography

export interface Track {
  id: number
  name: string
  isVideo: boolean
  videoSource: string
  videoUrl: string
  resourceUrl: string
  startTime: number
  endTime: number
  wins: number
  losses: number
  finalWins: number
  finalLosses: number
  winLossRatio: number
  gameId: number
  ranking: number
}

const sampleTracks: Array<Track> = TRACK_MUSIC

export default function MusicPlayerPage() {
  const [tracks] = useState<Array<Track>>(sampleTracks)
  const [selectedTrack, setSelectedTrack] = useState<Track>(sampleTracks[0])
  const [search, setSearch] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const filteredTracks = tracks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Hàm chuyển bài tiếp theo
  const playNextTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === selectedTrack.id)
    if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
      setSelectedTrack(tracks[currentIndex + 1])
    } else {
      // Nếu là bài cuối cùng -> Quay lại bài đầu tiên
      setSelectedTrack(tracks[0])
    }
  }

  // Lắng nghe sự kiện từ Youtube iframe postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Kiểm tra nguồn gửi từ youtube
      if (!event.origin.includes('youtube.com')) return

      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        // Khi video thay đổi trạng thái (infoDelivery hoặc onStateChange)
        if (data.event === 'infoDelivery' && data.info) {
          // state = 0 là trạng thái YT.PlayerState.ENDED (Đã phát xong)
          if (data.info.playerState === 0) {
            playNextTrack()
          }
        }
      } catch (err) {
        // Bỏ qua lỗi parse JSON từ các nguồn khác
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [selectedTrack, tracks])

  // Gửi lệnh đăng ký listener tới iframe khi video load
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'listening',
          id: 1,
          channel: 'widget',
        }),
        '*',
      )
    }
  }

  return (
    <div
      style={{
        padding: 24,
        height: '100vh',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16, flexShrink: 0 }}
      >
        <Col>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            🎵 Youtube Music Player
          </Title>
        </Col>
        <Col>
          <Input
            placeholder="Tìm bài hát..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280, borderRadius: 20 }}
            allowClear
          />
        </Col>
      </Row>

      {/* Main Container */}
      <Row gutter={[24, 24]} style={{ flex: 1, minHeight: 0 }}>
        {/* Bên trái: Video Player */}
        <Col
          xs={24}
          lg={16}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Card
            style={{
              background: '#1e293b',
              borderColor: '#334155',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            bodyStyle={{
              padding: 16,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                flex: 1,
                maxHeight: 'calc(100% - 90px)',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <iframe
                ref={iframeRef}
                onLoad={handleIframeLoad}
                /* Bổ sung enablejsapi=1 để giao tiếp qua postMessage */
                src={`${selectedTrack.videoUrl}?autoplay=1&enablejsapi=1`}
                title={selectedTrack.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTrack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: 12, flexShrink: 0 }}
              >
                <Title
                  level={4}
                  style={{ color: '#fff', marginBottom: 8 }}
                  ellipsis
                >
                  {selectedTrack.name}
                </Title>

                <Space size="middle" wrap>
                  <Tag icon={<TrophyOutlined />} color="gold">
                    Rank #{selectedTrack.ranking}
                  </Tag>
                  <Tag icon={<LikeOutlined />} color="green">
                    {selectedTrack.wins} Wins
                  </Tag>
                  <Tag icon={<DislikeOutlined />} color="red">
                    {selectedTrack.losses} Losses
                  </Tag>
                  <Tooltip title="Tỷ lệ thắng/thua">
                    <Tag color="cyan">
                      Win Rate: {(selectedTrack.winLossRatio * 100).toFixed(1)}%
                    </Tag>
                  </Tooltip>
                </Space>
              </motion.div>
            </AnimatePresence>
          </Card>
        </Col>

        {/* Bên phải: Danh sách bài hát */}
        <Col xs={24} lg={8} style={{ height: '100%' }}>
          <Card
            title={
              <Text style={{ color: '#fff' }}>
                Danh sách phát ({filteredTracks.length})
              </Text>
            }
            style={{
              background: '#1e293b',
              borderColor: '#334155',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            headStyle={{ borderColor: '#334155', flexShrink: 0 }}
            bodyStyle={{
              padding: '12px 16px',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredTracks}
              renderItem={(track, index) => {
                const isActive = track.id === selectedTrack.id
                return (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <List.Item
                      onClick={() => setSelectedTrack(track)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        marginBottom: 8,
                        background: isActive ? '#334155' : 'transparent',
                        border: isActive
                          ? '1px solid #6366f1'
                          : '1px solid transparent',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? '#818cf8' : '#64748b',
                          fontWeight: 'bold',
                          width: 28,
                          fontSize: 14,
                          textAlign: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Text>

                      <List.Item.Meta
                        avatar={
                          <div style={{ position: 'relative' }}>
                            <Avatar
                              shape="square"
                              size={44}
                              src={track.resourceUrl}
                              style={{ borderRadius: 6 }}
                            />
                            {isActive && (
                              <PlayCircleOutlined
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  color: '#818cf8',
                                  fontSize: 18,
                                }}
                              />
                            )}
                          </div>
                        }
                        title={
                          <Text
                            ellipsis
                            style={{
                              color: isActive ? '#818cf8' : '#e2e8f0',
                              fontWeight: isActive ? 600 : 400,
                              display: 'block',
                            }}
                          >
                            {track.name}
                          </Text>
                        }
                        description={
                          <Space
                            split={<Text style={{ color: '#64748b' }}>•</Text>}
                          >
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                              Rank #{track.ranking}
                            </Text>
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                              Win: {(track.winLossRatio * 100).toFixed(0)}%
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  </motion.div>
                )
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
