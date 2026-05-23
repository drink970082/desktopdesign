import { useMemo } from 'react'
import * as THREE from 'three'

export interface MaterialOptions {
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
}

/**
 * Memoized MeshStandardMaterial — recreated only when its params change, so models
 * don't allocate a new material every render. One material per instance (disposed
 * with the mesh by R3F), which keeps disposal safe.
 */
export function useStandardMaterial(color: string, opts: MaterialOptions = {}) {
  const { roughness = 0.7, metalness = 0, emissive, emissiveIntensity = 1 } = opts
  return useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    if (emissive) {
      m.emissive = new THREE.Color(emissive)
      m.emissiveIntensity = emissiveIntensity
    }
    return m
  }, [color, roughness, metalness, emissive, emissiveIntensity])
}
