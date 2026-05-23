/** Versioned, compact serialization of a setup. Short keys keep share links small. */
export const SCHEMA_VERSION = 1

export interface SetupObjectV1 {
  c: string // catalogId
  s: string // sizeId
  w?: string // colorwayId
  p: [number, number] // x, z (Y is derived from the rest plane on load)
  r: number // rotationY (radians)
}

export interface SetupV1 {
  v: 1
  desk: { c: string; s: string; w?: string }
  objects: SetupObjectV1[]
}
