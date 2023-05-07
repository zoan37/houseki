import { PerspectiveCamera } from "@lattice-engine/core";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { defineSystem, Entity } from "thyseus";

import { RenderStore } from "../RenderStore";

/**
 * Syncs PerspectiveCamera components with Three.js PerspectiveCamera objects.
 */
export const cameraBuilder = defineSystem(
  ({ Res, Query }) => [Res(RenderStore), Query([PerspectiveCamera, Entity])],
  (store, cameras) => {
    const ids: bigint[] = [];

    for (const [camera, { id }] of cameras) {
      ids.push(id);

      let object = store.perspectiveCameras.get(id);

      // Create new objects
      if (!object) {
        object = new ThreePerspectiveCamera();
        store.perspectiveCameras.set(id, object);
      }

      // Sync object properties
      const canvas = store.renderer.domElement;
      object.aspect = canvas.width / canvas.height;
      object.updateProjectionMatrix();

      object.fov = camera.fov;
      object.near = camera.near;
      object.far = camera.far;
    }

    // Remove objects that no longer exist
    for (const [id] of store.perspectiveCameras) {
      if (!ids.includes(id)) store.perspectiveCameras.delete(id);
    }
  }
);