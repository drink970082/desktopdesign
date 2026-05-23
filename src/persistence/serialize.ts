import type { ResizeAxis, SceneObject } from '../store/types'
import { SCHEMA_VERSION, type SetupObjectV2, type SetupV2 } from './schema'

export interface StoreSnapshot {
  deskCatalogId: string
  deskWidth: number
  deskDepth: number
  deskHeight: number
  deskColorwayId: string
  deskCustomColor?: string
  objects: SceneObject[]
}

const round = (n: number) => Math.round(n * 1000) / 1000

function roundDims(cd?: Partial<Record<ResizeAxis, number>>): SetupObjectV2['cd'] {
  if (!cd) return undefined
  const out: { w?: number; h?: number; d?: number } = {}
  for (const k of ['w', 'h', 'd'] as ResizeAxis[]) if (cd[k] != null) out[k] = round(cd[k]!)
  return Object.keys(out).length ? out : undefined
}

/** Build the compact, serializable v2 setup; empty optional fields are omitted. */
export function toSetup(s: StoreSnapshot): SetupV2 {
  return {
    v: SCHEMA_VERSION,
    desk: {
      c: s.deskCatalogId,
      w: round(s.deskWidth),
      dp: round(s.deskDepth),
      ht: round(s.deskHeight),
      cw: s.deskColorwayId || undefined,
      cc: s.deskCustomColor || undefined,
    },
    objects: s.objects.map((o): SetupObjectV2 => {
      const obj: SetupObjectV2 = {
        c: o.catalogId,
        s: o.sizeId,
        p: [round(o.position[0]), round(o.position[2])],
        r: round(o.rotationY),
      }
      if (o.colorwayId) obj.w = o.colorwayId
      if (o.customColor) obj.cc = o.customColor
      const cd = roundDims(o.customDims)
      if (cd) obj.cd = cd
      if (o.options && Object.keys(o.options).length) obj.o = o.options
      if (o.elevation) obj.e = round(o.elevation)
      if (o.label) obj.n = o.label
      if (o.url) obj.u = o.url
      return obj
    }),
  }
}
