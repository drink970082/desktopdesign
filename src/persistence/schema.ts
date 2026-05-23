/** Versioned, compact serialization of a setup. Short keys keep share links small. */
export const SCHEMA_VERSION = 2

// ---- v1 (legacy; kept for migration of old links/saves) ----
export interface SetupObjectV1 {
  c: string // catalogId
  s: string // sizeId
  w?: string // colorwayId
  p: [number, number] // x, z
  r: number // rotationY
}
export interface SetupV1 {
  v: 1
  desk: { c: string; s: string; w?: string }
  objects: SetupObjectV1[]
}

// ---- v2 (current): adds per-instance customization + explicit desk dimensions ----
export interface SetupObjectV2 {
  c: string // catalogId
  s: string // sizeId
  w?: string // colorwayId
  cc?: string // customColor
  cd?: { w?: number; h?: number; d?: number } // customDims
  o?: Record<string, boolean> // options
  e?: number // elevation
  p: [number, number] // x, z (Y derived on load)
  r: number // rotationY
}
export interface SetupDeskV2 {
  c: string // catalogId
  w: number // width
  dp: number // depth
  ht: number // height
  cw?: string // colorwayId
  cc?: string // customColor
}
export interface SetupV2 {
  v: 2
  desk: SetupDeskV2
  objects: SetupObjectV2[]
}

export type AnySetup = SetupV1 | SetupV2
