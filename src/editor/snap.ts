import * as THREE from 'three'
import type { Object3D } from 'three'
import { getItem, getSize } from '../catalog/catalog'
import { useEditorStore } from '../store/useEditorStore'
import { getObject3D } from './objectRegistry'

const _box = new THREE.Box3()
const _other = new THREE.Box3()
const _size = new THREE.Vector3()

function clamp(v: number, lo: number, hi: number) {
  if (hi < lo) return (lo + hi) / 2 // object wider than the desk: just center it
  return Math.min(hi, Math.max(lo, v))
}

/** World-space AABB of an object (matrices refreshed first). */
function worldBox(obj: Object3D, target: THREE.Box3) {
  obj.updateWorldMatrix(true, true)
  return target.setFromObject(obj)
}

/** Clamp the moving object's center so its footprint stays on the desk surface. */
function clampToDesk(node: Object3D, halfX: number, halfZ: number) {
  const s = useEditorStore.getState()
  const desk = getItem(s.deskCatalogId)
  const [dw, , dd] = getSize(desk, s.deskSizeId).dimensions
  const margin = 0.01
  node.position.x = clamp(node.position.x, -dw / 2 + halfX + margin, dw / 2 - halfX - margin)
  node.position.z = clamp(node.position.z, -dd / 2 + halfZ + margin, dd / 2 - halfZ - margin)
}

/**
 * On drop: keep a desk item on the desk and resolve overlaps with other items on the
 * same rest plane by pushing along the axis of least penetration (AABB only). Mutates
 * `node.position` (X/Z) and returns the settled [x, z] to persist. Y stays locked by
 * the store. All bounds are world-space, recomputed after each move.
 */
export function applySnapAndCollision(id: string, node: Object3D): [number, number] {
  const state = useEditorStore.getState()
  const moving = state.objects.find((o) => o.id === id)
  if (!moving) return [node.position.x, node.position.z]
  const item = getItem(moving.catalogId)

  worldBox(node, _box).getSize(_size)
  const halfX = _size.x / 2
  const halfZ = _size.z / 2

  if (item.rests === 'desk') clampToDesk(node, halfX, halfZ)

  if (!item.noCollide) {
    for (let iter = 0; iter < 4; iter++) {
      worldBox(node, _box)
      let moved = false
      for (const other of state.objects) {
        if (other.id === id) continue
        const otherItem = getItem(other.catalogId)
        if (otherItem.noCollide || otherItem.rests !== item.rests) continue
        const on = getObject3D(other.id)
        if (!on) continue
        worldBox(on, _other)

        const ox = Math.min(_box.max.x, _other.max.x) - Math.max(_box.min.x, _other.min.x)
        const oz = Math.min(_box.max.z, _other.max.z) - Math.max(_box.min.z, _other.min.z)
        if (ox <= 0 || oz <= 0) continue // no XZ overlap

        const cx = (_box.min.x + _box.max.x) / 2
        const cz = (_box.min.z + _box.max.z) / 2
        const ocx = (_other.min.x + _other.max.x) / 2
        const ocz = (_other.min.z + _other.max.z) / 2
        // push out along the smaller penetration axis
        if (ox < oz) node.position.x += cx < ocx ? -ox : ox
        else node.position.z += cz < ocz ? -oz : oz

        moved = true
        worldBox(node, _box)
      }
      if (!moved) break
    }
    // a push may have nudged it off the desk; clamp once more
    if (item.rests === 'desk') {
      worldBox(node, _box).getSize(_size)
      clampToDesk(node, _size.x / 2, _size.z / 2)
    }
  }

  return [node.position.x, node.position.z]
}
