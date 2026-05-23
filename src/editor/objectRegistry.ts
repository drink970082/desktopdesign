import type { Object3D } from 'three'

/**
 * Maps a SceneObject id to its live three.js Object3D. Lets the transform gizmo find
 * its target and lets snapping/collision read world-space bounds, without threading
 * refs through the React tree.
 */
const registry = new Map<string, Object3D>()

export function registerObject3D(id: string, obj: Object3D) {
  registry.set(id, obj)
}

export function unregisterObject3D(id: string) {
  registry.delete(id)
}

export function getObject3D(id: string): Object3D | undefined {
  return registry.get(id)
}
