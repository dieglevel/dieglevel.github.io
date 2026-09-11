import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Lights } from './lights'
import { MinimalGameMenu } from './minimal-game-menu/minimal-game-menu'
import { StaffModel } from './staff-model'

export function StaffOfHoma() {
  return (
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
      <MinimalGameMenu />
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        resize={{
          scroll: false,
        }}
      >
        <Lights />

        <group position={[-1, 0.1, 4]}>
          <Float speed={4} rotationIntensity={0.1} floatIntensity={0.5}>
            <StaffModel />
          </Float>
          {/* <SmoothEnergyParticles /> */}
          <Sparkles
            count={400}
            scale={[4, 5, 4]}
            speed={0.6}
            opacity={0.5}
            color="#ffaa44"
          />
        </group>

        <OrbitControls
          enableDamping
          dampingFactor={0}
          target={[-1.8, 0, 0]}
          enableZoom={false}
        />
      </Canvas>
    </div>
  )
}
