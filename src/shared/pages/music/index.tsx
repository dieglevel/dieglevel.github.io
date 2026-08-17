import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Button,
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
  BarsOutlined,
  DislikeOutlined,
  LikeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
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

// Hàm trích xuất YouTube Video ID từ link Embed/Watch
const extractVideoId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

export default function MusicPlayerPage() {
  const [tracks] = useState<Array<Track>>(sampleTracks)
  const [selectedTrack, setSelectedTrack] = useState<Track>(sampleTracks[0])
  const [search, setSearch] = useState('')
  const [isShuffle, setIsShuffle] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const playerRef = useRef<any>(null)
  const isApiReadyRef = useRef<boolean>(false)

  const filteredTracks = tracks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Ref lưu trữ state mới nhất cho các callback của YouTube & MediaSession API
  const stateRef = useRef({
    selectedTrack,
    filteredTracks,
    tracks,
    isShuffle,
    isPlaying,
  })

  useEffect(() => {
    stateRef.current = {
      selectedTrack,
      filteredTracks,
      tracks,
      isShuffle,
      isPlaying,
    }
  }, [selectedTrack, filteredTracks, tracks, isShuffle, isPlaying])

  // Logic chuyển bài tiếp theo
  // 1. Định nghĩa logic Next/Prev bọc trong useCallback và lấy state từ stateRef
  const playNextTrack = useCallback(() => {
    const {
      selectedTrack: currentTrack,
      filteredTracks: currentFiltered,
      tracks: currentTracks,
      isShuffle: currentShuffle,
    } = stateRef.current

    const listToPlay =
      currentFiltered.length > 0 ? currentFiltered : currentTracks

    if (listToPlay.length === 0) return

    if (currentShuffle && listToPlay.length > 1) {
      const otherTracks = listToPlay.filter((t) => t.id !== currentTrack.id)
      const randomIndex = Math.floor(Math.random() * otherTracks.length)
      setSelectedTrack(otherTracks[randomIndex])
    } else {
      const currentIndex = listToPlay.findIndex((t) => t.id === currentTrack.id)
      if (currentIndex !== -1 && currentIndex < listToPlay.length - 1) {
        setSelectedTrack(listToPlay[currentIndex + 1])
      } else {
        setSelectedTrack(listToPlay[0])
      }
    }
  }, [])

  const playPrevTrack = useCallback(() => {
    const {
      selectedTrack: currentTrack,
      filteredTracks: currentFiltered,
      tracks: currentTracks,
      isShuffle: currentShuffle,
    } = stateRef.current

    const listToPlay =
      currentFiltered.length > 0 ? currentFiltered : currentTracks

    if (listToPlay.length === 0) return

    if (currentShuffle && listToPlay.length > 1) {
      const otherTracks = listToPlay.filter((t) => t.id !== currentTrack.id)
      const randomIndex = Math.floor(Math.random() * otherTracks.length)
      setSelectedTrack(otherTracks[randomIndex])
    } else {
      const currentIndex = listToPlay.findIndex((t) => t.id === currentTrack.id)
      if (currentIndex > 0) {
        setSelectedTrack(listToPlay[currentIndex - 1])
      } else {
        setSelectedTrack(listToPlay[listToPlay.length - 1])
      }
    }
  }, [])

  // 2. Đăng ký MediaSession Handler với OS
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    // Cập nhật Metadata cho OS/Notification
    navigator.mediaSession.metadata = new MediaMetadata({
      title: selectedTrack.name,
      artist: `Rank #${selectedTrack.ranking}`,
      artwork: [
        {
          src: selectedTrack.resourceUrl,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    })

    // Đăng ký các handler
    const actionHandlers: Array<
      [MediaSessionAction, MediaSessionActionHandler]
    > = [
      [
        'play',
        () => {
          if (playerRef.current?.playVideo) playerRef.current.playVideo()
        },
      ],
      [
        'pause',
        () => {
          if (playerRef.current?.pauseVideo) playerRef.current.pauseVideo()
        },
      ],
      ['previoustrack', playPrevTrack],
      ['nexttrack', playNextTrack],
    ]

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler)
      } catch (error) {
        console.warn(`The media session action "${action}" is not supported.`)
      }
    }
  }, [selectedTrack, playNextTrack, playPrevTrack])

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  // Tải YouTube Iframe Player API & Khởi tạo Player
  useEffect(() => {
    const initPlayer = () => {
      const videoId = extractVideoId(selectedTrack.videoUrl)

      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
            setIsPlaying(true)
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING === 1
            if (event.data === 1) {
              setIsPlaying(true)
              if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing'
              }
            }
            // YT.PlayerState.PAUSED === 2
            else if (event.data === 2) {
              setIsPlaying(false)
              if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused'
              }
            }
            // YT.PlayerState.ENDED === 0
            else if (event.data === 0) {
              setIsPlaying(false)
              playNextTrack()
            }
          },
        },
      })
    }

    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      ;(window as any).onYouTubeIframeAPIReady = () => {
        isApiReadyRef.current = true
        initPlayer()
      }
    } else if ((window as any).YT && (window as any).YT.Player) {
      isApiReadyRef.current = true
      initPlayer()
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [])

  // Đổi bài hát
  useEffect(() => {
    const videoId = extractVideoId(selectedTrack.videoUrl)
    if (
      playerRef.current &&
      typeof playerRef.current.loadVideoById === 'function'
    ) {
      playerRef.current.loadVideoById(videoId)
      setIsPlaying(true)
    }
  }, [selectedTrack])

  // Cấu hình MediaSession API của Hệ Điều Hành / Trình Duyệt
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    // Cập nhật thông tin Bài hát đang phát hiển thị trên OS / Lock screen
    navigator.mediaSession.metadata = new MediaMetadata({
      title: selectedTrack.name,
      artist: `Rank #${selectedTrack.ranking}`,
      artwork: [
        {
          src: selectedTrack.resourceUrl,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    })

    // Đăng ký Action Handlers cho các phím chức năng của Hệ Điều Hành / Tai nghe
    navigator.mediaSession.setActionHandler('play', () => {
      if (
        playerRef.current &&
        typeof playerRef.current.playVideo === 'function'
      ) {
        playerRef.current.playVideo()
      }
    })

    navigator.mediaSession.setActionHandler('pause', () => {
      if (
        playerRef.current &&
        typeof playerRef.current.pauseVideo === 'function'
      ) {
        playerRef.current.pauseVideo()
      }
    })

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrevTrack()
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNextTrack()
    })

    navigator.mediaSession.setActionHandler('stop', () => {
      if (
        playerRef.current &&
        typeof playerRef.current.stopVideo === 'function'
      ) {
        playerRef.current.stopVideo()
      }
    })
  }, [selectedTrack])

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
          <Space size="middle">
            <Tooltip
              title={isShuffle ? 'Tắt phát ngẫu nhiên' : 'Bật phát ngẫu nhiên'}
            >
              <Button
                type={isShuffle ? 'primary' : 'default'}
                icon={<BarsOutlined />}
                onClick={() => setIsShuffle(!isShuffle)}
                style={{
                  borderRadius: 20,
                  backgroundColor: isShuffle ? '#6366f1' : '#1e293b',
                  borderColor: isShuffle ? '#6366f1' : '#334155',
                  color: '#fff',
                }}
              >
                {isShuffle ? 'Shuffle On' : 'Shuffle Off'}
              </Button>
            </Tooltip>

            <Input
              placeholder="Tìm bài hát..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 260, borderRadius: 20 }}
              allowClear
            />
          </Space>
        </Col>
      </Row>

      {/* Main Container */}
      <Row gutter={[24, 24]} style={{ flex: 1, minHeight: 0 }}>
        {/* Left: Player */}
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
                maxHeight: 'calc(100% - 140px)',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <div
                id="youtube-player"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Sub-bar: Control buttons & track info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTrack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginTop: 12,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Visual Control Buttons */}
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title
                      level={4}
                      style={{ color: '#fff', margin: 0 }}
                      ellipsis
                    >
                      {selectedTrack.name}
                    </Title>
                  </Col>

                  <Col>
                    <Space size="middle">
                      <Tooltip title="Bài trước">
                        <Button
                          shape="circle"
                          size="large"
                          icon={<StepBackwardOutlined />}
                          onClick={playPrevTrack}
                          style={{
                            backgroundColor: '#334155',
                            borderColor: '#475569',
                            color: '#fff',
                          }}
                        />
                      </Tooltip>

                      <Tooltip title={isPlaying ? 'Tạm dừng' : 'Phát'}>
                        <Button
                          type="primary"
                          shape="circle"
                          size="large"
                          icon={
                            isPlaying ? (
                              <PauseCircleOutlined style={{ fontSize: 22 }} />
                            ) : (
                              <PlayCircleOutlined style={{ fontSize: 22 }} />
                            )
                          }
                          onClick={togglePlay}
                          style={{
                            backgroundColor: '#6366f1',
                            borderColor: '#6366f1',
                            width: 48,
                            height: 48,
                          }}
                        />
                      </Tooltip>

                      <Tooltip title="Bài tiếp theo">
                        <Button
                          shape="circle"
                          size="large"
                          icon={<StepForwardOutlined />}
                          onClick={playNextTrack}
                          style={{
                            backgroundColor: '#334155',
                            borderColor: '#475569',
                            color: '#fff',
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </Col>
                </Row>

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
                  {isShuffle && (
                    <Tag icon={<BarsOutlined />} color="purple">
                      Shuffle Active
                    </Tag>
                  )}
                </Space>
              </motion.div>
            </AnimatePresence>
          </Card>
        </Col>

        {/* Right: Tracklist */}
        <Col xs={24} lg={8} style={{ height: '100%' }}>
          <Card
            title={
              <Row justify="space-between" align="middle">
                <Text style={{ color: '#fff' }}>
                  Danh sách phát ({filteredTracks.length})
                </Text>
                {isShuffle && (
                  <Text style={{ color: '#a855f7', fontSize: 12 }}>
                    🔀 Ngẫu nhiên
                  </Text>
                )}
              </Row>
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
