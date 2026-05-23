import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Desk lamp: weighted base, pole, and a tilted open shade. Base at y=0. */
export function Lamp({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#2b2b30', { roughness: 0.5, metalness: 0.4 })
  const shade = useStandardMaterial(colors.accent ?? '#e7e3d8', {
    roughness: 0.7,
    emissive: '#3a3526',
    emissiveIntensity: 0.25,
  })
  const baseR = w * 0.45
  const poleH = h * 0.85
  return (
    <group>
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow material={body}>
        <cylinderGeometry args={[baseR, baseR, 0.02, 24]} />
      </mesh>
      <mesh position={[0, poleH / 2, 0]} castShadow material={body}>
        <cylinderGeometry args={[0.012, 0.012, poleH, 12]} />
      </mesh>
      <mesh position={[0, poleH, d * 0.18]} rotation={[0.6, 0, 0]} castShadow material={shade}>
        <cylinderGeometry args={[0.03, 0.06, 0.12, 20, 1, true]} />
      </mesh>
    </group>
  )
}
