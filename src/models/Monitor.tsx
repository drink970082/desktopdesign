import { useStandardMaterial } from './shared/materials'
import type { ModelProps } from './types'

/**
 * Panel + emissive screen, optionally on a stand. The panel can be rotated to
 * portrait (90° about its facing axis, pivoting on the panel center). Without a
 * stand it's just the panel (+ VESA stub) for arm mounts — the store raises the
 * group by the chosen mount height. Screen faces +Z.
 */
export function Monitor({ dimensions: [w, h, depth], colors, options }: ModelProps) {
  const body = useStandardMaterial(colors.body ?? '#1c1c1f', { roughness: 0.5 })
  const screen = useStandardMaterial('#0a0a0e', {
    roughness: 0.2,
    emissive: '#11131a',
    emissiveIntensity: 0.6,
  })

  const withStand = options?.stand !== false
  const portrait = options?.portrait === true
  // Vertical extent of the (possibly rotated) panel, used to keep it above the desk.
  const vExtent = portrait ? w : h
  const footH = 0.015
  const neckH = h * 0.5
  const panelCenterY = withStand ? footH + neckH + vExtent / 2 : vExtent / 2

  // Panel + screen, pivoted about their own center so portrait rotates in-place.
  const panel = (
    <group position={[0, panelCenterY, 0]} rotation={[0, 0, portrait ? Math.PI / 2 : 0]}>
      <mesh castShadow material={body}>
        <boxGeometry args={[w, h, depth]} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.002]} material={screen}>
        <planeGeometry args={[w - 0.02, h - 0.02]} />
      </mesh>
    </group>
  )

  if (!withStand) {
    return (
      <group>
        {panel}
        {/* VESA mount stub on the back */}
        <mesh position={[0, panelCenterY, -depth / 2 - 0.02]} castShadow material={body}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      {panel}
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
