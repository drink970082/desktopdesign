import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/** A yellow bounding-box outline that tracks `object` every frame (works for any model). */
export default function SelectionBox({ object }: { object: THREE.Object3D }) {
  const helper = useMemo(() => new THREE.BoxHelper(object, 0xfacc15), [object])
  useFrame(() => helper.update())
  useEffect(
    () => () => {
      helper.geometry.dispose()
      ;(helper.material as THREE.Material).dispose()
    },
    [helper],
  )
  return <primitive object={helper} />
}
