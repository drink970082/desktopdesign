import { type ReactNode } from 'react'
import { getItem } from '../catalog/catalog'
import { useEditorStore } from '../store/useEditorStore'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-medium text-zinc-400">{label}</span>
      {children}
    </label>
  )
}

const selectClass =
  'w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'

/** Right sidebar: edits the selected object, or the desk when nothing is selected. */
export default function InspectorPanel() {
  const selectedId = useEditorStore((s) => s.selectedId)
  const objects = useEditorStore((s) => s.objects)
  const setSize = useEditorStore((s) => s.setSize)
  const setColorway = useEditorStore((s) => s.setColorway)
  const remove = useEditorStore((s) => s.remove)
  const transformMode = useEditorStore((s) => s.transformMode)
  const toggleMode = useEditorStore((s) => s.toggleMode)

  const deskCatalogId = useEditorStore((s) => s.deskCatalogId)
  const deskSizeId = useEditorStore((s) => s.deskSizeId)
  const deskColorwayId = useEditorStore((s) => s.deskColorwayId)
  const swapDesk = useEditorStore((s) => s.swapDesk)
  const setDeskColorway = useEditorStore((s) => s.setDeskColorway)

  const selected = objects.find((o) => o.id === selectedId)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-l border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      {selected ? (
        (() => {
          const item = getItem(selected.catalogId)
          return (
            <>
              <h2 className="mb-3 text-sm font-semibold">{item.name}</h2>

              <Field label="Transform">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="w-full rounded-md bg-zinc-100 px-2 py-1.5 text-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  {transformMode === 'translate' ? 'Move — press R to rotate' : 'Rotate — press R to move'}
                </button>
              </Field>

              {item.sizeOptions.length > 1 && (
                <Field label="Size">
                  <select
                    className={selectClass}
                    value={selected.sizeId}
                    onChange={(e) => setSize(selected.id, e.target.value)}
                  >
                    {item.sizeOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {item.colorways && item.colorways.length > 1 && (
                <Field label="Color">
                  <select
                    className={selectClass}
                    value={selected.colorwayId}
                    onChange={(e) => setColorway(selected.id, e.target.value)}
                  >
                    {item.colorways.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <button
                type="button"
                onClick={() => remove(selected.id)}
                className="mt-2 w-full rounded-md bg-red-600 px-2 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )
        })()
      ) : (
        (() => {
          const desk = getItem(deskCatalogId)
          return (
            <>
              <h2 className="mb-3 text-sm font-semibold">Desk</h2>
              <Field label="Size">
                <select
                  className={selectClass}
                  value={deskSizeId}
                  onChange={(e) => swapDesk(deskCatalogId, e.target.value)}
                >
                  {desk.sizeOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
              {desk.colorways && desk.colorways.length > 1 && (
                <Field label="Color">
                  <select
                    className={selectClass}
                    value={deskColorwayId}
                    onChange={(e) => setDeskColorway(e.target.value)}
                  >
                    {desk.colorways.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Select an object to edit it. Shortcuts: <b>R</b> move/rotate, <b>Del</b> delete,{' '}
                <b>C</b> deselect, <b>+/−</b> gizmo size.
              </p>
            </>
          )
        })()
      )}
    </aside>
  )
}
