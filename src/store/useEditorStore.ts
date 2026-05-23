import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { CATALOG_BY_ID, getItem, getSize } from '../catalog/catalog'
import { clampAxis } from '../catalog/customize'
import {
  loadSavedSetups,
  persistSavedSetups,
  type SavedSetupsMap,
} from '../persistence/savedSetups'
import type { AnySetup, SetupV2 } from '../persistence/schema'
import { normalizeSetup } from '../persistence/migrate'
import { toSetup } from '../persistence/serialize'
import type { GizmoAxis, ResizeAxis, SceneObject, TransformMode, Vec3 } from './types'

function newId(): string {
  return crypto.randomUUID()
}

/** World Y for an item's base, given its rest plane. */
function restingY(rests: 'desk' | 'floor', deskSurfaceY: number): number {
  return rests === 'floor' ? 0 : deskSurfaceY
}

/** Keep an [x, z] center within the desk footprint, given the object's half-extents. */
function clampToDeskXZ(
  x: number,
  z: number,
  halfX: number,
  halfZ: number,
  deskWidth: number,
  deskDepth: number,
): [number, number] {
  const mx = Math.max(0, deskWidth / 2 - halfX - 0.01)
  const mz = Math.max(0, deskDepth / 2 - halfZ - 0.01)
  return [Math.min(mx, Math.max(-mx, x)), Math.min(mz, Math.max(-mz, z))]
}

/** Re-derive every object's Y from the current desk surface + its own elevation. */
function reseat(s: { objects: SceneObject[]; deskSurfaceY: number }) {
  for (const o of s.objects) {
    const item = getItem(o.catalogId)
    o.position = [o.position[0], restingY(item.rests, s.deskSurfaceY) + (o.elevation ?? 0), o.position[2]]
  }
}

const DEFAULT_DESK_ID = 'modernDesk'

function deskDefaults(deskId: string) {
  const desk = getItem(deskId)
  const size = getSize(desk, desk.defaultSizeId)
  return {
    width: size.dimensions[0],
    height: size.dimensions[1],
    depth: size.dimensions[2],
    colorwayId: desk.defaultColorwayId ?? '',
  }
}

const DD = deskDefaults(DEFAULT_DESK_ID)

interface EditorState {
  // scene
  objects: SceneObject[]
  selectedId: string | null
  deskCatalogId: string
  deskWidth: number
  deskDepth: number
  deskHeight: number
  deskColorwayId: string
  deskCustomColor?: string
  deskSurfaceY: number

  // gizmo / interaction
  transformMode: TransformMode
  gizmoAxis: GizmoAxis
  gizmoSize: number
  isDragging: boolean

  // persistence
  savedSetups: SavedSetupsMap

  // object actions
  add: (catalogId: string, sizeId?: string, colorwayId?: string) => void
  duplicate: (id: string) => void
  remove: (id: string) => void
  removeSelected: () => void
  select: (id: string | null) => void

  setTransformMode: (m: TransformMode) => void
  toggleMode: () => void
  toggleAxis: (axis: 'x' | 'y' | 'z') => void
  bumpGizmoSize: (delta: number) => void
  setDragging: (d: boolean) => void

  updateTransform: (id: string, position: Vec3, rotationY: number) => void
  setSize: (id: string, sizeId: string) => void
  setColorway: (id: string, colorwayId: string) => void

  // per-object customization
  setCustomDim: (id: string, axis: ResizeAxis, value: number) => void
  setCustomColor: (id: string, hex: string | undefined) => void
  toggleOption: (id: string, optId: string) => void
  setElevation: (id: string, value: number) => void
  resetCustomization: (id: string) => void
  toggleHidden: (id: string) => void
  setLabel: (id: string, value: string) => void
  setUrl: (id: string, value: string) => void

  // desk
  swapDesk: (catalogId: string) => void
  setDeskSizePreset: (sizeId: string) => void
  setDeskDimension: (axis: ResizeAxis, value: number) => void
  setDeskColorway: (colorwayId: string) => void
  setDeskCustomColor: (hex: string | undefined) => void

  reset: () => void
  loadDefaultScene: () => void

  // serialization / persistence
  exportSetup: () => SetupV2
  loadSetup: (setup: AnySetup) => void
  saveNamed: (name: string) => void
  deleteNamed: (name: string) => void
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    objects: [],
    selectedId: null,
    deskCatalogId: DEFAULT_DESK_ID,
    deskWidth: DD.width,
    deskDepth: DD.depth,
    deskHeight: DD.height,
    deskColorwayId: DD.colorwayId,
    deskCustomColor: undefined,
    deskSurfaceY: DD.height,

    transformMode: 'translate',
    gizmoAxis: { x: true, y: false, z: true },
    gizmoSize: 0.8,
    isDragging: false,

    savedSetups: loadSavedSetups(),

    add: (catalogId, sizeId, colorwayId) =>
      set((s) => {
        const item = getItem(catalogId)
        const sid = sizeId ?? item.defaultSizeId
        const dims = getSize(item, sid).dimensions
        // Offset additional copies so multiples (e.g. dual monitors) don't stack.
        const count = s.objects.filter((o) => o.catalogId === catalogId).length
        let x = item.defaultSpawn[0] + count * (dims[0] + 0.05)
        let z = item.defaultSpawn[1]
        if (item.rests === 'desk') {
          ;[x, z] = clampToDeskXZ(x, z, dims[0] / 2, dims[2] / 2, s.deskWidth, s.deskDepth)
        }
        const obj: SceneObject = {
          id: newId(),
          catalogId,
          sizeId: sid,
          colorwayId: colorwayId ?? item.defaultColorwayId,
          position: [x, restingY(item.rests, s.deskSurfaceY), z],
          rotationY: item.defaultYRotation,
        }
        s.objects.push(obj)
        s.selectedId = obj.id
      }),

    duplicate: (id) =>
      set((s) => {
        const src = s.objects.find((o) => o.id === id)
        if (!src) return
        const item = getItem(src.catalogId)
        const dims = getSize(item, src.sizeId).dimensions
        let x = src.position[0] + (dims[0] + 0.05)
        let z = src.position[2]
        if (item.rests === 'desk') {
          ;[x, z] = clampToDeskXZ(x, z, dims[0] / 2, dims[2] / 2, s.deskWidth, s.deskDepth)
        }
        const copy: SceneObject = {
          ...src,
          id: newId(),
          position: [x, src.position[1], z],
          customDims: src.customDims ? { ...src.customDims } : undefined,
          options: src.options ? { ...src.options } : undefined,
        }
        s.objects.push(copy)
        s.selectedId = copy.id
      }),

    remove: (id) =>
      set((s) => {
        s.objects = s.objects.filter((o) => o.id !== id)
        if (s.selectedId === id) s.selectedId = null
      }),

    removeSelected: () => {
      const id = get().selectedId
      if (id) get().remove(id)
    },

    select: (id) =>
      set((s) => {
        s.selectedId = id
      }),

    setTransformMode: (m) =>
      set((s) => {
        s.transformMode = m
        s.gizmoAxis =
          m === 'rotate' ? { x: false, y: true, z: false } : { x: true, y: false, z: true }
      }),

    toggleMode: () => {
      get().setTransformMode(get().transformMode === 'translate' ? 'rotate' : 'translate')
    },

    toggleAxis: (axis) =>
      set((s) => {
        s.gizmoAxis[axis] = !s.gizmoAxis[axis]
      }),

    bumpGizmoSize: (delta) =>
      set((s) => {
        s.gizmoSize = Math.max(0.2, Math.min(2, s.gizmoSize + delta))
      }),

    setDragging: (d) =>
      set((s) => {
        s.isDragging = d
      }),

    updateTransform: (id, position, rotationY) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (!o) return
        const item = getItem(o.catalogId)
        o.position = [
          position[0],
          restingY(item.rests, s.deskSurfaceY) + (o.elevation ?? 0),
          position[2],
        ]
        o.rotationY = rotationY
      }),

    setSize: (id, sizeId) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) {
          o.sizeId = sizeId
          delete o.customDims // a chosen preset replaces any free resizing
        }
      }),

    setColorway: (id, colorwayId) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) {
          o.colorwayId = colorwayId
          delete o.customColor // a chosen preset replaces a custom color
        }
      }),

    setCustomDim: (id, axis, value) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (!o) return
        const v = clampAxis(getItem(o.catalogId), axis, value)
        o.customDims = { ...(o.customDims ?? {}), [axis]: v }
      }),

    setCustomColor: (id, hex) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (!o) return
        if (hex) o.customColor = hex
        else delete o.customColor
      }),

    toggleOption: (id, optId) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (!o) return
        const item = getItem(o.catalogId)
        const def = item.options?.find((x) => x.id === optId)?.default ?? false
        const cur = o.options?.[optId] ?? def
        o.options = { ...(o.options ?? {}), [optId]: !cur }
      }),

    setElevation: (id, value) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (!o) return
        const item = getItem(o.catalogId)
        const min = item.elevatable?.min ?? 0
        const max = item.elevatable?.max ?? 0
        const v = Math.min(max, Math.max(min, value))
        o.elevation = v
        o.position = [o.position[0], restingY(item.rests, s.deskSurfaceY) + v, o.position[2]]
      }),

    resetCustomization: (id) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (!o) return
        const item = getItem(o.catalogId)
        delete o.customDims
        delete o.customColor
        delete o.options
        o.elevation = undefined
        o.position = [o.position[0], restingY(item.rests, s.deskSurfaceY), o.position[2]]
      }),

    toggleHidden: (id) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) o.hidden = !o.hidden
      }),

    setLabel: (id, value) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) o.label = value || undefined
      }),

    setUrl: (id, value) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) o.url = value || undefined
      }),

    swapDesk: (catalogId) =>
      set((s) => {
        const id = CATALOG_BY_ID[catalogId] ? catalogId : DEFAULT_DESK_ID
        const desk = getItem(id)
        const size = getSize(desk, desk.defaultSizeId)
        s.deskCatalogId = id
        s.deskWidth = size.dimensions[0]
        s.deskDepth = size.dimensions[2]
        s.deskHeight = size.dimensions[1]
        s.deskColorwayId = desk.defaultColorwayId ?? ''
        s.deskCustomColor = undefined
        s.deskSurfaceY = size.dimensions[1]
        reseat(s)
      }),

    setDeskSizePreset: (sizeId) =>
      set((s) => {
        const size = getSize(getItem(s.deskCatalogId), sizeId)
        s.deskWidth = size.dimensions[0]
        s.deskDepth = size.dimensions[2]
        s.deskHeight = size.dimensions[1]
        s.deskSurfaceY = size.dimensions[1]
        reseat(s)
      }),

    setDeskDimension: (axis, value) =>
      set((s) => {
        const v = clampAxis(getItem(s.deskCatalogId), axis, value)
        if (axis === 'w') s.deskWidth = v
        else if (axis === 'd') s.deskDepth = v
        else {
          s.deskHeight = v
          s.deskSurfaceY = v
          reseat(s)
        }
      }),

    setDeskColorway: (colorwayId) =>
      set((s) => {
        s.deskColorwayId = colorwayId
        s.deskCustomColor = undefined
      }),

    setDeskCustomColor: (hex) =>
      set((s) => {
        s.deskCustomColor = hex || undefined
      }),

    reset: () =>
      set((s) => {
        s.objects = []
        s.selectedId = null
      }),

    loadDefaultScene: () => {
      const { add, reset } = get()
      reset()
      add('monitor')
      add('keyboard')
      add('mouse')
      add('mousepad')
      set((s) => {
        s.selectedId = null
      })
    },

    exportSetup: () => {
      const s = get()
      return toSetup({
        deskCatalogId: s.deskCatalogId,
        deskWidth: s.deskWidth,
        deskDepth: s.deskDepth,
        deskHeight: s.deskHeight,
        deskColorwayId: s.deskColorwayId,
        deskCustomColor: s.deskCustomColor,
        objects: s.objects,
      })
    },

    loadSetup: (raw) => {
      const setup = normalizeSetup(raw)
      if (!setup) return
      set((s) => {
        const deskId = CATALOG_BY_ID[setup.desk.c] ? setup.desk.c : DEFAULT_DESK_ID
        const desk = getItem(deskId)
        const surfaceY = setup.desk.ht
        s.deskCatalogId = deskId
        s.deskWidth = setup.desk.w
        s.deskDepth = setup.desk.dp
        s.deskHeight = setup.desk.ht
        s.deskColorwayId = setup.desk.cw ?? desk.defaultColorwayId ?? ''
        s.deskCustomColor = setup.desk.cc
        s.deskSurfaceY = surfaceY
        s.selectedId = null
        s.objects = setup.objects
          .filter((o) => CATALOG_BY_ID[o.c])
          .map((o) => {
            const item = getItem(o.c)
            return {
              id: newId(),
              catalogId: o.c,
              sizeId: o.s,
              colorwayId: o.w,
              customColor: o.cc,
              customDims: o.cd,
              options: o.o,
              elevation: o.e,
              position: [o.p[0], restingY(item.rests, surfaceY) + (o.e ?? 0), o.p[1]] as Vec3,
              rotationY: o.r,
            }
          })
      })
    },

    saveNamed: (name) => {
      const data = get().exportSetup()
      set((s) => {
        s.savedSetups[name] = { updatedAt: Date.now(), data }
      })
      persistSavedSetups(get().savedSetups)
    },

    deleteNamed: (name) => {
      set((s) => {
        delete s.savedSetups[name]
      })
      persistSavedSetups(get().savedSetups)
    },
  })),
)
