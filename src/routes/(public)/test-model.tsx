import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

export const Route = createFileRoute('/(public)/test-model')({
  component: RouteComponent,
})

function Model() {
  const { scene } = useGLTF("/models/staff-of-homa/scene.gltf");

  return <primitive object={scene} />;
}


function RouteComponent() {
  return     <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      <Canvas camera={{ position: [3, 2, 5], rotation: [0, 90, 0] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} />

        <Model />

        <OrbitControls />
      </Canvas>
    </div>
}
