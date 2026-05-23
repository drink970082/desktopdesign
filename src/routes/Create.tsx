import { useEffect, useRef } from 'react'
import EditorCanvas from '../editor/EditorCanvas'
import { INITIAL_CAMERA, type EditorControls } from '../editor/cameraConfig'
import { useKeyboardShortcuts } from '../editor/useKeyboardShortcuts'
import CatalogPanel from '../ui/CatalogPanel'
import InspectorPanel from '../ui/InspectorPanel'
import Toolbar from '../ui/Toolbar'
import { useEditorStore } from '../store/useEditorStore'
import { decodeSetup, readShareCode } from '../persistence/shareLink'
import { loadAutosave, persistAutosave } from '../persistence/savedSetups'

export default function Create() {
  const controlsRef = useRef<EditorControls>(null)
  const didInit = useRef(false)

  useKeyboardShortcuts()

  // Initial scene: share link > autosave > seeded default (once per mount, only if empty).
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    const store = useEditorStore.getState()

    const code = readShareCode()
    if (code) {
      const setup = decodeSetup(code)
      if (setup) {
        store.loadSetup(setup)
        return
      }
      console.warn('Ignoring invalid share link')
    }
    if (store.objects.length > 0) return // keep in-memory work across navigation
    const auto = loadAutosave()
    if (auto) store.loadSetup(auto)
    else store.loadDefaultScene()
  }, [])

  // Debounced autosave of the working scene.
  useEffect(() => {
    let t: number | undefined
    const unsub = useEditorStore.subscribe(() => {
      window.clearTimeout(t)
      t = window.setTimeout(() => persistAutosave(useEditorStore.getState().exportSetup()), 400)
    })
    return () => {
      window.clearTimeout(t)
      unsub()
    }
  }, [])

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
        <div className="pointer-events-none absolute inset-x-0 top-0 p-3">
          <Toolbar onResetCamera={resetCamera} />
        </div>
      </div>
      <InspectorPanel />
    </div>
  )
}
