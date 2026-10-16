import { useMemo, useState } from 'react'
import { Button, Flex, Input, Tooltip, Typography, theme } from 'antd'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Check, Copy } from 'lucide-react'
import { noiLaiAll, parseSyllable } from './helper'

const { Text, Title } = Typography

/** Tô màu phần vần (phần bị hoán đổi), giữ nguyên phụ âm đầu. */
function ColoredWords({ text, accent }: { text: string; accent: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => {
        const s = parseSyllable(word)
        const onsetLen = s ? s.onset.length : 0
        return (
          <span key={i}>
            {i > 0 && ' '}
            {word.slice(0, onsetLen)}
            <span style={{ color: accent }}>{word.slice(onsetLen)}</span>
          </span>
        )
      })}
    </>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard không khả dụng (http, quyền bị chặn) -> bỏ qua
    }
  }

  return (
    <Tooltip title={copied ? 'Đã sao chép' : 'Sao chép'}>
      <Button
        type="text"
        aria-label="Sao chép kết quả"
        icon={copied ? <Check size={16} /> : <Copy size={16} />}
        onClick={handleCopy}
      />
    </Tooltip>
  )
}

export default function TalkingDriving() {
  const { token } = theme.useToken()
  const [input, setInput] = useState('')

  const groups = useMemo(() => noiLaiAll(input), [input])
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length

  return (
    <MotionConfig reducedMotion="user">
      <Flex
        vertical
        gap={20}
        style={{ maxWidth: 560, margin: '0 auto', padding: 16 }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Nói lái
          </Title>
          <Text type="secondary">
            Hoán đổi phần vần và dấu giữa hai tiếng, giữ nguyên phụ âm đầu.
          </Text>
        </div>

        <Input
          size="large"
          value={input}
          allowClear
          placeholder="Nhập một cụm từ, ví dụ: đi học"
          aria-label="Cụm từ cần nói lái"
          onChange={(e) => setInput(e.target.value)}
        />

        {wordCount < 2 ? (
          <Text type="secondary">Nhập ít nhất hai tiếng để nói lái.</Text>
        ) : groups.length === 0 ? (
          <Text type="danger">
            Không tách được tiếng nào. Hãy kiểm tra lại, cụm từ cần là tiếng
            Việt.
          </Text>
        ) : (
          <Flex vertical gap={12}>
            <AnimatePresence mode="popLayout" initial={false}>
              {groups.map((g) => (
                <motion.div
                  key={g.source}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    padding: '12px 16px',
                    background: token.colorBgContainer,
                  }}
                >
                  <Text type="secondary">{g.source}</Text>
                  {g.variants.map((v, i) => (
                    <Flex
                      key={v.kind}
                      align="center"
                      justify="space-between"
                      gap={12}
                      style={{
                        marginTop: 8,
                        paddingTop: i > 0 ? 8 : 0,
                        borderTop:
                          i > 0
                            ? `1px dashed ${token.colorBorderSecondary}`
                            : undefined,
                      }}
                    >
                      <Flex vertical>
                        <Text strong style={{ fontSize: 24, lineHeight: 1.3 }}>
                          <ColoredWords
                            text={v.result}
                            accent={token.colorPrimary}
                          />
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: token.fontSizeSM }}
                        >
                          {v.label}
                        </Text>
                      </Flex>
                      <CopyButton value={v.result} />
                    </Flex>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              Phần màu là phần vần đã được đổi chỗ. Kiểu giữ dấu tại chỗ có thể
              cho âm tiết không chuẩn.
              {groups.length > 1 &&
                ' Với cụm dài, mỗi cặp tiếng cho một nhóm kết quả.'}
            </Text>
          </Flex>
        )}
      </Flex>
    </MotionConfig>
  )
}
