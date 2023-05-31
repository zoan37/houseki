import { Warehouse } from "@lattice-engine/core";
import {
  Geometry,
  LineMaterial,
  LineSegments,
  Node,
  Parent,
  SceneStruct,
} from "@lattice-engine/scene";
import { Commands, Entity, Query, Res, struct, SystemRes, With } from "thyseus";

import { PhysicsConfig, PhysicsStore } from "../resources";

@struct
class LocalStore {
  /**
   * The entity id of the debug lines.
   */
  @struct.u64 declare linesId: bigint;
}

export function generateDebug(
  commands: Commands,
  warehouse: Res<Warehouse>,
  localStore: SystemRes<LocalStore>,
  physicsStore: Res<PhysicsStore>,
  physicsConfig: Res<PhysicsConfig>,
  sceneStruct: Res<SceneStruct>,
  lines: Query<[Entity, Geometry], With<[LineMaterial, LineSegments]>>
) {
  if (!physicsConfig.debug) {
    // Remove the debug lines if they exist
    if (localStore.linesId) {
      commands.despawn(localStore.linesId);
      localStore.linesId = 0n;
    }

    return;
  }

  const buffers = physicsStore.world.debugRender();

  if (!localStore.linesId) {
    const material = new LineMaterial();
    material.vertexColors = true;

    const parent = new Parent();
    parent.id = sceneStruct.activeScene;

    const lines = commands
      .spawn()
      .add(material)
      .addType(Geometry)
      .addType(LineSegments)
      .addType(Node)
      .add(parent);
    localStore.linesId = lines.id;
  }

  for (const [entity, geometry] of lines) {
    if (entity.id !== localStore.linesId) continue;

    geometry.positions.write(buffers.vertices, warehouse);
    geometry.colors.write(buffers.colors, warehouse);
  }
}