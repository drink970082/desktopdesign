import { getItem } from '../catalog/catalog'
import { useEditorStore } from '../store/useEditorStore'

/** "Scene" list at the top of the left sidebar: select / hide / delete placed objects. */
export default function ObjectsPanel() {
  const objects = useEditorStore((s) => s.objects)
  const selectedId = useEditorStore((s) => s.selectedId)
  const select = useEditorStore((s) => s.select)
  const remove = useEditorStore((s) => s.remove)
  const toggleHidden = useEditorStore((s) => s.toggleHidden)

  if (objects.length === 0) return null

  return (
    <section className="mb-4">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Scene ({objects.length})
      </h2>
      <div className="flex flex-col gap-1">
        {objects.map((o) => {
          const sameType = objects.filter((x) => x.catalogId === o.catalogId)
          const idx = sameType.indexOf(o)
          const base = o.label?.trim() || getItem(o.catalogId).name
          const name = sameType.length > 1 && !o.label?.trim() ? `${base} ${idx + 1}` : base
          const active = o.id === selectedId
          return (
            <div
              key={o.id}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                active ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}
            >
              <button
                type="button"
                className={`flex-1 truncate text-left ${o.hidden ? 'opacity-50' : ''}`}
                title={name}
                onClick={() => {
                  if (o.hidden) toggleHidden(o.id)
                  select(o.id)
                }}
              >
                {name}
              </button>
              <button
                type="button"
                title={o.hidden ? 'Show' : 'Hide'}
                onClick={() => toggleHidden(o.id)}
                className="px-1 opacity-70 hover:opacity-100"
              >
                {o.hidden ? '🙈' : '👁'}
              </button>
              <button
                type="button"
                title="Delete"
                onClick={() => remove(o.id)}
                className="px-1 opacity-70 hover:opacity-100"
              >
                🗑
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
