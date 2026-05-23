import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Speaker cabinet with woofer + tweeter cones on the front (+Z) face. Base at y=0. */
export function Speaker({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1c1c1f', { roughness: 0.6 })
  const cone = useStandardMaterial(colors.accent ?? '#0e0e10', { roughness: 0.5 })
  const front = d / 2 + 0.002
  return (
    <group>
      <RoundedBox
        args={[w, h, d]}
        radius={0.01}
        smoothness={3}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        material={body}
      />
      <mesh position={[0, h * 0.38, front]} rotation={[Math.PI / 2, 0, 0]} material={cone}>
        <cylinderGeometry args={[w * 0.32, w * 0.32, 0.01, 24]} />
      </mesh>
      <mesh position={[0, h * 0.72, front]} rotation={[Math.PI / 2, 0, 0]} material={cone}>
        <cylinderGeometry args={[w * 0.14, w * 0.14, 0.01, 20]} />
      </mesh>
    </group>
  )
}
