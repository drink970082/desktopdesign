import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { Vec3 } from '../store/types'

const BASE = import.meta.env.BASE_URL

/**
 * Renders a CC0/CC-BY GLB, normalized to our base-origin convention: scaled so its
 * height matches the catalog dimensions, centered in XZ, and resting with min.y=0.
 * Each instance is cloned so multiple copies don't share one mutated Object3D.
 */
export function GLBModel({ url, dimensions }: { url: string; dimensions: Vec3 }) {
  const { scene } = useGLTF(BASE + url)

  const object = useMemo(() => {
    const clone = scene.clone(true)

    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)
    const scale = size.y > 0 ? dimensions[1] / size.y : 1
    clone.scale.setScalar(scale)

    const scaled = new THREE.Box3().setFromObject(clone)
    const center = new THREE.Vector3()
    scaled.getCenter(center)
    clone.position.set(-center.x, -scaled.min.y, -center.z)

    clone.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    return clone
  }, [scene, dimensions])

  return <primitive object={object} />
}
