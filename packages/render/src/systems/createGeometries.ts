import { Warehouse } from "@lattice-engine/core";
import { Geometry } from "@lattice-engine/scene";
import { BufferAttribute, BufferGeometry } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates geometry objects.
 */
export function createGeometries(
  warehouse: Res<Warehouse>,
  store: Res<RenderStore>,
  entities: Query<[Geometry, Entity]>
) {
  const ids: bigint[] = [];

  for (const [geometry, entity] of entities) {
    ids.push(entity.id);

    let object = store.geometries.get(entity.id);

    // Create new objects
    if (!object) {
      object = new BufferGeometry();
      store.geometries.set(entity.id, object);
    }

    // Sync object properties
    if (geometry.colors.id) {
      const colors = geometry.colors.read(warehouse);
      setAttribute(object, "color", colors, 4);
    }

    if (geometry.positions.id) {
      const positions = geometry.positions.read(warehouse);
      setAttribute(object, "position", positions, 3);
    }

    if (geometry.normals.id) {
      const normals = geometry.normals.read(warehouse);
      setAttribute(object, "normal", normals, 3);
    }

    if (geometry.uvs.id) {
      const uvs = geometry.uvs.read(warehouse);
      setAttribute(object, "uv", uvs, 2);
    }

    if (geometry.indices.id) {
      const indices = geometry.indices.read(warehouse);
      setAttribute(object, "index", indices, 1);
    }
  }

  // Remove objects that no longer exist
  for (const [id] of store.geometries) {
    if (!ids.includes(id)) {
      const object = store.geometries.get(id);
      if (object) object.dispose();

      store.geometries.delete(id);
    }
  }
}

/**
 * Sets a BufferGeometry attribute to a given array,
 * creating a new attribute if one does not already exist.
 * Also supports setting the index.
 */
function setAttribute(
  geometry: BufferGeometry,
  name: string,
  data: ArrayLike<number>,
  itemSize: number
) {
  const attribute =
    name === "index" ? geometry.getIndex() : geometry.getAttribute(name);

  if (
    attribute instanceof BufferAttribute &&
    attribute.itemSize === itemSize &&
    attribute.array.length === data.length
  ) {
    // Ignore if data is already set
    if (attribute.array === data) return;

    // Reuse existing attribute
    attribute.set(data);
    attribute.needsUpdate = true;
  } else {
    // Create new attribute
    const attribute = new BufferAttribute(data, itemSize);

    if (name === "index") geometry.setIndex(attribute);
    else geometry.setAttribute(name, attribute);
  }
}