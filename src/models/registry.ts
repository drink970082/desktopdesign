import type { FC } from 'react'
import type { ModelProps } from './types'
import { Desk } from './Desk'
import { Monitor } from './Monitor'
import { Keyboard } from './Keyboard'
import { Mouse } from './Mouse'
import { Mousepad } from './Mousepad'
import { Speaker } from './Speaker'
import { Laptop } from './Laptop'
import { Tower } from './Tower'
import { Lamp } from './Lamp'
import { Book } from './Book'
import { CoffeeCup } from './CoffeeCup'
import { SimpleChair } from './SimpleChair'
import { CustomBox } from './CustomBox'

/** Maps a procedural modelKey (from a CatalogItem's renderer) to its component. */
export const PROCEDURAL_MODELS: Record<string, FC<ModelProps>> = {
  desk: Desk,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  mousepad: Mousepad,
  speaker: Speaker,
  laptop: Laptop,
  tower: Tower,
  lamp: Lamp,
  book: Book,
  coffeeCup: CoffeeCup,
  chair: SimpleChair,
  customBox: CustomBox,
}
