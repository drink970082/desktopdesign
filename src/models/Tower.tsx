import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** PC tower with a tinted side panel on the +X face. Base at y=0. */
export function Tower({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1b1b1e', { roughness: 0.5, metalness: 0.3 })
  const glass = useStandardMaterial(colors.accent ?? '#2a2a30', { roughness: 0.1, metalness: 0.1 })
  return (
    <group>
      <RoundedBox
        args={[w, h, d]}
        radius={0.012}
        smoothness={3}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        material={body}
      />
      <mesh position={[w / 2 + 0.002, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={glass}>
        <planeGeometry args={[d * 0.82, h * 0.82]} />
      </mesh>
    </group>
  )
}
