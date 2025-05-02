import { InternalResourceEntry } from "../../parse/binary/resource";
import { VariantType } from "../../parse/binary/variant";
export declare const enum PackedScene_NameMask {
    NO_PARENT_SAVED = 2147483647,
    NAME_INDEX_BITS = 18,
    NAME_MASK = 262143
}
export declare const enum PackedScene_Flags {
    FLAG_ID_IS_PATH = 1073741824,
    TYPE_INSTANTIATED = 2147483647,
    FLAG_INSTANCE_IS_PLACEHOLDER = 1073741824,
    FLAG_PATH_PROPERTY_IS_NODE = 1073741824,
    FLAG_PROP_NAME_MASK = 1073741823,
    FLAG_MASK = 16777215
}
export interface SceneNode {
    parent: null | SceneNode;
    owner: number;
    type: string;
    name: string;
    index: number;
    instance: VariantType | null;
    properties: Record<string, VariantType>;
    groups: number[];
}
export declare class PackedScene {
    nodes: SceneNode[];
    constructor(resource: InternalResourceEntry);
}
