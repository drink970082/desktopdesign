import type { CatalogItem, ResizeAxis, SceneObject, Vec3 } from '../store/types'
import { getColorway, getSize } from './catalog'

const AXIS_INDEX: Record<ResizeAxis, 0 | 1 | 2> = { w: 0, h: 1, d: 2 }

/** Clamp a custom value for one axis to the item's resize bounds. */
export function clampAxis(item: CatalogItem, axis: ResizeAxis, value: number): number {
  const lo = item.resize?.min[axis]
  const hi = item.resize?.max[axis]
  let v = value
  if (lo != null) v = Math.max(lo, v)
  if (hi != null) v = Math.min(hi, v)
  return v
}

/** Effective [w, h, d]: the size preset, overridden per axis by customDims (clamped to bounds). */
export function effectiveDimensions(
  item: CatalogItem,
  obj: Pick<SceneObject, 'sizeId' | 'customDims'>,
): Vec3 {
  const base = [...getSize(item, obj.sizeId).dimensions] as Vec3
  if (obj.customDims) {
    for (const axis of ['w', 'h', 'd'] as ResizeAxis[]) {
      const v = obj.customDims[axis]
      if (v != null) base[AXIS_INDEX[axis]] = clampAxis(item, axis, v)
    }
  }
  return base
}

/** Effective colors: the colorway, with the custom color applied to the item's primary role. */
export function effectiveColors(
  item: CatalogItem,
  obj: Pick<SceneObject, 'colorwayId' | 'customColor'>,
): Record<string, string> {
  const base = { ...(getColorway(item, obj.colorwayId)?.colors ?? {}) }
  if (obj.customColor) base[item.primaryColorRole ?? 'body'] = obj.customColor
  return base
}

/** Effective option toggles: catalog defaults merged with the instance overrides. */
export function effectiveOptions(
  item: CatalogItem,
  obj: Pick<SceneObject, 'options'>,
): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const o of item.options ?? []) out[o.id] = o.default
  if (obj.options) Object.assign(out, obj.options)
  return out
}
