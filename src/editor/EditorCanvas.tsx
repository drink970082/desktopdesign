import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { type Ref } from 'react'
import Lighting from './Lighting'
import Floor from './Floor'
import { INITIAL_CAMERA, type EditorControls } from './cameraConfig'

export default function EditorCanvas({ controlsRef }: { controlsRef: Ref<EditorControls> }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      // preserveDrawingBuffer lets us read pixels for PNG export later.
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.05, far: 100, position: INITIAL_CAMERA.position }}
    >
      <color attach="background" args={['#2a363b']} />
      <fog attach="fog" args={['#2a363b', 9, 22]} />

      <Lighting />
      <Floor />

      {/* TEMP placeholder desk slab — replaced by real scene objects in a later step. */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.03, 0.6]} />
        <meshStandardMaterial color="#9c6b3f" roughness={0.7} />
      </mesh>

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
