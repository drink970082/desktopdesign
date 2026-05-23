import { type ReactNode } from 'react'
import { getColorway, getItem } from '../catalog/catalog'
import { effectiveColors, effectiveDimensions, effectiveOptions } from '../catalog/customize'
import { useEditorStore } from '../store/useEditorStore'
import type { CatalogItem, Colorway, ResizeAxis } from '../store/types'

const AXIS_META: Record<ResizeAxis, { label: string; index: 0 | 1 | 2 }> = {
  w: { label: 'Width', index: 0 },
  h: { label: 'Height', index: 1 },
  d: { label: 'Depth', index: 2 },
}

const selectClass =
  'w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-medium text-zinc-400">{label}</span>
      {children}
    </label>
  )
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <Field label={`${label} — ${Math.round(value * 100)} cm`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600"
      />
    </Field>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="mb-3 flex cursor-pointer items-center justify-between">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-blue-600"
      />
    </label>
  )
}

function ColorField({
  item,
  value,
  onPreset,
  onCustom,
}: {
  item: CatalogItem
  value: string
  onPreset: (id: string) => void
  onCustom: (hex: string) => void
}) {
  if (item.allowCustomColor === false && !item.colorways) return null
  const role = item.primaryColorRole ?? 'body'
  const swatch = (c: Colorway) => c.colors[role] ?? Object.values(c.colors)[0] ?? '#888888'
  return (
    <Field label="Color">
      <div className="flex items-center gap-2">
        {item.allowCustomColor !== false && (
          <input
            type="color"
            value={value}
            onChange={(e) => onCustom(e.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-zinc-300 bg-transparent dark:border-zinc-700"
            title="Custom color"
          />
        )}
        <div className="flex flex-wrap gap-1">
          {(item.colorways ?? []).map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              onClick={() => onPreset(c.id)}
              style={{ background: swatch(c) }}
              className="h-6 w-6 rounded border border-zinc-300 dark:border-zinc-600"
            />
          ))}
        </div>
      </div>
    </Field>
  )
}

function DimensionSliders({
  item,
  dims,
  onChange,
}: {
  item: CatalogItem
  dims: [number, number, number]
  onChange: (axis: ResizeAxis, v: number) => void
}) {
  if (!item.resize) return null
  return (
    <>
      {item.resize.axes.map((axis) => {
        const meta = AXIS_META[axis]
        return (
          <Slider
            key={axis}
            label={meta.label}
            min={item.resize!.min[axis] ?? 0.05}
            max={item.resize!.max[axis] ?? 2}
            step={item.resize!.step ?? 0.01}
            value={dims[meta.index]}
            onChange={(v) => onChange(axis, v)}
          />
        )
      })}
    </>
  )
}

/** Right sidebar: edits the selected object, or the desk when nothing is selected. */
export default function InspectorPanel() {
  const selectedId = useEditorStore((s) => s.selectedId)
  const objects = useEditorStore((s) => s.objects)
  const setSize = useEditorStore((s) => s.setSize)
  const setColorway = useEditorStore((s) => s.setColorway)
  const setCustomDim = useEditorStore((s) => s.setCustomDim)
  const setCustomColor = useEditorStore((s) => s.setCustomColor)
  const toggleOption = useEditorStore((s) => s.toggleOption)
  const setElevation = useEditorStore((s) => s.setElevation)
  const resetCustomization = useEditorStore((s) => s.resetCustomization)
  const duplicate = useEditorStore((s) => s.duplicate)
  const remove = useEditorStore((s) => s.remove)
  const transformMode = useEditorStore((s) => s.transformMode)
  const toggleMode = useEditorStore((s) => s.toggleMode)

  const deskCatalogId = useEditorStore((s) => s.deskCatalogId)
  const deskWidth = useEditorStore((s) => s.deskWidth)
  const deskDepth = useEditorStore((s) => s.deskDepth)
  const deskHeight = useEditorStore((s) => s.deskHeight)
  const deskColorwayId = useEditorStore((s) => s.deskColorwayId)
  const deskCustomColor = useEditorStore((s) => s.deskCustomColor)
  const setDeskSizePreset = useEditorStore((s) => s.setDeskSizePreset)
  const setDeskDimension = useEditorStore((s) => s.setDeskDimension)
  const setDeskColorway = useEditorStore((s) => s.setDeskColorway)
  const setDeskCustomColor = useEditorStore((s) => s.setDeskCustomColor)

  const selected = objects.find((o) => o.id === selectedId)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-l border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      {selected ? (
        (() => {
          const item = getItem(selected.catalogId)
          const dims = effectiveDimensions(item, selected)
          const options = effectiveOptions(item, selected)
          const primaryRole = item.primaryColorRole ?? 'body'
          const colorValue = effectiveColors(item, selected)[primaryRole] ?? '#888888'
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
                <Field label="Size preset">
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

              <DimensionSliders
                item={item}
                dims={dims}
                onChange={(axis, v) => setCustomDim(selected.id, axis, v)}
              />

              {(item.options ?? []).map((opt) => (
                <Toggle
                  key={opt.id}
                  label={opt.label}
                  checked={options[opt.id]}
                  onChange={() => toggleOption(selected.id, opt.id)}
                />
              ))}

              {item.elevatable && (
                <Slider
                  label="Mount height"
                  min={item.elevatable.min}
                  max={item.elevatable.max}
                  step={item.elevatable.step ?? 0.01}
                  value={selected.elevation ?? 0}
                  onChange={(v) => setElevation(selected.id, v)}
                />
              )}

              <ColorField
                item={item}
                value={colorValue}
                onPreset={(id) => setColorway(selected.id, id)}
                onCustom={(hex) => setCustomColor(selected.id, hex)}
              />

              <button
                type="button"
                onClick={() => duplicate(selected.id)}
                className="mt-2 w-full rounded-md bg-blue-600 px-2 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Duplicate (Ctrl/⌘+D)
              </button>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => resetCustomization(selected.id)}
                  className="flex-1 rounded-md bg-zinc-100 px-2 py-1.5 text-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => remove(selected.id)}
                  className="flex-1 rounded-md bg-red-600 px-2 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )
        })()
      ) : (
        (() => {
          const desk = getItem(deskCatalogId)
          const colorValue =
            deskCustomColor ??
            getColorway(desk, deskColorwayId)?.colors[desk.primaryColorRole ?? 'top'] ??
            '#c79a6b'
          return (
            <>
              <h2 className="mb-3 text-sm font-semibold">Desk</h2>

              {desk.sizeOptions.length > 1 && (
                <Field label="Size preset">
                  <select
                    className={selectClass}
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) setDeskSizePreset(e.target.value)
                      e.currentTarget.value = ''
                    }}
                  >
                    <option value="">Apply a preset…</option>
                    {desk.sizeOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <DimensionSliders
                item={desk}
                dims={[deskWidth, deskHeight, deskDepth]}
                onChange={(axis, v) => setDeskDimension(axis, v)}
              />

              <ColorField
                item={desk}
                value={colorValue}
                onPreset={(id) => setDeskColorway(id)}
                onCustom={(hex) => setDeskCustomColor(hex)}
              />

              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Choose a desk in the catalog, resize it here, then add gear. Shortcuts: <b>R</b>{' '}
                move/rotate, <b>Del</b> delete, <b>C</b> deselect, <b>+/−</b> gizmo size.
              </p>
            </>
          )
        })()
      )}
    </aside>
  )
}
