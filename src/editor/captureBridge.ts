/**
 * Tiny bridge so the DOM toolbar (outside the Canvas) can trigger a screenshot
 * implemented inside the Canvas (where `useThree` is available).
 */
type CaptureFn = () => void

let fn: CaptureFn | null = null

export function registerCapture(f: CaptureFn | null) {
  fn = f
}

export function requestCapture() {
  fn?.()
}
