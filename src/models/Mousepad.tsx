import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Thin flat pad. Base at y=0. */
export function Mousepad({ dimensions: [w, h, d], colors }: ModelProps) {
  const thickness = Math.max(h, 0.003)
  const body = useStandardMaterial(colors.body ?? '#161618', { roughness: 0.95 })
  return (
    <RoundedBox
      args={[w, thickness, d]}
      radius={0.006}
      smoothness={2}
      position={[0, thickness / 2, 0]}
      receiveShadow
      material={body}
    />
  )
}
