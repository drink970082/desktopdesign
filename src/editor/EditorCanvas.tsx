import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { type Ref } from 'react'
import Lighting from './Lighting'
import Floor from './Floor'
import Scene from './Scene'
import Screenshot from './Screenshot'
import { INITIAL_CAMERA, type EditorControls } from './cameraConfig'
import { useEditorStore } from '../store/useEditorStore'

export default function EditorCanvas({ controlsRef }: { controlsRef: Ref<EditorControls> }) {
  const select = useEditorStore((s) => s.select)
  const isDragging = useEditorStore((s) => s.isDragging)
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      // preserveDrawingBuffer lets us read pixels for PNG export later.
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.05, far: 100, position: INITIAL_CAMERA.position }}
      // Fires when a click hits no object → deselect.
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#eef1f4']} />
      <fog attach="fog" args={['#eef1f4', 16, 36]} />

      <Lighting />
      <Floor />
      <Scene />
      <Screenshot />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        // Belt-and-suspenders: drei disables this while the gizmo drags, and so do we.
        enabled={!isDragging}
        target={INITIAL_CAMERA.target}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minDistance={0.6}
        maxDistance={12}
      />
    </Canvas>
  )
}
