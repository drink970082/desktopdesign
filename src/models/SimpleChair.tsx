import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** A basic four-leg chair with a backrest (local backrest on -Z). Base at y=0. */
export function SimpleChair({ dimensions: [w, h, d], colors }: ModelProps) {
  const frame = useStandardMaterial(colors.body ?? '#6b7280', { roughness: 0.6, metalness: 0.2 })
  const seatH = h * 0.5
  const legT = 0.03
  const seatThk = 0.04
  const lx = w / 2 - legT
  const lz = d / 2 - legT
  const legs: Array<[number, number]> = [
    [-lx, -lz],
    [lx, -lz],
    [-lx, lz],
    [lx, lz],
  ]
  return (
    <group>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, seatH / 2, z]} castShadow material={frame}>
          <boxGeometry args={[legT, seatH, legT]} />
        </mesh>
      ))}
      <RoundedBox
        args={[w, seatThk, d]}
        radius={0.01}
        smoothness={3}
        position={[0, seatH, 0]}
        castShadow
        receiveShadow
        material={frame}
      />
      <RoundedBox
        args={[w, h - seatH, 0.04]}
        radius={0.01}
        smoothness={3}
        position={[0, seatH + (h - seatH) / 2, -d / 2 + 0.02]}
        castShadow
        material={frame}
      />
    </group>
  )
}
