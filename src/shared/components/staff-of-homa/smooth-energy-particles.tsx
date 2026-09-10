import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function createParticleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.3, 'rgba(255,120,50,0.8)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
  }
  return new THREE.CanvasTexture(canvas)
}

export function SmoothEnergyParticles() {
  const count = 200
  const pointsRef = useRef<THREE.Points>(null)
  const texture = useMemo(() => createParticleTexture(), [])

  const [positions, speeds, angles] = useMemo(() => {
    const positionValues = new Float32Array(count * 3)
    const speedValues = new Float32Array(count)
    const angleValues = new Float32Array(count)

    for (let index = 0; index < count; index++) {
      const radius = 0.8 + Math.random() * 1.2
      const angle = Math.random() * Math.PI * 2
      positionValues[index * 3] = Math.cos(angle) * radius
      positionValues[index * 3 + 1] = (Math.random() - 0.5) * 4
      positionValues[index * 3 + 2] = Math.sin(angle) * radius
      speedValues[index] = 0.005 + Math.random() * 0.012
      angleValues[index] = angle
    }
    return [positionValues, speedValues, angleValues]
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const positionValues = positionAttribute.array as Float32Array

    for (let index = 0; index < count; index++) {
      const positionIndex = index * 3
      positionValues[positionIndex + 1] += speeds[index]
      angles[index] += 0.005
      const radius = Math.sqrt(
        positionValues[positionIndex] ** 2 + positionValues[positionIndex + 2] ** 2
      )
      positionValues[positionIndex] = Math.cos(angles[index]) * radius
      positionValues[positionIndex + 2] = Math.sin(angles[index]) * radius

      if (positionValues[positionIndex + 1] > 2.5) {
        positionValues[positionIndex + 1] = -2.0
      }
    }

    positionAttribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        map={texture}
        transparent
        depthTest={false}
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}