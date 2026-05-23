import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Rounded case with a few keycap rows suggested on top (low-poly). Base at y=0. */
export function Keyboard({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1c1c1f', { roughness: 0.6 })
  const keys = useStandardMaterial(colors.accent ?? '#3a3a3f', { roughness: 0.8 })

  const rows = 5
  const keyAreaD = d * 0.82
  const rowD = keyAreaD / rows

  return (
    <group>
      <RoundedBox
        args={[w, h, d]}
        radius={0.004}
        smoothness={3}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
        material={body}
      />
      {Array.from({ length: rows }, (_, r) => {
        const z = -keyAreaD / 2 + rowD * (r + 0.5)
        return (
          <mesh key={r} position={[0, h + 0.004, z]} castShadow material={keys}>
            <boxGeometry args={[w * 0.92, 0.008, rowD * 0.7]} />
          </mesh>
        )
      })}
    </group>
  )
}
