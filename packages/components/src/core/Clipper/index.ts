import * as THREE from "three";
import {
  Component,
  Createable,
  Disposable,
  Event,
  Hideable,
  World,
} from "../Types";
import { SimplePlane } from "./src";
import { Components } from "../Components";
import { Raycasters } from "../Raycasters";
import { Worlds } from "../Worlds";

export * from "./src";

/**
 * A lightweight component to easily create and handle
 * [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes).
 *
 * @param components - the instance of {@link Components} used.
 * @param planeType - the type of plane to be used by the clipper.
 * E.g. {@link SimplePlane}.
 */
export class Clipper<T extends SimplePlane>
  extends Component
  implements Createable, Disposable, Hideable
{
  static readonly uuid = "66290bc5-18c4-4cd1-9379-2e17a0617611" as const;

  /** {@link Createable.onAfterCreate} */
  readonly onAfterCreate = new Event<T>();

  /** {@link Createable.onAfterDelete} */
  readonly onAfterDelete = new Event<T>();

  /** Event that fires when the user starts dragging a clipping plane. */
  readonly onBeforeDrag = new Event<void>();

  /** Event that fires when the user stops dragging a clipping plane. */
  readonly onAfterDrag = new Event<void>();

  readonly onBeforeCreate = new Event();

  readonly onBeforeCancel = new Event();

  readonly onAfterCancel = new Event();

  readonly onBeforeDelete = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Whether to force the clipping plane to be orthogonal in the Y direction
   * (up). This is desirable when clipping a building horizontally and a
   * clipping plane is created in its roof, which might have a slight
   * slope for draining purposes.
   */
  orthogonalY = false;

  /**
   * The tolerance that determines whether an almost-horizontal clipping plane
   * will be forced to be orthogonal to the Y direction. {@link orthogonalY}
   * has to be `true` for this to apply.
   */
  toleranceOrthogonalY = 0.7;

  planes: T[] = [];

  protected PlaneType: new (...args: any) => SimplePlane | T;

  /** The material used in all the clipping planes. */
  protected _material: THREE.Material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });

  private _size = 5;
  private _enabled = false;
  private _visible = false;

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    for (const plane of this.planes) {
      plane.enabled = state;
    }
    this.updateMaterialsAndPlanes();
  }

  /** {@link Hideable.visible } */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible } */
  set visible(state: boolean) {
    this._visible = state;
    for (const plane of this.planes) {
      plane.visible = state;
    }
  }

  /** The material of the clipping plane representation. */
  get material() {
    return this._material;
  }

  /** The material of the clipping plane representation. */
  set material(material: THREE.Material) {
    this._material = material;
    for (const plane of this.planes) {
      plane.planeMaterial = material;
    }
  }

  /** The size of the geometric representation of the clippings planes. */
  get size() {
    return this._size;
  }

  /** The size of the geometric representation of the clippings planes. */
  set size(size: number) {
    this._size = size;
    for (const plane of this.planes) {
      plane.size = size;
    }
  }

  constructor(components: Components) {
    super(components);
    this.components.add(Clipper.uuid, this);
    this.PlaneType = SimplePlane;
  }

  endCreation() {}
  cancelCreation() {}

  /** {@link Disposable.dispose} */
  dispose() {
    this._enabled = false;
    for (const plane of this.planes) {
      plane.dispose();
    }
    this.planes.length = 0;
    this._material.dispose();
    this.onBeforeCreate.reset();
    this.onBeforeCancel.reset();
    this.onBeforeDelete.reset();
    this.onBeforeDrag.reset();
    this.onAfterCreate.reset();
    this.onAfterCancel.reset();
    this.onAfterDelete.reset();
    this.onAfterDrag.reset();
    this.onDisposed.trigger(Clipper.uuid);
    this.onDisposed.reset();
  }

  /** {@link Createable.create} */
  create(world: World) {
    if (!this.enabled) return;

    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);

    const intersects = caster.castRay();
    if (intersects) {
      this.createPlaneFromIntersection(world, intersects);
    }
  }

  /**
   * Creates a plane in a certain place and with a certain orientation,
   * without the need of the mouse.
   *
   * @param world - the world where this plane should be created.
   * @param normal - the orientation of the clipping plane.
   * @param point - the position of the clipping plane.
   * navigation.
   */
  createFromNormalAndCoplanarPoint(
    world: World,
    normal: THREE.Vector3,
    point: THREE.Vector3,
  ) {
    const plane = this.newPlane(world, point, normal);
    this.updateMaterialsAndPlanes();
    return plane;
  }

  /**
   * {@link Createable.delete}
   *
   * @param world - the world where the plane to delete is.
   * @param plane - the plane to delete. If undefined, the first plane
   * found under the cursor will be deleted.
   */
  delete(world: World, plane?: T) {
    if (!this.enabled) return;
    if (!plane) {
      plane = this.pickPlane(world);
    }
    if (!plane) {
      return;
    }
    this.deletePlane(plane);
  }

  /** Deletes all the existing clipping planes. */
  deleteAll() {
    while (this.planes.length > 0) {
      const plane = this.planes[0];
      this.delete(plane.world, plane);
    }
  }

  private deletePlane(plane: T) {
    const index = this.planes.indexOf(plane);
    if (index !== -1) {
      this.planes.splice(index, 1);
      if (!plane.world.renderer) {
        throw new Error("Renderer not found for this plane's world!");
      }
      plane.world.renderer.setPlane(false, plane.three);
      plane.dispose();
      this.updateMaterialsAndPlanes();
      this.onAfterDelete.trigger(plane);
    }
  }

  private pickPlane(world: World): T | undefined {
    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);
    const meshes = this.getAllPlaneMeshes();
    const intersects = caster.castRay(meshes);
    if (intersects) {
      const found = intersects.object as THREE.Mesh;
      return this.planes.find((p) => p.meshes.includes(found));
    }
    return undefined;
  }

  private getAllPlaneMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const plane of this.planes) {
      meshes.push(...plane.meshes);
    }
    return meshes;
  }

  private createPlaneFromIntersection(
    world: World,
    intersect: THREE.Intersection,
  ) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }
    const constant = intersect.point.distanceTo(new THREE.Vector3(0, 0, 0));
    const normal = intersect.face?.normal;
    if (!constant || !normal) return;

    const worldNormal = this.getWorldNormal(intersect, normal);
    const plane = this.newPlane(world, intersect.point, worldNormal.negate());
    world.renderer.setPlane(true, plane.three);
    this.updateMaterialsAndPlanes();
  }

  private getWorldNormal(intersect: THREE.Intersection, normal: THREE.Vector3) {
    const object = intersect.object;
    let transform = intersect.object.matrixWorld.clone();
    const isInstance = object instanceof THREE.InstancedMesh;
    if (isInstance && intersect.instanceId !== undefined) {
      const temp = new THREE.Matrix4();
      object.getMatrixAt(intersect.instanceId, temp);
      transform = temp.multiply(transform);
    }
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(transform);
    const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    this.normalizePlaneDirectionY(worldNormal);
    return worldNormal;
  }

  private normalizePlaneDirectionY(normal: THREE.Vector3) {
    if (this.orthogonalY) {
      if (normal.y > this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = 1;
        normal.z = 0;
      }
      if (normal.y < -this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = -1;
        normal.z = 0;
      }
    }
  }

  private newPlane(world: World, point: THREE.Vector3, normal: THREE.Vector3) {
    const plane = this.newPlaneInstance(world, point, normal);
    plane.onDraggingStarted.add(this._onStartDragging);
    plane.onDraggingEnded.add(this._onEndDragging);
    this.planes.push(plane);
    this.onAfterCreate.trigger(plane);
    return plane;
  }

  protected newPlaneInstance(
    world: World,
    point: THREE.Vector3,
    normal: THREE.Vector3,
  ) {
    return new this.PlaneType(
      this.components,
      world,
      point,
      normal,
      this._material,
    ) as T;
  }

  private updateMaterialsAndPlanes() {
    const worlds = this.components.get(Worlds);
    for (const [_id, world] of worlds.list) {
      if (!world.renderer) {
        continue;
      }
      world.renderer.updateClippingPlanes();
      const { clippingPlanes } = world.renderer;
      for (const model of world.meshes) {
        if (Array.isArray(model.material)) {
          for (const mat of model.material) {
            mat.clippingPlanes = clippingPlanes;
          }
        } else {
          model.material.clippingPlanes = clippingPlanes;
        }
      }
    }
  }

  private _onStartDragging = () => {
    this.onBeforeDrag.trigger();
  };

  private _onEndDragging = () => {
    this.onAfterDrag.trigger();
  };
}
