import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** A rounded hump. Base at y=0. */
export function Mouse({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1c1c1f', { roughness: 0.5 })
  return (
    <RoundedBox
      args={[w, h, d]}
      radius={Math.min(w, h) * 0.45}
      smoothness={4}
      position={[0, h / 2, 0]}
      castShadow
      receiveShadow
      material={body}
    />
  )
}
