import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/** Panel + emissive screen + neck + foot. Foot rests at y=0; screen faces +Z (toward the viewer). */
export function Monitor({ dimensions: [w, h, depth], colors }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1c1c1f', { roughness: 0.5 })
  const screen = useStandardMaterial('#0a0a0e', {
    roughness: 0.2,
    emissive: '#11131a',
    emissiveIntensity: 0.6,
  })

  const footH = 0.015
  const neckH = h * 0.5
  const panelY = footH + neckH + h / 2

  return (
    <group>
      {/* panel */}
      <mesh position={[0, panelY, 0]} castShadow material={body}>
        <boxGeometry args={[w, h, depth]} />
      </mesh>
      {/* screen face */}
      <mesh position={[0, panelY, depth / 2 + 0.002]} material={screen}>
        <planeGeometry args={[w - 0.02, h - 0.02]} />
      </mesh>
      {/* neck */}
      <mesh position={[0, footH + neckH / 2, -0.02]} castShadow material={body}>
        <boxGeometry args={[0.05, neckH, 0.04]} />
      </mesh>
      {/* foot */}
      <mesh position={[0, footH / 2, -0.02]} castShadow receiveShadow material={body}>
        <boxGeometry args={[Math.min(0.22, w * 0.5), footH, 0.16]} />
      </mesh>
    </group>
  )
}
