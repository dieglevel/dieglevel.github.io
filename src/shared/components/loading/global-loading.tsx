import { Flex, Spin } from 'antd'
import { useLoadingStore } from '@/shared/store/loading.store'

export default function GlobalLoading() {
  const isLoading = useLoadingStore((state) => state.isLoading)

  if (!isLoading) return null
  return (
    <Flex
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 100,
      }}
      justify="center"
      align="center"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Spin />
    </Flex>
  )
}
