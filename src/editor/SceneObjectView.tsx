import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useHelper } from '@react-three/drei'
import type { SceneObject } from '../store/types'
import { getColorway, getItem, getSize } from '../catalog/catalog'
import { PROCEDURAL_MODELS } from '../models/registry'
import { useEditorStore } from '../store/useEditorStore'
import { registerObject3D, unregisterObject3D } from './objectRegistry'

/** Renders one placed object from the store, handles selection, and registers its Object3D. */
export default function SceneObjectView({ obj }: { obj: SceneObject }) {
  const groupRef = useRef<THREE.Group>(null!)
  const select = useEditorStore((s) => s.select)
  const isSelected = useEditorStore((s) => s.selectedId === obj.id)

  // Yellow bounding box around the current selection (accurate for any model).
  useHelper(isSelected ? groupRef : null, THREE.BoxHelper, 0xfacc15)

  useEffect(() => {
    const g = groupRef.current
    if (!g) return
    registerObject3D(obj.id, g)
    return () => unregisterObject3D(obj.id)
  }, [obj.id])

  const item = getItem(obj.catalogId)
  const size = getSize(item, obj.sizeId)
  const colors = getColorway(item, obj.colorwayId)?.colors ?? {}

  if (item.renderer.kind !== 'procedural') return null // GLB models handled later
  const Model = PROCEDURAL_MODELS[item.renderer.modelKey]
  if (!Model) return null

  return (
    <group
      ref={groupRef}
      name={obj.id}
      position={obj.position}
      rotation={[0, obj.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        select(obj.id)
      }}
    >
      <Model dimensions={size.dimensions} colors={colors} />
    </group>
  )
}
