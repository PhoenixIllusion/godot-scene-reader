import { InternalResourceEntry } from "../../parse/binary/resource";
import { NodePath, VariantType } from "../../parse/binary/variant";
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
interface PathResolution {
    full_path: NodePath;
    remaining_path: string[];
}
export interface SceneNode {
    parent: null | SceneNode;
    path: string[];
    is_path: null | PathResolution;
    owner: number;
    type: string;
    name: string;
    index: number;
    instance: VariantType | null;
    properties: Record<string, VariantType>;
    groups: number[];
    children: SceneNode[];
}
export declare class PackedScene {
    nodes: SceneNode[];
    paths: Record<string, SceneNode>;
    constructor(resource: InternalResourceEntry);
    findNode(nodePath: string[]): {
        node: SceneNode;
        remaining_path: string[];
    };
}
export {};
