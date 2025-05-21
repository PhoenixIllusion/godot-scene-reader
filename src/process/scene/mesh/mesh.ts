import { AABB, Vector4 } from "../../../parse/binary/variant";
import { PrimitiveType, ARRAY_FLAG_MASK } from "./mesh_types";
import { _get_array_from_surface, FA } from "./mesh_get_arrays";

export type ArrayData = (FA | Uint8Array[]);

export interface SurfaceData<MaterialType> {
  primitive: PrimitiveType;

  format: bigint;
  vertex_data: Uint8Array;
  skin_data?: Uint8Array;
  vertex_count: number;
  index_count?: number;

  aabb: AABB;
  uv_scale: Vector4;

  attribute_data?: Uint8Array;
  index_data?: Uint8Array;

  lod: (number|Uint8Array)[];

  bone_aabbs?: AABB[];

  material?: MaterialType;
}

export class Surface<MaterialType> {
  primitive: PrimitiveType;

  vertex_count: number;
  index_count: number;

  aabb: AABB;
  uv_scale: Vector4;
  arrays: ArrayData[];

  material?: MaterialType;

  constructor(surface: SurfaceData<MaterialType>) {
    this.primitive = surface.primitive;

    this.aabb = surface.aabb;
    this.uv_scale = surface.uv_scale ?? new Vector4();

    this.vertex_count = surface.vertex_count;
    this.index_count = surface.index_count ?? 0;

    this.primitive = surface.primitive;

    this.material = surface.material;

    const format = Number(BigInt(surface.format) & ARRAY_FLAG_MASK);
    const { vertex_data, attribute_data, skin_data, index_data } = surface;
    this.arrays = _get_array_from_surface(format, vertex_data.buffer, attribute_data?.buffer || null, skin_data?.buffer || null,
      this.vertex_count, index_data?.buffer || null, this.index_count, this.aabb, this.uv_scale);
  }
}

