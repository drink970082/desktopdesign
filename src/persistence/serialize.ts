import type { SceneObject } from '../store/types'
import { SCHEMA_VERSION, type SetupV1 } from './schema'

export interface StoreSnapshot {
  deskCatalogId: string
  deskSizeId: string
  deskColorwayId: string
  objects: SceneObject[]
}

const round = (n: number) => Math.round(n * 1000) / 1000

/** Build the compact, serializable setup from the current store snapshot. */
export function toSetup(s: StoreSnapshot): SetupV1 {
  return {
    v: SCHEMA_VERSION,
    desk: { c: s.deskCatalogId, s: s.deskSizeId, w: s.deskColorwayId || undefined },
    objects: s.objects.map((o) => ({
      c: o.catalogId,
      s: o.sizeId,
      w: o.colorwayId,
      p: [round(o.position[0]), round(o.position[2])],
      r: round(o.rotationY),
    })),
  }
}
