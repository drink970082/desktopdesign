import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Mug with a coffee surface and a torus handle. Base at y=0. */
export function CoffeeCup({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#e8e8ea', { roughness: 0.4 })
  const coffee = useStandardMaterial('#3a2418', { roughness: 0.3 })
  const r = Math.min(w, d) / 2
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={body}>
        <cylinderGeometry args={[r, r * 0.9, h, 24]} />
      </mesh>
      <mesh position={[0, h * 0.92, 0]} material={coffee}>
        <cylinderGeometry args={[r * 0.86, r * 0.86, 0.005, 24]} />
      </mesh>
      <mesh position={[r, h * 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={body}>
        <torusGeometry args={[h * 0.28, 0.008, 12, 24]} />
      </mesh>
    </group>
  )
}
