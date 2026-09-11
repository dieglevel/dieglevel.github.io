import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'

const MODEL_PATH = '/models/staff-of-homa/scene.gltf'

interface PlaneEffectState {
  rotationX: number
  rotationZ: number
}

export function StaffModel() {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(MODEL_PATH)
  const planeEffectState = useRef<PlaneEffectState>({
    rotationX: 0,
    rotationZ: 0,
  })

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.castShadow = true
      object.receiveShadow = true

      if (object.material instanceof THREE.MeshStandardMaterial) {
        object.material = object.material.clone()
        object.material.roughness = 0.3
        object.material.metalness = 0.4
      }
    })
    return clone
  }, [scene])

  useFrame((state, delta) => {
    if (!group.current) return
    const time = state.clock.elapsedTime

    // ===== BASE MODEL ANIMATION =====
    const baseScale = 3
    const targetScale = baseScale + Math.sin(time * 4) * 0.008
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 4,
    )

    // ===== PLANE EFFECTS =====
    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      const name = object.name.toLowerCase()
      const isPlane = name.includes('plane')

      if (object.material instanceof THREE.MeshStandardMaterial && isPlane) {
        // 4. GLOW EFFECT - Emissive animation
        // Nhấp nháy rực rỡ
        // const glowIntensity = 0.03 + Math.sin(time * 1) * 1
        // object.material.emissive.setHex(0xff4500) // Orange-red glow
        // object.material.emissiveIntensity = glowIntensity
        // // 5. COLOR CYCLING - Thay đổi màu sắc cơ sở
        // // Chu kỳ từ cam sang đỏ sang hồng
        // const hue = (time * 0.3) % 1
        // const color = new THREE.Color()
        // color.setHSL(hue * 0.1 + 0.08, 1, 0.6) // Hue giữa orange-red
        // object.material.color.lerp(color, delta * 0.5)
        // // 6. METALNESS PULSE - Phản xạ ánh sáng thay đổi
        // object.material.metalness = 0.5 + Math.sin(time * 3) * 0.3
        // // 7. ROUGHNESS VARIATION
        // object.material.roughness = 0.2 + Math.sin(time * 1.5) * 0.15
      }
    })

    // ===== OTHER COMPONENTS - Orb/Sphere effects =====
    clonedScene.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshStandardMaterial
      ) {
        const name = object.name.toLowerCase()
        const isTargetComponent =
          name.includes('orb') || name.includes('sphere')

        if (isTargetComponent) {
          // Bright white with subtle glow
          object.material.color = new THREE.Color('#ffffff').multiplyScalar(2.0)
          object.material.emissive.setHex(0x000000)
          object.material.emissiveIntensity = 0
          object.material.roughness = 0.1
          object.material.metalness = 0.1
        }
      }
    })

    // ===== SMOOTH EMISSIVE FALLOFF =====
    clonedScene.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshStandardMaterial
      ) {
        const name = object.name.toLowerCase()
        const isPlane = name.includes('plane')

        if (!isPlane) {
          // Plane effects tetap, non-plane falloff to dark
          const targetColor = new THREE.Color('#000000')
          object.material.emissive.lerp(targetColor, delta * 5)
          object.material.emissiveIntensity = THREE.MathUtils.lerp(
            object.material.emissiveIntensity,
            0,
            delta * 5,
          )
        }
      }
    })
  })

  return (
    <group ref={group}>
      <primitive object={clonedScene} scale={1.3} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
