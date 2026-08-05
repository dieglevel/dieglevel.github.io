import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Col, Flex, Row, Spin } from 'antd'
import type { Variants } from 'framer-motion'

interface AnimatedGridProps<T> {
  items: Array<T>
  isPending: boolean
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => string | number
}

const MotionRow = motion.create(Row)
const MotionCol = motion.create(Col)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants: Variants = {
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
        /* Container bọc ngoài triệt tiêu scrollbar ngang do gutter âm của Row */
        <div style={{ width: '100%', overflowX: 'hidden' }}>
          <MotionRow
            key="content"
            gutter={[
              { xs: 12, sm: 16, md: 16, lg: 20 }, // Gap ngang linh hoạt
              { xs: 12, sm: 16, md: 16, lg: 20 }, // Gap dọc linh hoạt
            ]}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {items.map((item) => (
                <MotionCol
                  key={getKey(item)}
                  xs={24} // Mobile: 1 cột
                  sm={12} // Tablet: 2 cột
                  lg={8} // Desktop: 3 cột
                  xxl={6} // Màn lớn: 4 cột
                  variants={itemVariants}
                  layout="position"
                  exit="exit"
                >
                  {renderItem(item)}
                </MotionCol>
              ))}
            </AnimatePresence>
          </MotionRow>
        </div>
      )}
    </AnimatePresence>
  )
}
