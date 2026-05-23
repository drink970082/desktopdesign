import type { Vec3 } from '../store/types'

/** Props every model component receives. Models are built with a base origin (y=0 at bottom). */
export interface ModelProps {
  /** [w, h, d] in meters. */
  dimensions: Vec3
  /** Colorway colors keyed by role (e.g. body/accent/top/frame/screen). */
  colors: Record<string, string>
  /** Boolean toggle states (e.g. { stand: false }). */
  options?: Record<string, boolean>
}
