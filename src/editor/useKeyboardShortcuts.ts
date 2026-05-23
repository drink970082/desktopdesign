import { useEffect } from 'react'
import { useEditorStore } from '../store/useEditorStore'

/**
 * Global editor hotkeys (ignored while typing in form fields):
 *  Delete/Backspace = delete selected · C = deselect · R = toggle move/rotate
 *  X/Y/Z = toggle gizmo axis · +/- = gizmo size
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      ) {
        return
      }

      const s = useEditorStore.getState()
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (s.selectedId) {
            e.preventDefault()
            s.removeSelected()
          }
          break
        case 'c':
        case 'C':
          s.select(null)
          break
        case 'r':
        case 'R':
          s.toggleMode()
          break
        case 'x':
        case 'X':
          s.toggleAxis('x')
          break
        case 'y':
        case 'Y':
          s.toggleAxis('y')
          break
        case 'z':
        case 'Z':
          s.toggleAxis('z')
          break
        case '+':
        case '=':
          s.bumpGizmoSize(0.1)
          break
        case '-':
        case '_':
          s.bumpGizmoSize(-0.1)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
