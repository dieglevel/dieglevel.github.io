import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { Easing, MotionProps, TargetAndTransition } from 'motion/react'

/* ------------------------------------------------------------------ */
/* Bảng màu                                                           */
/* ------------------------------------------------------------------ */
const C = {
  bg: '#14171a',
  panel: '#2a2f33',
  steel: '#3d4449',
  light: '#d9dcd6',
  gold: '#b8923e',
  goldDark: '#8a6c2b',
  jade: '#2fd06a',
} as const

/* Easing máy móc: khởi động chậm, chạy dứt khoát */
const MECH: Easing = [0.65, 0, 0.25, 1]
const SNAP: Easing = [0.7, 0, 0.3, 1]

/*
 * Một nhịp thở (tính theo tỉ lệ 0 → 1 của `duration`):
 * hít vào 0–.38 · khựng .43 · giữ →.55 · thở ra →.88 · khựng .93 · nghỉ →1
 */
const BREATH = [0, 0.38, 0.43, 0.55, 0.88, 0.93, 1]
const SWELL = [0, 0.38, 0.55, 0.88, 1]

type Anim = (
  target: TargetAndTransition,
  times: Array<number>,
  opts?: { delay?: number; ease?: Easing },
) => Pick<MotionProps, 'animate' | 'transition'>

/* ------------------------------------------------------------------ */
/* Một phần tư (góc trên trái) — 3 phần còn lại lật gương             */
/* ------------------------------------------------------------------ */
function Quadrant({ a }: { a: Anim }) {
  const vent = (delay: number) =>
    a(
      { fill: [C.steel, C.steel, C.jade, C.jade, C.steel, C.steel] },
      [0, 0.06, 0.1, 0.48, 0.6, 1],
      { delay, ease: 'linear' },
    )

  const lamp = a(
    { opacity: [0.3, 1, 1, 0.3, 0.3], scale: [0.7, 1.15, 1.15, 0.7, 0.7] },
    SWELL,
    { ease: 'easeInOut' },
  )

  return (
    <g>
      {/* Toàn bộ phần tư nở ra khi hít, khép lại khi thở */}
      <motion.g
        {...a(
          { x: [0, -10, -8, -8, 1, 0, 0], y: [0, -10, -8, -8, 1, 0, 0] },
          BREATH,
        )}
      >
        {/* Biểu tượng góc */}
        <rect
          x={50}
          y={50}
          width={64}
          height={64}
          fill={C.panel}
          stroke={C.light}
          strokeWidth={4}
        />
        <motion.g
          {...a({ rotate: [0, 0, 96, 90, 90] }, [0, 0.32, 0.4, 0.45, 1], {
            ease: SNAP,
          })}
        >
          <rect
            x={66}
            y={66}
            width={32}
            height={32}
            fill="none"
            stroke={C.light}
            strokeWidth={4}
          />
        </motion.g>
        <motion.g
          style={{ fill: C.light }}
          {...a(
            { fill: [C.light, C.light, C.jade, C.jade, C.light, C.light] },
            [0, 0.3, 0.34, 0.55, 0.6, 1],
            { ease: 'linear' },
          )}
        >
          <rect x={78} y={78} width={8} height={8} />
        </motion.g>

        {/* Cột dọc — piston */}
        <motion.g
          {...a(
            { y: [0, -14, -11, -11, 2, 0, 0] },
            [0, 0.34, 0.39, 0.55, 0.82, 0.88, 1],
            {
              delay: 0.025,
              ease: SNAP,
            },
          )}
        >
          <rect x={330} y={30} width={70} height={200} fill={C.panel} />
          {[120, 90, 60].map((y, i) => (
            <motion.g key={y} style={{ fill: C.steel }} {...vent(i * 0.0375)}>
              <rect x={348} y={y} width={34} height={12} />
            </motion.g>
          ))}
        </motion.g>

        {/* Tay ngang — piston */}
        <motion.g
          {...a(
            { x: [0, -14, -11, -11, 2, 0, 0] },
            [0, 0.34, 0.39, 0.55, 0.82, 0.88, 1],
            {
              delay: 0.025,
              ease: SNAP,
            },
          )}
        >
          <rect x={30} y={330} width={200} height={70} fill={C.panel} />
          {[120, 90, 60].map((x, i) => (
            <motion.g key={x} style={{ fill: C.steel }} {...vent(i * 0.0375)}>
              <rect x={x} y={348} width={12} height={34} />
            </motion.g>
          ))}
        </motion.g>

        {/* Giá vàng chữ L — bị kéo theo, trễ một nhịp */}
        <motion.g
          {...a(
            { x: [0, -6, -6, 0, 0], y: [0, -6, -6, 0, 0] },
            [0, 0.42, 0.6, 0.92, 1],
            {
              delay: 0.05,
            },
          )}
        >
          <path d="M140 140 H260 V180 H180 V260 H140 Z" fill={C.gold} />
        </motion.g>

        {/* Khối vàng = túi phổi; lõi nâu = van nén */}
        <motion.g
          {...a({ scale: [0.92, 1.08, 1.04, 1.04, 0.92, 0.92, 0.92] }, BREATH)}
        >
          <rect x={226} y={226} width={74} height={74} rx={6} fill={C.gold} />
        </motion.g>
        <motion.g
          {...a({ scale: [1, 0.72, 0.72, 1, 1] }, SWELL, { ease: SNAP })}
        >
          <rect
            x={242}
            y={242}
            width={42}
            height={42}
            rx={4}
            fill={C.goldDark}
          />
        </motion.g>

        {/* Đèn ngọc */}
        <motion.g {...lamp}>
          <circle cx={300} cy={160} r={10} fill={C.jade} />
        </motion.g>
        <motion.g {...lamp}>
          <circle cx={160} cy={300} r={10} fill={C.jade} />
        </motion.g>
      </motion.g>

      {/* Ống khí — neo ở trục giữa, dài ra khi hít */}
      <motion.g
        style={{ originX: 1, originY: 0.5 }}
        {...a(
          {
            scaleX: [0.45, 1.12, 1.12, 0.45, 0.45],
            opacity: [0.45, 1, 1, 0.45, 0.45],
          },
          SWELL,
        )}
      >
        <rect x={340} y={260} width={60} height={24} fill={C.jade} />
      </motion.g>
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        {...a(
          {
            scaleY: [0.45, 1.12, 1.12, 0.45, 0.45],
            opacity: [0.45, 1, 1, 0.45, 0.45],
          },
          SWELL,
        )}
      >
        <rect x={260} y={340} width={24} height={60} fill={C.jade} />
      </motion.g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Component chính                                                    */
/* ------------------------------------------------------------------ */
export interface BreathingCoreProps {
  /** Kích thước hiển thị (px hoặc chuỗi CSS). Mặc định 400. */
  size?: number | string
  /** Thời lượng một nhịp thở, tính bằng giây. Mặc định 4. */
  duration?: number
  /** Tạm dừng nhịp thở. */
  paused?: boolean
  className?: string
  style?: CSSProperties
  /** Nhãn cho trình đọc màn hình. */
  title?: string
}

const MIRRORS = [
  undefined,
  'translate(800 0) scale(-1 1)',
  'translate(0 800) scale(1 -1)',
  'translate(800 800) scale(-1 -1)',
]

export function BreathingCore({
  size = 400,
  duration = 4,
  paused = false,
  className,
  style,
  title = 'Lõi máy đang thở',
}: BreathingCoreProps) {
  const reduceMotion = useReducedMotion()
  const still = reduceMotion || paused

  const a: Anim = (target, times, { delay = 0, ease = MECH } = {}) =>
    still
      ? {}
      : {
          animate: target,
          transition: {
            duration,
            times,
            ease,
            delay: delay * duration,
            repeat: Infinity,
          },
        }

  return (
    <svg
      viewBox="0 0 800 800"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
      style={{ display: 'block', overflow: 'hidden', ...style }}
    >
      {/* Nền */}
      <rect width={800} height={800} fill={C.bg} />
      <motion.path
        d="M12 12 H788 V788 H12 Z"
        fill="none"
        stroke={C.steel}
        strokeWidth={4}
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />

      {/* Cả cỗ máy nhấp nhô */}
      <motion.g {...a({ y: [0, -7, -5, -5, 1, 0, 0] }, BREATH)}>
        {MIRRORS.map((transform, i) => (
          <g key={i} transform={transform}>
            <Quadrant a={a} />
          </g>
        ))}

        {/* Lõi phổi trung tâm */}
        <motion.g
          {...a({ scale: [0.93, 1.07, 1.04, 1.04, 0.93, 0.93, 0.93] }, BREATH)}
        >
          {/* Bánh cóc: mỗi nhịp xoay một nấc rồi khóa */}
          <motion.g
            {...a({ rotate: [0, 0, 49, 45, 45] }, [0, 0.34, 0.42, 0.46, 1], {
              ease: SNAP,
            })}
          >
            <polygon
              points="354.4,290 445.6,290 510,354.4 510,445.6 445.6,510 354.4,510 290,445.6 290,354.4"
              fill={C.steel}
            />
          </motion.g>
          <motion.g
            {...a({ rotate: [0, 0, -49, -45, -45] }, [0, 0.36, 0.44, 0.48, 1], {
              ease: SNAP,
            })}
          >
            <polygon
              points="362,310 438,310 490,362 490,438 438,490 362,490 310,438 310,362"
              fill={C.panel}
            />
          </motion.g>

          <motion.g
            {...a({ opacity: [0.7, 1, 1, 0.7, 0.7] }, SWELL, {
              ease: 'easeInOut',
            })}
          >
            <circle cx={400} cy={400} r={70} fill={C.jade} />
          </motion.g>
          <motion.g
            {...a({ rotate: [0, 0, 20, 20] }, [0, 0.3, 0.4, 1], { ease: SNAP })}
          >
            <circle
              cx={400}
              cy={400}
              r={57.3}
              fill="none"
              stroke={C.bg}
              strokeWidth={4}
              strokeDasharray="8 12"
            />
          </motion.g>
          <circle cx={400} cy={400} r={44} fill={C.bg} />

          {/* Tim: đập hai nhịp đầu mỗi lần hít */}
          <motion.g
            {...a(
              { scale: [1, 1.3, 0.95, 1.15, 1, 1] },
              [0, 0.1, 0.2, 0.3, 0.45, 1],
              {
                ease: 'easeInOut',
              },
            )}
          >
            <circle cx={400} cy={400} r={22} fill={C.jade} />
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  )
}

export default BreathingCore
