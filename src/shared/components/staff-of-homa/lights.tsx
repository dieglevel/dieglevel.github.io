export function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 4]} intensity={4} />
      <pointLight
        position={[0, 0, 0]}
        color="#ff3b1f"
        intensity={6}
        distance={6}
      />
      <pointLight
        position={[0, -2, 2]}
        color="#ff9f43"
        intensity={3}
        distance={5}
      />
    </>
  )
}
