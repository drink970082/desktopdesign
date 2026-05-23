import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Open laptop: deck + screen hinged at the rear edge. `h` is the screen height. Base at y=0. */
export function Laptop({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#9aa0a6', { roughness: 0.4, metalness: 0.6 })
  const screen = useStandardMaterial('#0a0a0e', {
    roughness: 0.2,
    emissive: '#11131a',
    emissiveIntensity: 0.5,
  })
  const deckThk = 0.015
  return (
    <group>
      <RoundedBox
        args={[w, deckThk, d]}
        radius={0.006}
        smoothness={3}
        position={[0, deckThk / 2, 0]}
        castShadow
        receiveShadow
        material={body}
      />
      {/* lid hinged at rear edge, leaning back ~110° */}
      <group position={[0, deckThk, -d / 2]} rotation={[-1.92, 0, 0]}>
        <RoundedBox
          args={[w, h, 0.008]}
          radius={0.006}
          smoothness={3}
          position={[0, h / 2, 0]}
          castShadow
          material={body}
        />
        <mesh position={[0, h / 2, 0.006]} material={screen}>
          <planeGeometry args={[w - 0.02, h - 0.02]} />
        </mesh>
      </group>
    </group>
  )
}
