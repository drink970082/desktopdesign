import type { CatalogCategory } from '../store/types'

/** Display order of categories in the catalog panel. */
export const CATEGORY_ORDER: CatalogCategory[] = [
  'desk',
  'monitor',
  'keyboard',
  'mouse',
  'mousepad',
  'speaker',
  'laptop',
  'tower',
  'lamp',
  'decor',
  'chair',
  'custom',
]

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  desk: 'Desks',
  monitor: 'Monitors',
  keyboard: 'Keyboards',
  mouse: 'Mice',
  mousepad: 'Mousepads',
  speaker: 'Speakers',
  laptop: 'Laptops',
  tower: 'PC Towers',
  lamp: 'Lamps',
  decor: 'Decor',
  chair: 'Chairs',
  custom: 'Custom',
}
