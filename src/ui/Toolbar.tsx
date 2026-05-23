import { useState } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { buildShareUrl } from '../persistence/shareLink'
import { requestCapture } from '../editor/captureBridge'

const btn =
  'rounded-md bg-zinc-900/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-zinc-900'
const field =
  'rounded-md border border-white/20 bg-zinc-900/70 px-2 py-1.5 text-sm text-white backdrop-blur placeholder:text-white/50'

/** Floating editor toolbar: reset camera, save/load named setups, share link, clear. */
export default function Toolbar({ onResetCamera }: { onResetCamera: () => void }) {
  const exportSetup = useEditorStore((s) => s.exportSetup)
  const saveNamed = useEditorStore((s) => s.saveNamed)
  const loadSetup = useEditorStore((s) => s.loadSetup)
  const reset = useEditorStore((s) => s.reset)
  const savedSetups = useEditorStore((s) => s.savedSetups)

  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const names = Object.keys(savedSetups).sort()

  function flash(text: string) {
    setMsg(text)
    window.setTimeout(() => setMsg(''), 2500)
  }

  function onSave() {
    const n = name.trim() || `Setup ${names.length + 1}`
    saveNamed(n)
    setName('')
    flash(`Saved “${n}”`)
  }

  async function onShare() {
    const url = buildShareUrl(exportSetup())
    try {
      await navigator.clipboard.writeText(url)
      flash('Share link copied!')
    } catch {
      console.log('Share URL:', url)
      flash('Copy failed — link logged to console')
    }
  }

  return (
    <div className="pointer-events-auto flex flex-wrap items-center gap-2">
      <button type="button" className={btn} onClick={onResetCamera}>
        Reset camera
      </button>

      <input
        className={`${field} w-32`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Setup name"
        onKeyDown={(e) => e.key === 'Enter' && onSave()}
      />
      <button type="button" className={btn} onClick={onSave}>
        Save
      </button>

      <select
        className={field}
        value=""
        onChange={(e) => {
          const n = e.target.value
          if (n && savedSetups[n]) loadSetup(savedSetups[n].data)
        }}
      >
        <option value="">{names.length ? 'Load saved…' : 'No saved setups'}</option>
        {names.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <button type="button" className={btn} onClick={onShare}>
        Share
      </button>
      <button type="button" className={btn} onClick={() => requestCapture()}>
        Screenshot
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => {
          if (window.confirm('Remove all objects from the desk?')) reset()
        }}
      >
        Clear
      </button>

      {msg && (
        <span className="rounded bg-emerald-600/90 px-2 py-1 text-xs font-medium text-white">
          {msg}
        </span>
      )}
    </div>
  )
}
