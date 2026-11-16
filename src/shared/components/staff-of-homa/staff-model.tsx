import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'

// Optimized with: npx @gltf-transform/cli optimize scene.gltf staff.glb \
//   --compress meshopt --texture-compress webp --join false --flatten false
// (--join/--flatten false keep mesh names, which the effects below rely on)
const MODEL_PATH = '/models/staff-of-homa/staff.glb'

const BASE_SCALE = 3
const BLACK = new THREE.Color('#000000')

export function StaffModel() {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(MODEL_PATH)
  const targetScale = useRef(new THREE.Vector3())

  const { clonedScene, fadingMaterials } = useMemo(() => {
    const clone = scene.clone(true)
    const fading: Array<THREE.MeshStandardMaterial> = []

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.castShadow = true
      object.receiveShadow = true

      if (!(object.material instanceof THREE.MeshStandardMaterial)) return
      const material = object.material.clone()
      object.material = material
      material.roughness = 0.3
      material.metalness = 0.4

      const name = object.name.toLowerCase()

      // Orb/Sphere: bright white with subtle glow (static, applied once)
      if (name.includes('orb') || name.includes('sphere')) {
        material.color = new THREE.Color('#ffffff').multiplyScalar(2.0)
        material.emissive.setHex(0x000000)
        material.emissiveIntensity = 0
        material.roughness = 0.1
        material.metalness = 0.1
      }

      // Non-plane meshes: emissive smoothly falls off to dark
      if (!name.includes('plane')) fading.push(material)
    })

    return { clonedScene: clone, fadingMaterials: fading }
  }, [scene])

  useFrame((state, delta) => {
    if (!group.current) return
    const time = state.clock.elapsedTime

    // ===== BASE MODEL ANIMATION =====
    const scale = BASE_SCALE + Math.sin(time * 4) * 0.008
    group.current.scale.lerp(
      targetScale.current.set(scale, scale, scale),
      delta * 4,
    )

    // ===== SMOOTH EMISSIVE FALLOFF =====
    for (const material of fadingMaterials) {
      if (material.emissiveIntensity < 1e-4) continue
      material.emissive.lerp(BLACK, delta * 5)
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        0,
        delta * 5,
      )
    }
  })

  return (
    <group ref={group}>
      <primitive object={clonedScene} scale={1.3} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
