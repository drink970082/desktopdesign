import { RoundedBox } from '@react-three/drei'
import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** A plain resizable box — a stand-in for any product not in the catalog. Base at y=0. */
export function CustomBox({ dimensions: [w, h, d], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#8a8d92', { roughness: 0.6 })
  return (
    <RoundedBox
      args={[w, h, d]}
      radius={Math.min(w, h, d) * 0.06}
      smoothness={3}
      position={[0, h / 2, 0]}
      castShadow
      receiveShadow
      material={body}
    />
  )
}
