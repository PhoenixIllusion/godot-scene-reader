import { InternalResourceEntry } from "../../../parse/binary/resource";
import { AABB, VariantType, Vector4 } from "../../../parse/binary/variant";
import { PrimitiveType, BlendShapeMode } from "./mesh_types";
type ArrayData = ((number[] | [number, number][] | [number, number, number][] | [number, number, number, number][]) | Uint8Array[]);
export declare class Surface {
    primitive: PrimitiveType;
    vertex_count: number;
    index_count: number;
    aabb: AABB;
    uv_scale: Vector4;
    arrays: ArrayData[];
    constructor(surface: Record<string, VariantType>);
}
export declare class Mesh {
    name: string;
    blend_shape_mode: BlendShapeMode;
    surfaces: Surface[];
    constructor(resource: InternalResourceEntry);
}
export {};
