import { Basis, Transform3D, Vector3 } from "../../parse/binary/variant.js";
import { MeshLibrary, MeshLibraryItem } from "./mesh_library.js";
export interface GridMap<MeshType, Shape3DType> {
    cell_center_x: boolean;
    cell_center_y: boolean;
    cell_center_z: boolean;
    cell_octant_size: number;
    cell_scale: number;
    collision_layer: number;
    collision_mask: number;
    collision_priority: number;
    cell_size: Vector3;
    data: {
        cells: Uint32Array;
    };
    mesh_library: {
        'type': 'MeshLibrary';
        properties: MeshLibrary<MeshType, Shape3DType>;
    };
}
export interface IndexKey {
    x: number;
    y: number;
    z: number;
}
export interface Cell {
    item: number;
    rot: number;
    layer: number;
}
export type IndexKeyCell = IndexKey & Cell;
export declare const ORTHO_BASIS: Basis[];
export declare function gridmap_parse_cells(vals: Uint32Array): IndexKeyCell[];
export interface GridMapCell<MeshType, Shape3DType> {
    item: MeshLibraryItem<MeshType, Shape3DType>;
    scale: number;
    transforms: Transform3D[];
}
export declare function DefaultGridMap<MeshType, Shape3DType>(gridmap: GridMap<MeshType, Shape3DType>): GridMap<MeshType, Shape3DType>;
export declare function gridmap_item_instances<MeshType, Shape3DType>(gridmap: GridMap<MeshType, Shape3DType>, meshlibray_items: MeshLibraryItem<MeshType, Shape3DType>[]): GridMapCell<MeshType, Shape3DType>[];
interface CollisionItem<Shape3DType> {
    shape: Shape3DType;
    transform: Transform3D;
}
export interface GridMapCellData<MeshType, Shape3DType> {
    root_transforms: Transform3D[];
    mesh: MeshType;
    scale: number;
    mesh_transform: Transform3D;
    collision: CollisionItem<Shape3DType>[];
}
export declare function gridmap_cell_data<MeshType, Shape3DType>(instance: GridMapCell<MeshType, Shape3DType>): GridMapCellData<MeshType, Shape3DType>;
export {};
