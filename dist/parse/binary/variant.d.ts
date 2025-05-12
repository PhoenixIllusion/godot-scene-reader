import { ExtResource, IntResource } from "./resource";
import { GodotReader } from "./util/reader";
export interface VariantType {
    type: string;
}
export declare class Nil implements VariantType {
    type: string;
}
export declare class Boolean implements VariantType {
    value: boolean;
    type: string;
    constructor(value: boolean);
}
export declare class Integer implements VariantType {
    value: number;
    type: string;
    constructor(value: number);
}
export declare class Integer64 implements VariantType {
    value: bigint;
    type: string;
    constructor(value: bigint);
}
export declare class Float implements VariantType {
    value: number;
    type: string;
    constructor(value: number);
}
export declare class Float64 implements VariantType {
    value: number;
    type: string;
    constructor(value: number);
}
export declare class String implements VariantType {
    value: string;
    type: string;
    constructor(value: string);
}
export declare class Vector2 implements VariantType {
    type: string;
    x: number;
    y: number;
}
export declare class Vector2i implements VariantType {
    type: string;
    x: number;
    y: number;
}
export declare class Rect2 implements VariantType {
    type: string;
    position: Vector2;
    size: Vector2;
}
export declare class Rect2i implements VariantType {
    type: string;
    position: Vector2i;
    size: Vector2i;
}
export declare class Vector3 implements VariantType {
    type: string;
    x: number;
    y: number;
    z: number;
}
export declare class Vector3i implements VariantType {
    type: string;
    x: number;
    y: number;
    z: number;
}
export declare class Vector4 implements VariantType {
    type: string;
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class Vector4i implements VariantType {
    type: string;
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class Plane implements VariantType {
    type: string;
    normal: Vector3;
    d: number;
}
export declare class Quaternion implements VariantType {
    type: string;
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class AABB implements VariantType {
    type: string;
    position: Vector3;
    size: Vector3;
}
export declare class Transform2D implements VariantType {
    type: string;
    columns: [Vector2, Vector2, Vector2];
}
export declare class Basis implements VariantType {
    type: string;
    rows: [Vector3, Vector3, Vector3];
}
export declare class Transform3D implements VariantType {
    type: string;
    basis: Basis;
    origin: Vector3;
}
export declare class Projection implements VariantType {
    type: string;
    columns: [Vector4, Vector4, Vector4, Vector4];
}
export declare class Color implements VariantType {
    type: string;
    r: number;
    g: number;
    b: number;
    a: number;
}
export declare class StringName implements VariantType {
    value: string;
    type: string;
    constructor(value: string);
}
export declare class NodePath implements VariantType {
    names: StringName[];
    subnames: StringName[];
    absolute: boolean;
    type: string;
    constructor(names: StringName[], subnames: StringName[], absolute: boolean);
}
export declare class VariantRID implements VariantType {
    value: number;
    type: string;
    constructor(value: number);
}
export declare class Callable implements VariantType {
    type: string;
}
export declare class Signal implements VariantType {
    type: string;
}
export declare class Dictionary implements VariantType {
    type: string;
    value: Map<VariantType, VariantType>;
}
export declare class Array implements VariantType {
    type: string;
    value: VariantType[];
}
export declare class PackedByteArray implements VariantType {
    type: string;
    value: Uint8Array<ArrayBuffer>;
}
export declare class PackedInt32Array implements VariantType {
    type: string;
    value: Int32Array<ArrayBuffer>;
}
export declare class PackedInt64Array implements VariantType {
    type: string;
    value: BigInt64Array<ArrayBuffer>;
}
export declare class PackedF32Array implements VariantType {
    type: string;
    value: Float32Array<ArrayBuffer>;
}
export declare class PackedF64Array implements VariantType {
    type: string;
    value: Float64Array<ArrayBuffer>;
}
export declare class PackedStringArray implements VariantType {
    type: string;
    value: String[];
}
export declare class PackedVector2Array implements VariantType {
    type: string;
    value: Vector2[];
}
export declare class PackedVector3Array implements VariantType {
    type: string;
    value: Vector3[];
}
export declare class PackedColorArray implements VariantType {
    type: string;
    value: Color[];
}
export declare class PackedVector4Array implements VariantType {
    type: string;
    value: Vector4[];
}
export interface ResourceData {
    res_path: string;
    using_named_scene_ids: boolean;
    internal_resources: IntResource[];
    internal_index_cache: Map<string, VariantType>;
    external_resources: ExtResource[];
    remaps: Map<string, string>;
    loadExternal(path: string, extType: string, cache_mode_for_external: number): VariantType;
    loadExternalRes(external_resources: ExtResource): VariantType;
    localizePath(res_path: string, path: string): string;
    is_relative_path(path: string): boolean;
}
export declare function parse_variant(res: ResourceData, f: GodotReader, use_real64: boolean, ver_format: number, _get_string: () => string): VariantType;
