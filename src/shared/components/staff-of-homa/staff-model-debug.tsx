import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'

const MODEL_PATH = '/models/staff-of-homa/scene.gltf'

export function StaffModelDebug() {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(MODEL_PATH)

  // 🔍 DEBUG: Log tất cả mesh names
  useEffect(() => {
    console.log('🔍 STAFF MODEL STRUCTURE:')
    console.log('=====================================')
    
    const meshInfo: Array<{ name: string; type: string; geometry?: string }> = []
    
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshInfo.push({
          name: object.name,
          type: object.type,
          geometry: object.geometry?.type,
        })
        
        // Log chi tiết
        console.log(`✓ MESH: "${object.name}"`)
        console.log(`  └─ Type: ${object.type}`)
        console.log(`  └─ Geometry: ${object.geometry?.type}`)
        console.log(`  └─ Material: ${object.material?.type}`)
        console.log('')
      }
    })
    
    console.log('=====================================')
    console.log(`📊 TOTAL MESHES: ${meshInfo.length}`)
    console.log('=====================================')
    
    // In bảng
    console.table(meshInfo)
    
    // 💡 Suggest mesh names cho flame
    console.log('\n💡 MESH NAMES CHO SHADER:')
    meshInfo.forEach(mesh => {
      const name = mesh.name.toLowerCase()
      if (name.includes('head') || name.includes('orb') || name.includes('sphere') || 
          name.includes('top') || name.includes('tip') || name.includes('flame')) {
        console.log(`  👉 "${mesh.name}" - CÓ THỂ DÙNG CHO FLAME`)
      }
    })
    
  }, [scene])

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.3} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)