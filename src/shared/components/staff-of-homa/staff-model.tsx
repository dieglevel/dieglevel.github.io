import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'

const MODEL_PATH = '/models/staff-of-homa/scene.gltf'

export function StaffModel() {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(MODEL_PATH)

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

    group.current.rotation.y = time * 0.25

    const baseScale = 3
    const targetScale = baseScale + Math.sin(time * 4) * 0.03
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4)

// Cập nhật emissive riêng cho từng Mesh
    clonedScene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        const name = object.name.toLowerCase()

        const isGlowComponent = name.includes('plane')

        if (isGlowComponent) {
                object.material.emissive.setHex(0xff0000)
                object.material.emissiveIntensity = 1.5 + Math.sin(time * 6) * 10

        } else {
          // Các thành phần KHÔNG glow
          object.material.emissive.setHex(0x000000)
          object.material.emissiveIntensity = 0
        }
      }
    })

    clonedScene.traverse((object) => {
  if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
    const name = object.name.toLowerCase()
    const isTargetComponent = name.includes('orb') || name.includes('sphere') || name.includes('plane')

    if (isTargetComponent) {
      // 1. Nhân độ sáng của màu gốc lên (Tăng RGB > 1 giúp vật liệu sáng rực rỡ)
      object.material.color = new THREE.Color('#ffffff').multiplyScalar(2.0) 
      
      // 2. Tắt hoàn toàn Emissive để KHÔNG bị Glow/Bloom
      object.material.emissive.setHex(0x000000)
      object.material.emissiveIntensity = 0

      // 3. Tăng khả năng bắt sáng
      object.material.roughness = 0.1 // Nhẵn bóng hơn để phản xạ đèn tốt hơn
      object.material.metalness = 0.1
    }
  }
})

    clonedScene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        const targetColor = new THREE.Color('#000000')
        object.material.emissive.lerp(targetColor, delta * 5)
        object.material.emissiveIntensity = THREE.MathUtils.lerp(
          object.material.emissiveIntensity,
          0,
          delta * 5
        )
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