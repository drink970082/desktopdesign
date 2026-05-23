import { CATALOG } from '../catalog/catalog'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../catalog/categories'
import { useEditorStore } from '../store/useEditorStore'
import ObjectsPanel from './ObjectsPanel'

/** Left sidebar: placed-objects list + categorized catalog. Clicking adds an item (or swaps the desk). */
export default function CatalogPanel() {
  const add = useEditorStore((s) => s.add)
  const swapDesk = useEditorStore((s) => s.swapDesk)
  const deskCatalogId = useEditorStore((s) => s.deskCatalogId)

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <ObjectsPanel />
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Catalog</h2>
      {CATEGORY_ORDER.map((cat) => {
        const items = CATALOG.filter((i) => i.category === cat)
        if (items.length === 0) return null
        return (
          <section key={cat} className="mb-4">
            <h3 className="mb-1 text-xs font-medium text-zinc-400">{CATEGORY_LABELS[cat]}</h3>
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const isDesk = item.category === 'desk'
                const active = isDesk && item.id === deskCatalogId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => (isDesk ? swapDesk(item.id) : add(item.id))}
                    className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </aside>
  )
}
