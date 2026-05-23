import { type ComponentRef } from 'react'
import { OrbitControls } from '@react-three/drei'

/** Ref type for the OrbitControls instance (exposes .object, .target, .update()). */
export type EditorControls = ComponentRef<typeof OrbitControls>

/** Default camera framing, in meters. Used on mount and by "Reset camera". */
export const INITIAL_CAMERA: {
  position: [number, number, number]
  target: [number, number, number]
} = {
  position: [1.5, 1.15, 1.9],
  target: [0, 0.55, 0],
}
