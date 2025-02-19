import {
  Collider,
  KinematicCharacterController,
  Ray,
  RigidBody,
  World,
} from "@dimforge/rapier3d";
import { struct, type u64 } from "thyseus";

export class PhysicsStore {
  readonly world = new World({ x: 0, y: -9.81, z: 0 });

  /**
   * Entity ID -> Rapier collider
   */
  readonly boxColliders = new Map<bigint, Collider>();
  readonly sphereColliders = new Map<bigint, Collider>();
  readonly capsuleColliders = new Map<bigint, Collider>();
  readonly cylinderColliders = new Map<bigint, Collider>();
  readonly hullColliders = new Map<bigint, Collider>();
  readonly meshColliders = new Map<bigint, Collider>();

  /**
   * Entity ID -> Rapier rigidbody
   */
  readonly staticBodies = new Map<bigint, RigidBody>();
  readonly kinematicBodies = new Map<bigint, RigidBody>();
  readonly dynamicBodies = new Map<bigint, RigidBody>();

  /**
   * Entity ID -> Rapier Character Controller
   */
  readonly characterControllers = new Map<
    bigint,
    KinematicCharacterController
  >();

  /**
   * Raycast Entity ID -> Rapier ray
   */
  readonly rays = new Map<bigint, Ray>();

  /**
   * Returns the Rapier rigidbody for the given entity ID.
   */
  getRigidBody(id: bigint) {
    return (
      this.staticBodies.get(id) ??
      this.kinematicBodies.get(id) ??
      this.dynamicBodies.get(id)
    );
  }

  /**
   * Returns the Rapier collider for the given entity ID.
   */
  getCollider(id: bigint) {
    return (
      this.boxColliders.get(id) ??
      this.sphereColliders.get(id) ??
      this.capsuleColliders.get(id) ??
      this.cylinderColliders.get(id) ??
      this.hullColliders.get(id) ??
      this.meshColliders.get(id)
    );
  }

  findColliderEntity(collider: Collider) {
    for (const [id, c] of this.boxColliders) {
      if (collider === c) return id;
    }

    for (const [id, c] of this.sphereColliders) {
      if (collider === c) return id;
    }

    for (const [id, c] of this.capsuleColliders) {
      if (collider === c) return id;
    }

    for (const [id, c] of this.cylinderColliders) {
      if (collider === c) return id;
    }

    for (const [id, c] of this.hullColliders) {
      if (collider === c) return id;
    }

    for (const [id, c] of this.meshColliders) {
      if (collider === c) return id;
    }

    return undefined;
  }
}

@struct
export class PhysicsConfig {
  debug: boolean = false;
}

@struct
export class DebugResource {
  /**
   * The entity id of the debug lines.
   */
  linesId: u64 = 0n;
}
