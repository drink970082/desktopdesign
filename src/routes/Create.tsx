import { useEffect, useRef } from 'react'
import EditorCanvas from '../editor/EditorCanvas'
import { INITIAL_CAMERA, type EditorControls } from '../editor/cameraConfig'
import CatalogPanel from '../ui/CatalogPanel'
import { useEditorStore } from '../store/useEditorStore'

export default function Create() {
  const controlsRef = useRef<EditorControls>(null)
  const loadDefaultScene = useEditorStore((s) => s.loadDefaultScene)
  const didInit = useRef(false)

  useEffect(() => {
    // Seed a starter scene once on first visit (share-link loading replaces this later).
    if (didInit.current) return
    didInit.current = true
    if (useEditorStore.getState().objects.length === 0) loadDefaultScene()
  }, [loadDefaultScene])

  function resetCamera() {
    const c = controlsRef.current
    if (!c) return
    c.object.position.set(...INITIAL_CAMERA.position)
    c.target.set(...INITIAL_CAMERA.target)
    c.update()
  }

  return (
    <div className="flex h-full w-full">
      <CatalogPanel />
      <div className="relative min-w-0 flex-1">
        <EditorCanvas controlsRef={controlsRef} />
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
    </div>
  )
}
