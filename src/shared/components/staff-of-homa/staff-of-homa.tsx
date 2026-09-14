import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Grid } from 'antd'
import { Lights } from './lights'
import { StaffModel } from './staff-model'
import MinimalGameMenu from './minimal-game-menu/minimal-game-menu'

const { useBreakpoint } = Grid

// Component điều chỉnh Camera linh hoạt theo màn hình
function ResponsiveCamera() {
  const screens = useBreakpoint()
  const { camera } = useThree()

  useEffect(() => {
    // Màn hình nhỏ (Mobile/Tablet portrait) -> đẩy camera ra xa & tăng FOV
    if (!screens.md) {
      camera.position.set(0, 1.5, 8)
    } else {
      camera.position.set(0, 2, 6)
    }
    camera.updateProjectionMatrix()
  }, [screens, camera])

  return null
}

export function StaffOfHoma() {
  const [showMenu, setShowMenu] = useState(false)
  const screens = useBreakpoint()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMenu(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Điều chỉnh vị trí model 3D theo Responsive Breakpoint của Antd
  const modelPosition: [number, number, number] = screens.md
    ? [-1, 0.1, 4]
    : [0, -0.5, 2] // Căn giữa màn hình trên Mobile

  return (
    <>
      {showMenu && createPortal(<MinimalGameMenu />, document.body)}

      <div
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 30% 50%, #1a0a08 0%, #030303 80%)',
        }}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <Canvas
            camera={{ position: [0, 2, 6], fov: 45, far: 1000 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            resize={{ scroll: false }}
          >
            <ResponsiveCamera />
            <Lights />

            <group position={modelPosition}>
              <Float speed={4} rotationIntensity={0.1} floatIntensity={0.5}>
                <StaffModel />
              </Float>
              <Sparkles
                count={screens.md ? 400 : 200} // Giảm hạt trên mobile để tăng FPS
                scale={[4, 5, 4]}
                speed={0.6}
                opacity={0.5}
                color="#ffaa44"
              />
            </group>

            <OrbitControls
              enableDamping
              dampingFactor={0.05} // Tối ưu cảm giác mượt mà (chỉ số 0.05 tiêu chuẩn)
              target={screens.md ? [-1.8, 0, 0] : [0, 0, 0]}
              enableZoom={false}
            />
          </Canvas>
        </div>
      </div>
    </>
  )
}
