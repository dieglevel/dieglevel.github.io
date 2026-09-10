import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Lights } from './lights'
import { MinimalGameMenu } from './minimal-game-menu'
import { SmoothEnergyParticles } from './smooth-energy-particles'
import { StaffModel } from './staff-model'

export function StaffOfHoma() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 30% 50%, #1a0a08 0%, #030303 80%)',
      }}
    >
      <MinimalGameMenu />

      <Canvas
        shadows
        camera={{ position: [0, 2, 6], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Lights />

        <group position={[-0.9, 0, 4]}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <StaffModel />
          </Float>
          <SmoothEnergyParticles />
          <Sparkles count={120} scale={[4, 5, 4]} size={1.5} speed={0.6} opacity={0.5} color="#ffaa44" />
        </group>

        <OrbitControls enableDamping dampingFactor={0} target={[-1.8, 0, 0]} />
      </Canvas>
    </div>
  )
}