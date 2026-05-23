/** [x, y, z] in meters. */
export type Vec3 = [number, number, number]

export type CatalogCategory =
  | 'desk'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'mousepad'
  | 'speaker'
  | 'laptop'
  | 'tower'
  | 'lamp'
  | 'decor'
  | 'chair'

/** How an item is drawn: a procedural component (by key) or a loaded GLB file. */
export type Renderer =
  | { kind: 'procedural'; modelKey: string }
  | { kind: 'glb'; url: string }

/** A selectable size for an item. `dimensions` is the model's [w, h, d] footprint/extent. */
export interface SizeOption {
  id: string
  label: string
  dimensions: Vec3
}

/** A named color scheme. `colors` is a free-form map consumed by the procedural component. */
export interface Colorway {
  id: string
  label: string
  colors: Record<string, string>
}

/**
 * A catalog entry. One entry can expose many sizes/colorways, so e.g. all monitor
 * sizes collapse into a single item (vs. the original's 14 rows).
 *
 * Placement convention: every model uses a **base origin** — local y=0 is the
 * surface-contact point, geometry extends upward. So an instance's world Y is just
 * its rest plane (desk top or floor); no half-height math is needed.
 */
export interface CatalogItem {
  id: string
  category: CatalogCategory
  name: string
  renderer: Renderer
  sizeOptions: SizeOption[]
  defaultSizeId: string
  colorways?: Colorway[]
  defaultColorwayId?: string
  /** Y rotation in radians applied when first placed. */
  defaultYRotation: number
  /** Where on the desk it spawns: [x, z] meters relative to desk center (origin). */
  defaultSpawn: [number, number]
  /** Which plane the base rests on. Desk items track the desk surface; chairs etc. the floor. */
  rests: 'desk' | 'floor'
  /** If true, ignored by collision resolution (e.g. mousepads, which things sit on top of). */
  noCollide?: boolean
}

/** A live instance placed in the scene. This is the unit that gets serialized. */
export interface SceneObject {
  id: string
  catalogId: string
  sizeId: string
  colorwayId?: string
  /** World position. Y is derived from the rest plane and kept in sync (never free). */
  position: Vec3
  /** Y rotation in radians (the only axis objects rotate about). */
  rotationY: number
}

export type TransformMode = 'translate' | 'rotate'
export interface GizmoAxis {
  x: boolean
  y: boolean
  z: boolean
}
