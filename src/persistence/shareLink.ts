import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { SetupV2 } from './schema'
import { normalizeSetup } from './migrate'

/** Compress a setup into a URL-safe string for the share link's hash query. */
export function encodeSetup(setup: SetupV2): string {
  return compressToEncodedURIComponent(JSON.stringify(setup))
}

/** Decode + validate + migrate a share string. Returns null on any corruption. */
export function decodeSetup(code: string): SetupV2 | null {
  try {
    const json = decompressFromEncodedURIComponent(code)
    if (!json) return null
    return normalizeSetup(JSON.parse(json))
  } catch {
    return null
  }
}

/** Full shareable URL for the current setup (lives in the hash so GH Pages serves it). */
export function buildShareUrl(setup: SetupV2): string {
  return `${window.location.origin}${window.location.pathname}#/create?s=${encodeSetup(setup)}`
}

/**
 * Read the raw `s=` value from the hash query. We parse manually rather than via
 * URLSearchParams because lz-string's output can contain '+', which URLSearchParams
 * would wrongly turn into a space.
 */
export function readShareCode(): string | null {
  const hash = window.location.hash
  const q = hash.indexOf('?')
  if (q === -1) return null
  for (const pair of hash.slice(q + 1).split('&')) {
    if (pair.startsWith('s=')) return pair.slice(2)
  }
  return null
}
