import { getColorway, getItem } from '../catalog/catalog'
import { PROCEDURAL_MODELS } from '../models/registry'
import { useEditorStore } from '../store/useEditorStore'
import type { Vec3 } from '../store/types'
import SceneObjectView from './SceneObjectView'

/** The desk anchor — fixed at the origin, resized/recolored via store state. */
function DeskView() {
  const deskCatalogId = useEditorStore((s) => s.deskCatalogId)
  const deskWidth = useEditorStore((s) => s.deskWidth)
  const deskHeight = useEditorStore((s) => s.deskHeight)
  const deskDepth = useEditorStore((s) => s.deskDepth)
  const deskColorwayId = useEditorStore((s) => s.deskColorwayId)
  const deskCustomColor = useEditorStore((s) => s.deskCustomColor)
  const select = useEditorStore((s) => s.select)

  const item = getItem(deskCatalogId)
  const colors = { ...(getColorway(item, deskColorwayId)?.colors ?? {}) }
  if (deskCustomColor) colors[item.primaryColorRole ?? 'top'] = deskCustomColor

  if (item.renderer.kind !== 'procedural') return null
  const Model = PROCEDURAL_MODELS[item.renderer.modelKey]
  if (!Model) return null

  const dimensions: Vec3 = [deskWidth, deskHeight, deskDepth]

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        select(null) // clicking the desk deselects
      }}
    >
      <Model dimensions={dimensions} colors={colors} />
    </group>
  )
}

/** Projects the editor store into the 3D scene: the desk plus all placed objects. */
export default function Scene() {
  const objects = useEditorStore((s) => s.objects)
  return (
    <>
      <DeskView />
      {objects.map((o) => (
        <SceneObjectView key={o.id} obj={o} />
      ))}
    </>
  )
}
