import { AABB, Vector4 } from "../../../parse/binary/variant";
import { PrimitiveType } from "./mesh_types";
import { FA } from "./mesh_get_arrays";
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
    lod: (number | Uint8Array)[];
    bone_aabbs?: AABB[];
    material?: MaterialType;
}
export declare class Surface<MaterialType> {
    primitive: PrimitiveType;
    vertex_count: number;
    index_count: number;
    aabb: AABB;
    uv_scale: Vector4;
    arrays: ArrayData[];
    material?: MaterialType;
    constructor(surface: SurfaceData<MaterialType>);
}
