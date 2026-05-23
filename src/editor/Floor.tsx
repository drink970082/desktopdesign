/** Large ground plane at y=0 that receives shadows. Floor-resting items (chairs) sit on this. */
export default function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#39474f" roughness={1} metalness={0} />
    </mesh>
  )
}
