import { VariantType } from "./variant";
export interface ExtResource {
    type: string;
    path: string;
    uid?: BigInt;
}
export interface IntResource {
    path: string;
    offset: number;
}
export interface InternalResourceEntry {
    type: string;
    properties: Record<string, VariantType>;
}
export declare function try_open_bin_resource(res_path: string, arrayBuffer: ArrayBuffer, p_no_resource: boolean, p_keep_uuid_paths: boolean): Promise<{
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
    type: string;
    uid: bigint;
    script_class: string;
    string_map: Record<number, string>;
    internal_entries: InternalResourceEntry[];
} | undefined>;
export type BinResource = Awaited<ReturnType<typeof try_open_bin_resource>>;
