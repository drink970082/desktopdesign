import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Tabletop slab on four legs. Top surface sits at y = h (base origin at the floor). */
export function Desk({ dimensions: [w, h, d], colors }: ModelProps) {
  const top = useStandardMaterial(colors.top ?? '#c79a6b', { roughness: 0.6 })
  const frame = useStandardMaterial(colors.frame ?? '#6f6f73', { roughness: 0.5, metalness: 0.3 })

  const topThk = 0.03
  const legThk = 0.05
  const legH = Math.max(h - topThk, 0.05)
  const inset = legThk / 2 + 0.03
  const lx = w / 2 - inset
  const lz = d / 2 - inset
  const legs: Array<[number, number]> = [
    [-lx, -lz],
    [lx, -lz],
    [-lx, lz],
    [lx, lz],
  ]

  return (
    <group>
      <mesh position={[0, h - topThk / 2, 0]} castShadow receiveShadow material={top}>
        <boxGeometry args={[w, topThk, d]} />
      </mesh>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow material={frame}>
          <boxGeometry args={[legThk, legH, legThk]} />
        </mesh>
      ))}
    </group>
  )
}
