import { getColorway, getItem, getSize } from '../catalog/catalog'
import { PROCEDURAL_MODELS } from '../models/registry'
import { useEditorStore } from '../store/useEditorStore'
import SceneObjectView from './SceneObjectView'

/** The desk anchor — fixed at the origin, swapped via the catalog (not a movable object). */
function DeskView() {
  const deskCatalogId = useEditorStore((s) => s.deskCatalogId)
  const deskSizeId = useEditorStore((s) => s.deskSizeId)
  const deskColorwayId = useEditorStore((s) => s.deskColorwayId)
  const select = useEditorStore((s) => s.select)

  const item = getItem(deskCatalogId)
  const size = getSize(item, deskSizeId)
  const colors = getColorway(item, deskColorwayId)?.colors ?? {}

  if (item.renderer.kind !== 'procedural') return null
  const Model = PROCEDURAL_MODELS[item.renderer.modelKey]
  if (!Model) return null

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        select(null) // clicking the desk deselects
      }}
    >
      <Model dimensions={size.dimensions} colors={colors} />
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
