import { useRef } from 'react'
import EditorCanvas from '../editor/EditorCanvas'
import { INITIAL_CAMERA, type EditorControls } from '../editor/cameraConfig'

export default function Create() {
  const controlsRef = useRef<EditorControls>(null)

  function resetCamera() {
    const c = controlsRef.current
    if (!c) return
    c.object.position.set(...INITIAL_CAMERA.position)
    c.target.set(...INITIAL_CAMERA.target)
    c.update()
  }

  return (
    <div className="relative h-full w-full">
      <EditorCanvas controlsRef={controlsRef} />

      {/* Overlay toolbar (does not block canvas interaction except on the controls themselves). */}
      <div className="pointer-events-none absolute inset-0 p-3">
        <button
          type="button"
          onClick={resetCamera}
          className="pointer-events-auto rounded-md bg-zinc-900/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-zinc-900"
        >
          Reset camera
        </button>
      </div>
    </div>
  )
}
