import type { FC } from 'react'
import type { ModelProps } from './types'
import { Desk } from './Desk'
import { Monitor } from './Monitor'
import { Keyboard } from './Keyboard'
import { Mouse } from './Mouse'
import { Mousepad } from './Mousepad'

/** Maps a procedural modelKey (from a CatalogItem's renderer) to its component. */
export const PROCEDURAL_MODELS: Record<string, FC<ModelProps>> = {
  desk: Desk,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  mousepad: Mousepad,
}
