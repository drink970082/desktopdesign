import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { SCHEMA_VERSION, type SetupV1 } from './schema'

/** Compress a setup into a URL-safe string for the share link's hash query. */
export function encodeSetup(setup: SetupV1): string {
  return compressToEncodedURIComponent(JSON.stringify(setup))
}

/** Decode + validate a share string. Returns null on any corruption or version mismatch. */
export function decodeSetup(code: string): SetupV1 | null {
  try {
    const json = decompressFromEncodedURIComponent(code)
    if (!json) return null
    const data = JSON.parse(json)
    if (
      !data ||
      data.v !== SCHEMA_VERSION ||
      typeof data.desk !== 'object' ||
      !Array.isArray(data.objects)
    ) {
      return null
    }
    return data as SetupV1
  } catch {
    return null
  }
}

/** Full shareable URL for the current setup (lives in the hash so GH Pages serves it). */
export function buildShareUrl(setup: SetupV1): string {
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
