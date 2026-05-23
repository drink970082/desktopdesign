import { useEffect } from 'react'
import type { Object3D } from 'three'
import { useThree } from '@react-three/fiber'
import { registerCapture } from './captureBridge'

/** True for transform-gizmo / selection-outline objects we don't want baked into the PNG. */
function isOverlay(o: Object3D): boolean {
  const name = o.constructor?.name ?? ''
  return /Helper|Gizmo|TransformControls/.test(o.type) || /Helper|Gizmo|TransformControls/.test(name)
}

/**
 * Exports the current view as a PNG. Lives inside the Canvas so it can reach the
 * renderer. It hides gizmo/outline objects by visibility (synchronous — no React
 * timing races), renders, reads pixels (Canvas uses preserveDrawingBuffer),
 * downloads, then restores visibility.
 */
export default function Screenshot() {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    registerCapture(() => {
      const hidden: Object3D[] = []
      scene.traverse((o) => {
        if (o.visible && isOverlay(o)) {
          o.visible = false
          hidden.push(o)
        }
      })

      gl.render(scene, camera)
      gl.domElement.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `desk-setup-${Date.now()}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
        for (const o of hidden) o.visible = true
        gl.render(scene, camera) // restore the on-screen view
      }, 'image/png')
    })
    return () => registerCapture(null)
  }, [gl, scene, camera])

  return null
}
