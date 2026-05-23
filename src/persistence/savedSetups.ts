import type { SetupV1 } from './schema'

const SETUPS_KEY = 'deskconf.setups.v1'
const AUTOSAVE_KEY = 'deskconf.autosave.v1'

export interface SavedSetupRecord {
  updatedAt: number
  data: SetupV1
}
export type SavedSetupsMap = Record<string, SavedSetupRecord>

export function loadSavedSetups(): SavedSetupsMap {
  try {
    const raw = localStorage.getItem(SETUPS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as SavedSetupsMap) : {}
  } catch {
    return {}
  }
}

export function persistSavedSetups(map: SavedSetupsMap) {
  try {
    localStorage.setItem(SETUPS_KEY, JSON.stringify(map))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function loadAutosave(): SetupV1 | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY)
    return raw ? (JSON.parse(raw) as SetupV1) : null
  } catch {
    return null
  }
}

export function persistAutosave(setup: SetupV1) {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(setup))
  } catch {
    /* ignore */
  }
}
