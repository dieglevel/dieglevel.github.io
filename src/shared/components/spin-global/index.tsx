import { motion } from 'motion/react'
import type { Transition, Variants } from 'motion/react'

const CYCLE = 3.6 // tổng thời gian 1 vòng (giây)

// Cả cành đung đưa nhẹ
const branchVariants: Variants = {
  animate: {
    rotate: [-0.8, 1.2, -0.8],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
}

/**
 * Tạo variants cho 1 bông hoa chạy vòng lặp.
 * offset: lệch pha (0–0.3) để hoa 2 nở trễ hơn hoa 1 nhưng vẫn loop mượt.
 * dir: hướng xoay lúc nở (-1 | 1)
 */
const makeFlowerVariants = (offset: number, dir: 1 | -1): Variants => {
  // Các mốc thời gian (0–1) trong 1 chu kỳ
  const times = [0, offset, offset + 0.25, offset + 0.5, offset + 0.7, 1].map(
    (t) => Math.min(t, 1),
  )

  const base: Transition = {
    duration: CYCLE,
    repeat: Infinity,
    times,
  }

  return {
    animate: {
      // ẩn → nở (overshoot) → giữ → giữ → thu lại → ẩn
      scale: [0, 0, 1.08, 1, 1, 0],
      opacity: [0, 0, 1, 1, 1, 0],
      rotate: [-30 * dir, -30 * dir, 0, 3 * dir, -3 * dir, 30 * dir],
      transition: {
        scale: { ...base, ease: 'easeInOut' },
        opacity: { ...base, ease: 'easeInOut' },
        rotate: { ...base, ease: 'easeInOut' },
      },
    },
  }
}

const flower1Variants = makeFlowerVariants(0, 1)
const flower2Variants = makeFlowerVariants(0.2, -1)

// Nhụy giữa nhấp nháy nhẹ
const coreVariants: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

const Flower: React.FC<{ variants: Variants }> = ({ variants }) => (
  <motion.g variants={variants} initial={false} animate="animate">
    <circle r="120" fill="none" />
    <use href="#flower" />
    <motion.circle
      r="24"
      fill="url(#core)"
      stroke="#F9B6CF"
      strokeWidth="3"
      variants={coreVariants}
    />
  </motion.g>
)

export const SpinGlobal = (
  <div style={{ width: 70, height: 70 }}>
    <motion.svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      variants={branchVariants}
      animate="animate"
    >
      <defs>
        <radialGradient id="core" cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFD3E4" />
        </radialGradient>

        <g id="petal">
          <path
            d="M0 0 C-32 -24 -58 -66 -34 -102 C-25 -117 -8 -117 0 -103 C8 -117 25 -117 34 -102 C58 -66 32 -24 0 0 Z"
            fill="#F7A8C4"
          />
          <path
            d="M0 -6 C-24 -26 -36 -56 -26 -84 C-10 -70 6 -42 0 -6 Z"
            fill="#FF4F8B"
            opacity="0.9"
          />
          <circle cx="0" cy="-66" r="12" fill="#FFD3E4" />
        </g>

        <g id="flower">
          <use href="#petal" transform="rotate(0)" />
          <use href="#petal" transform="rotate(72)" />
          <use href="#petal" transform="rotate(144)" />
          <use href="#petal" transform="rotate(216)" />
          <use href="#petal" transform="rotate(288)" />
        </g>
      </defs>

      <g transform="translate(162, 178) scale(1.05)">
        <Flower variants={flower1Variants} />
      </g>

      <g transform="translate(355, 325) rotate(25) scale(1.02)">
        <Flower variants={flower2Variants} />
      </g>
    </motion.svg>
  </div>
)
