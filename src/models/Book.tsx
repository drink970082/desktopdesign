import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** A single book lying flat: cover + inset page block. Base at y=0. */
export function Book({ dimensions: [w, h, d], colors }: ModelProps) {
  const cover = useStandardMaterial(colors.body ?? '#7b4a3a', { roughness: 0.6 })
  const pages = useStandardMaterial('#efe9da', { roughness: 0.9 })
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={cover}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh position={[0.004, h / 2, 0]} material={pages}>
        <boxGeometry args={[w * 0.92, h * 0.7, d * 0.92]} />
      </mesh>
    </group>
  )
}
