import { CATALOG_BY_ID, getSize } from '../catalog/catalog'
import type { AnySetup, SetupV1, SetupV2 } from './schema'

/** v1 had no customization and stored the desk as a size preset; derive explicit dims. */
function migrateV1toV2(v1: SetupV1): SetupV2 {
  const deskItem = CATALOG_BY_ID[v1.desk.c]
  const dims = deskItem ? getSize(deskItem, v1.desk.s).dimensions : [1.4, 0.74, 0.65]
  return {
    v: 2,
    desk: { c: v1.desk.c, w: dims[0], dp: dims[2], ht: dims[1], cw: v1.desk.w },
    objects: (v1.objects ?? []).map((o) => ({ c: o.c, s: o.s, w: o.w, p: o.p, r: o.r })),
  }
}

/** Validate + migrate any stored/decoded setup to the current v2 shape. Returns null if invalid. */
export function normalizeSetup(data: unknown): SetupV2 | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Partial<AnySetup> & { v?: number }

  if (d.v === 2) {
    const v2 = d as SetupV2
    if (typeof v2.desk !== 'object' || !Array.isArray(v2.objects)) return null
    if (typeof v2.desk.w !== 'number' || typeof v2.desk.ht !== 'number') return null
    return v2
  }
  if (d.v === 1) {
    const v1 = d as SetupV1
    if (typeof v1.desk !== 'object' || !Array.isArray(v1.objects)) return null
    return migrateV1toV2(v1)
  }
  return null
}
