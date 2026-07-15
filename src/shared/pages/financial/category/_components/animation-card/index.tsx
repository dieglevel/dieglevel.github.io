import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Col, Flex, Row, Spin } from 'antd'

// Định nghĩa props cho Component
interface AnimatedGridProps<T> {
  items: Array<T>
  isPending: boolean
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => string | number
}

// 1. Khởi tạo motion components từ Ant Design
const MotionRow = motion.create(Row)
const MotionCol = motion.create(Col)

// 2. Định nghĩa cấu hình Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }, // Hiệu ứng thác nước cách nhau 0.08s
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const AnimatedGrid = <T,>({
  items,
  isPending,
  renderItem,
  getKey,
}: AnimatedGridProps<T>) => {
  return (
    <AnimatePresence mode="wait">
      {isPending ? (
        <Flex
          key="loading"
          vertical
          gap={16}
          style={{ width: '100%', minHeight: '200px' }}
          align="center"
          justify="center"
        >
          <Spin size="large" />
        </Flex>
      ) : (
        <MotionRow
          key="content"
          gutter={[16, 16]}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          <AnimatePresence>
            {items.map((item) => (
              <MotionCol
                key={getKey(item)} // Lấy key động thông qua hàm getKey
                xs={24}
                sm={12}
                xl={8}
                variants={itemVariants}
                layout // Tự động gom mượt các card còn lại khi có 1 card bị xóa
                exit="exit"
              >
                {renderItem(item)}
              </MotionCol>
            ))}
          </AnimatePresence>
        </MotionRow>
      )}
    </AnimatePresence>
  )
}
