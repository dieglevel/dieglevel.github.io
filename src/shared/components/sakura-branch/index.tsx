import React from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'

interface SakuraBranchProps {
  className?: string
  size?: number | string
}

// Cả cành đung đưa rất nhẹ
const branchVariants: Variants = {
  animate: {
    rotate: [-0.8, 1.2, -0.8],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
}

// Hoa 1: nở ra rồi lắc nhẹ
const flower1Variants: Variants = {
  initial: { scale: 0, opacity: 0, rotate: -30 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: [0, 3, 0, -3, 0],
    transition: {
      scale: { duration: 0.8, ease: 'backOut' },
      opacity: { duration: 0.5 },
      rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
    },
  },
}

// Hoa 2: nở trễ hơn một nhịp
const flower2Variants: Variants = {
  initial: { scale: 0, opacity: 0, rotate: 20 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: [0, -4, 0, 4, 0],
    transition: {
      scale: { duration: 0.8, delay: 0.3, ease: 'backOut' },
      opacity: { duration: 0.5, delay: 0.3 },
      rotate: {
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1.1,
      },
    },
  },
}

// Nhụy giữa nhấp nháy nhẹ
const coreVariants: Variants = {
  animate: {
    scale: [1, 1.12, 1],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
}

/**
 * Một bông hoa 5 cánh, tâm ở (0,0).
 * Vòng tròn trong suốt r=120 giúp tâm bounding box trùng (0,0),
 * nên motion xoay/scale quanh đúng tâm hoa (transform-box: fill-box).
 */
const Flower: React.FC<{ variants: Variants }> = ({ variants }) => (
  <motion.g variants={variants} initial="initial" animate="animate">
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

export const SakuraBranch: React.FC<SakuraBranchProps> = ({
  className = '',
  size = 700,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-[22%] bg-[#FFF1E0] overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
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

          {/* 1 cánh hoa: đầu cánh có khía, mảng hồng đậm ở gốc, chấm sáng */}
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

          {/* Bông hoa 5 cánh, mỗi cánh cách nhau 72° */}
          <g id="flower">
            <use href="#petal" transform="rotate(0)" />
            <use href="#petal" transform="rotate(72)" />
            <use href="#petal" transform="rotate(144)" />
            <use href="#petal" transform="rotate(216)" />
            <use href="#petal" transform="rotate(288)" />
          </g>
        </defs>

        {/* --- CÀNH PHỤ (sẫm, nằm phía sau) --- */}
        <path
          d="M100 312 C170 272 226 240 246 190 C260 150 285 112 306 78"
          stroke="#6E2C22"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M238 302 L292 268"
          stroke="#7A3024"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* --- CÀNH CHÍNH --- */}
        <path
          d="M62 382 L432 118"
          stroke="#A24427"
          strokeWidth="34"
          strokeLinecap="round"
        />
        {/* Mảng sáng (mắt gỗ) */}
        <path
          d="M92 360 L160 312"
          stroke="#D0714A"
          strokeWidth="30"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M352 174 L410 133"
          stroke="#C0603A"
          strokeWidth="26"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Bóng dưới thân cành */}
        <path
          d="M76 386 L420 140"
          stroke="#7E3120"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* --- HOA 1 (trên trái): <g> ngoài giữ vị trí, motion.g trong lo animation --- */}
        <g transform="translate(162, 178) scale(1.05)">
          <Flower variants={flower1Variants} />
        </g>

        {/* --- HOA 2 (dưới phải): xoay sẵn 25° cho khác hoa 1 --- */}
        <g transform="translate(355, 325) rotate(25) scale(1.02)">
          <Flower variants={flower2Variants} />
        </g>
      </motion.svg>
    </div>
  )
}

export default SakuraBranch
