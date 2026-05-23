import { getItem } from '../catalog/catalog'
import { useEditorStore } from '../store/useEditorStore'

/** Dropdown listing every placed object that has a product link. */
export default function ShoppingList({ onClose }: { onClose: () => void }) {
  const objects = useEditorStore((s) => s.objects)
  const items = objects.filter((o) => o.url)

  return (
    <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-800 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Shopping list</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No product links yet. Select an item and add a Product link in the inspector.
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((o) => (
            <li key={o.id} className="truncate">
              <a
                href={o.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {o.label?.trim() || getItem(o.catalogId).name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
