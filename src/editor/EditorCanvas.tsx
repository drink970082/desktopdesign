import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { type Ref } from 'react'
import Lighting from './Lighting'
import Floor from './Floor'
import Scene from './Scene'
import { INITIAL_CAMERA, type EditorControls } from './cameraConfig'
import { useEditorStore } from '../store/useEditorStore'

export default function EditorCanvas({ controlsRef }: { controlsRef: Ref<EditorControls> }) {
  const select = useEditorStore((s) => s.select)
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
      <color attach="background" args={['#2a363b']} />
      <fog attach="fog" args={['#2a363b', 9, 22]} />

      <Lighting />
      <Floor />
      <Scene />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        target={INITIAL_CAMERA.target}
        maxPolarAngle={Math.PI / 2 - 0.02}
        minDistance={0.6}
        maxDistance={12}
      />
    </Canvas>
  )
}
