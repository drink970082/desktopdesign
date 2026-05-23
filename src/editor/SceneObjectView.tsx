import { Suspense, useEffect, useState, type ReactNode } from 'react'
import type { Group } from 'three'
import { TransformControls } from '@react-three/drei'
import type { SceneObject } from '../store/types'
import { getItem } from '../catalog/catalog'
import { effectiveColors, effectiveDimensions, effectiveOptions } from '../catalog/customize'
import { PROCEDURAL_MODELS } from '../models/registry'
import { GLBModel } from '../models/GLBModel'
import { useEditorStore } from '../store/useEditorStore'
import { registerObject3D, unregisterObject3D } from './objectRegistry'
import { applySnapAndCollision } from './snap'
import SelectionBox from './SelectionBox'

/**
 * Renders one placed object from the store. When selected it also mounts the
 * transform gizmo and a selection outline, both attached to this object's group.
 *
 * `node` is captured via a callback ref so the gizmo attaches once the group has
 * actually mounted (the ref is null on the first render). The group's position is
 * only re-applied on re-render — never per frame — so the gizmo owns the transform
 * during a drag and we reconcile back into the store on mouse-up.
 */
export default function SceneObjectView({ obj }: { obj: SceneObject }) {
  const [node, setNode] = useState<Group | null>(null)
  const select = useEditorStore((s) => s.select)
  const isSelected = useEditorStore((s) => s.selectedId === obj.id)
  const mode = useEditorStore((s) => s.transformMode)
  const axis = useEditorStore((s) => s.gizmoAxis)
  const gizmoSize = useEditorStore((s) => s.gizmoSize)
  const setDragging = useEditorStore((s) => s.setDragging)
  const updateTransform = useEditorStore((s) => s.updateTransform)

  useEffect(() => {
    if (!node) return
    registerObject3D(obj.id, node)
    return () => unregisterObject3D(obj.id)
  }, [obj.id, node])

  const item = getItem(obj.catalogId)
  const dimensions = effectiveDimensions(item, obj)
  const colors = effectiveColors(item, obj)
  const options = effectiveOptions(item, obj)

  let modelEl: ReactNode = null
  if (item.renderer.kind === 'procedural') {
    const Model = PROCEDURAL_MODELS[item.renderer.modelKey]
    if (Model) modelEl = <Model dimensions={dimensions} colors={colors} options={options} />
  } else {
    // GLB loads on demand; its own Suspense keeps the rest of the scene visible.
    modelEl = (
      <Suspense fallback={null}>
        <GLBModel url={item.renderer.url} dimensions={dimensions} />
      </Suspense>
    )
  }
  if (!modelEl) return null

  return (
    <>
      <group
        ref={setNode}
        name={obj.id}
        position={obj.position}
        rotation={[0, obj.rotationY, 0]}
        onClick={(e) => {
          e.stopPropagation()
          select(obj.id)
        }}
      >
        {modelEl}
      </group>

      {isSelected && node && (
        <>
          <SelectionBox object={node} />
          <TransformControls
            object={node}
            mode={mode}
            showX={axis.x}
            showY={axis.y}
            showZ={axis.z}
            size={gizmoSize}
            space="world"
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => {
              setDragging(false)
              // Snap onto the desk and resolve overlaps before persisting.
              const [x, z] = applySnapAndCollision(obj.id, node)
              updateTransform(obj.id, [x, node.position.y, z], node.rotation.y)
            }}
          />
        </>
      )}
    </>
  )
}
