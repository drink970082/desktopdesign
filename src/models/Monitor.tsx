import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/**
 * Panel + emissive screen. With a stand (foot + neck) it rests on the desk; with the
 * stand off it's just the panel (+ a VESA stub) for arm mounts — the panel bottom sits
 * at y=0 and the store raises the whole group by the chosen mount height. Screen faces +Z.
 */
export function Monitor({ dimensions: [w, h, depth], colors, options }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1c1c1f', { roughness: 0.5 })
  const screen = useStandardMaterial('#0a0a0e', {
    roughness: 0.2,
    emissive: '#11131a',
    emissiveIntensity: 0.6,
  })

  const withStand = options?.stand !== false

  if (!withStand) {
    const panelY = h / 2
    return (
      <group>
        <mesh position={[0, panelY, 0]} castShadow material={body}>
          <boxGeometry args={[w, h, depth]} />
        </mesh>
        <mesh position={[0, panelY, depth / 2 + 0.002]} material={screen}>
          <planeGeometry args={[w - 0.02, h - 0.02]} />
        </mesh>
        {/* VESA mount stub on the back */}
        <mesh position={[0, panelY, -depth / 2 - 0.02]} castShadow material={body}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
        </mesh>
      </group>
    )
  }

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
