import { useEditorStore } from '../store/useEditorStore'

/** Large ground plane at y=0 that receives shadows. Clicking it deselects. */
export default function Floor() {
  const select = useEditorStore((s) => s.select)
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation()
        select(null)
      }}
    >
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#cdd2d8" roughness={1} metalness={0} />
    </mesh>
  )
}
