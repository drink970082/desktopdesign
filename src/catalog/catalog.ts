import type { CatalogItem, Colorway, SizeOption } from '../store/types'

const WOOD_COLORWAYS: Colorway[] = [
  { id: 'oak', label: 'Oak', colors: { top: '#c79a6b', frame: '#6f6f73' } },
  { id: 'walnut', label: 'Walnut', colors: { top: '#6b4a32', frame: '#3a3a3a' } },
  { id: 'white', label: 'White', colors: { top: '#e8e8ea', frame: '#cfcfd4' } },
]

const DEVICE_COLORWAYS: Colorway[] = [
  { id: 'black', label: 'Black', colors: { body: '#1c1c1f', accent: '#3a3a3f' } },
  { id: 'white', label: 'White', colors: { body: '#e9e9ec', accent: '#cfcfd4' } },
]

/**
 * Vertical-slice catalog: a representative item per core category. Each entry is
 * parametric (sizes + colorways), so expanding the catalog later is mostly data.
 * All dimensions are meters [w, h, d]; models use a base origin (y=0 at the bottom).
 */
export const CATALOG: CatalogItem[] = [
  // ---- Desks (the scene anchor; chosen via swapDesk, not placed as objects) ----
  {
    id: 'modernDesk',
    category: 'desk',
    name: 'Modern Desk',
    renderer: { kind: 'procedural', modelKey: 'desk' },
    sizeOptions: [
      { id: 's', label: 'Small (120cm)', dimensions: [1.2, 0.74, 0.6] },
      { id: 'm', label: 'Medium (140cm)', dimensions: [1.4, 0.74, 0.65] },
      { id: 'l', label: 'Large (160cm)', dimensions: [1.6, 0.74, 0.7] },
    ],
    defaultSizeId: 'm',
    colorways: WOOD_COLORWAYS,
    defaultColorwayId: 'oak',
    defaultYRotation: 0,
    defaultSpawn: [0, 0],
    rests: 'desk',
  },
  {
    id: 'standingDesk',
    category: 'desk',
    name: 'Standing Desk',
    renderer: { kind: 'procedural', modelKey: 'desk' },
    sizeOptions: [
      { id: 'm', label: 'Medium (140cm)', dimensions: [1.4, 1.05, 0.65] },
      { id: 'l', label: 'Large (160cm)', dimensions: [1.6, 1.05, 0.7] },
    ],
    defaultSizeId: 'm',
    colorways: WOOD_COLORWAYS,
    defaultColorwayId: 'walnut',
    defaultYRotation: 0,
    defaultSpawn: [0, 0],
    rests: 'desk',
  },

  // ---- Monitors ----
  {
    id: 'monitor',
    category: 'monitor',
    name: 'Monitor',
    renderer: { kind: 'procedural', modelKey: 'monitor' },
    sizeOptions: [
      { id: '24', label: '24" 16:9', dimensions: [0.55, 0.34, 0.05] },
      { id: '27', label: '27" 16:9', dimensions: [0.62, 0.38, 0.05] },
      { id: '32', label: '32" 16:9', dimensions: [0.73, 0.43, 0.06] },
      { id: 'uw34', label: '34" 21:9', dimensions: [0.82, 0.37, 0.06] },
    ],
    defaultSizeId: '27',
    colorways: DEVICE_COLORWAYS,
    defaultColorwayId: 'black',
    defaultYRotation: 0,
    defaultSpawn: [0, -0.18],
    rests: 'desk',
  },

  // ---- Keyboards ----
  {
    id: 'keyboard',
    category: 'keyboard',
    name: 'Keyboard',
    renderer: { kind: 'procedural', modelKey: 'keyboard' },
    sizeOptions: [
      { id: '60', label: '60%', dimensions: [0.3, 0.04, 0.11] },
      { id: 'tkl', label: 'TKL', dimensions: [0.36, 0.04, 0.13] },
      { id: 'full', label: 'Full-size', dimensions: [0.44, 0.04, 0.14] },
    ],
    defaultSizeId: 'tkl',
    colorways: DEVICE_COLORWAYS,
    defaultColorwayId: 'black',
    defaultYRotation: 0,
    defaultSpawn: [0, 0.12],
    rests: 'desk',
  },

  // ---- Mice ----
  {
    id: 'mouse',
    category: 'mouse',
    name: 'Mouse',
    renderer: { kind: 'procedural', modelKey: 'mouse' },
    sizeOptions: [{ id: 'std', label: 'Standard', dimensions: [0.065, 0.038, 0.11] }],
    defaultSizeId: 'std',
    colorways: DEVICE_COLORWAYS,
    defaultColorwayId: 'black',
    defaultYRotation: 0,
    defaultSpawn: [0.34, 0.12],
    rests: 'desk',
  },

  // ---- Mousepads ----
  {
    id: 'mousepad',
    category: 'mousepad',
    name: 'Mousepad',
    renderer: { kind: 'procedural', modelKey: 'mousepad' },
    sizeOptions: [
      { id: 'm', label: 'Medium', dimensions: [0.36, 0.004, 0.3] },
      { id: 'l', label: 'Large', dimensions: [0.45, 0.004, 0.4] },
    ],
    defaultSizeId: 'm',
    colorways: [
      { id: 'black', label: 'Black', colors: { body: '#161618' } },
      { id: 'gray', label: 'Gray', colors: { body: '#3a3a40' } },
    ],
    defaultColorwayId: 'black',
    defaultYRotation: 0,
    defaultSpawn: [0.34, 0.12],
    rests: 'desk',
    noCollide: true, // a pad — the mouse is meant to sit on top of it
  },
]

export const CATALOG_BY_ID: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((i) => [i.id, i]),
)

export function getItem(catalogId: string): CatalogItem {
  const item = CATALOG_BY_ID[catalogId]
  if (!item) throw new Error(`Unknown catalog item: ${catalogId}`)
  return item
}

export function getSize(item: CatalogItem, sizeId: string): SizeOption {
  return item.sizeOptions.find((s) => s.id === sizeId) ?? item.sizeOptions[0]
}

export function getColorway(item: CatalogItem, colorwayId?: string): Colorway | undefined {
  if (!item.colorways) return undefined
  return item.colorways.find((c) => c.id === colorwayId) ?? item.colorways[0]
}
