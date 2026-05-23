import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { CATALOG_BY_ID, getItem } from '../catalog/catalog'
import {
  loadSavedSetups,
  persistSavedSetups,
  type SavedSetupsMap,
} from '../persistence/savedSetups'
import type { SetupV1 } from '../persistence/schema'
import { toSetup } from '../persistence/serialize'
import type { GizmoAxis, SceneObject, TransformMode, Vec3 } from './types'

function newId(): string {
  return crypto.randomUUID()
}

/** World Y for an item's base, given its rest plane. */
function restingY(rests: 'desk' | 'floor', deskSurfaceY: number): number {
  return rests === 'floor' ? 0 : deskSurfaceY
}

function deskHeightOf(deskId: string, sizeId: string): number {
  const desk = getItem(deskId)
  const size = desk.sizeOptions.find((s) => s.id === sizeId) ?? desk.sizeOptions[0]
  return size.dimensions[1]
}

const DEFAULT_DESK_ID = 'modernDesk'
const DEFAULT_DESK_SIZE = 'm'

interface EditorState {
  // scene
  objects: SceneObject[]
  selectedId: string | null
  deskCatalogId: string
  deskSizeId: string
  deskColorwayId: string
  deskSurfaceY: number

  // gizmo / interaction
  transformMode: TransformMode
  gizmoAxis: GizmoAxis
  gizmoSize: number
  isDragging: boolean

  // persistence
  savedSetups: SavedSetupsMap

  // actions
  add: (catalogId: string, sizeId?: string, colorwayId?: string) => void
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

  swapDesk: (catalogId: string, sizeId?: string) => void
  setDeskColorway: (colorwayId: string) => void

  reset: () => void
  loadDefaultScene: () => void

  // serialization / persistence
  exportSetup: () => SetupV1
  loadSetup: (setup: SetupV1) => void
  saveNamed: (name: string) => void
  deleteNamed: (name: string) => void
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    objects: [],
    selectedId: null,
    deskCatalogId: DEFAULT_DESK_ID,
    deskSizeId: DEFAULT_DESK_SIZE,
    deskColorwayId: getItem(DEFAULT_DESK_ID).defaultColorwayId ?? '',
    deskSurfaceY: deskHeightOf(DEFAULT_DESK_ID, DEFAULT_DESK_SIZE),

    transformMode: 'translate',
    gizmoAxis: { x: true, y: false, z: true },
    gizmoSize: 0.8,
    isDragging: false,

    savedSetups: loadSavedSetups(),

    add: (catalogId, sizeId, colorwayId) =>
      set((s) => {
        const item = getItem(catalogId)
        const y = restingY(item.rests, s.deskSurfaceY)
        const obj: SceneObject = {
          id: newId(),
          catalogId,
          sizeId: sizeId ?? item.defaultSizeId,
          colorwayId: colorwayId ?? item.defaultColorwayId,
          position: [item.defaultSpawn[0], y, item.defaultSpawn[1]],
          rotationY: item.defaultYRotation,
        }
        s.objects.push(obj)
        s.selectedId = obj.id
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
        // translate slides on the rest plane (X/Z); rotate spins about Y only.
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
        // Y stays locked to the rest plane regardless of any gizmo Y movement.
        o.position = [position[0], restingY(item.rests, s.deskSurfaceY), position[2]]
        o.rotationY = rotationY
      }),

    setSize: (id, sizeId) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) o.sizeId = sizeId
      }),

    setColorway: (id, colorwayId) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id)
        if (o) o.colorwayId = colorwayId
      }),

    swapDesk: (catalogId, sizeId) =>
      set((s) => {
        const desk = getItem(catalogId)
        const sid = sizeId ?? desk.defaultSizeId
        s.deskCatalogId = catalogId
        s.deskSizeId = sid
        s.deskColorwayId = desk.defaultColorwayId ?? s.deskColorwayId
        const surfaceY = deskHeightOf(catalogId, sid)
        s.deskSurfaceY = surfaceY
        // Re-seat every desk-resting object onto the new surface height.
        for (const o of s.objects) {
          const item = getItem(o.catalogId)
          o.position = [o.position[0], restingY(item.rests, surfaceY), o.position[2]]
        }
      }),

    setDeskColorway: (colorwayId) =>
      set((s) => {
        s.deskColorwayId = colorwayId
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
        deskSizeId: s.deskSizeId,
        deskColorwayId: s.deskColorwayId,
        objects: s.objects,
      })
    },

    loadSetup: (setup) =>
      set((s) => {
        // Defensive: fall back to defaults for unknown desks, skip unknown items.
        const deskId = CATALOG_BY_ID[setup.desk.c] ? setup.desk.c : DEFAULT_DESK_ID
        const desk = getItem(deskId)
        const deskSizeId = desk.sizeOptions.some((o) => o.id === setup.desk.s)
          ? setup.desk.s
          : desk.defaultSizeId
        const surfaceY = deskHeightOf(deskId, deskSizeId)

        s.deskCatalogId = deskId
        s.deskSizeId = deskSizeId
        s.deskColorwayId = setup.desk.w ?? desk.defaultColorwayId ?? ''
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
              position: [o.p[0], restingY(item.rests, surfaceY), o.p[1]] as Vec3,
              rotationY: o.r,
            }
          })
      }),

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
