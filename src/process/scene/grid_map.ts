import { Basis, Transform3D, Vector3 } from "../../parse/binary/variant";
import { Basis_scale, Vector3_set } from "./math";
import { MeshLibrary, MeshLibraryItem } from "./mesh_library";

export interface GridMap<MeshType,Shape3DType> {
  cell_center_x: boolean;
  cell_center_y: boolean;
  cell_center_z: boolean;
  cell_octant_size: number;
  cell_scale: number;
  collision_layer: number;
  collision_mask: number;
  collision_priority: number;
  cell_size: Vector3;
  data: { cells: Uint32Array }
  mesh_library: { 'type': 'MeshLibrary', properties: MeshLibrary<MeshType,Shape3DType> };
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

function MakeBasis(xx: number, xy: number, xz: number, yx: number, yy: number, yz: number, zx: number, zy: number, zz: number) {
  const basis = new Basis();
  basis.rows[0] = { type: 'vector3', x: xx, y: xy, z: xz }
  basis.rows[1] = { type: 'vector3', x: yx, y: yy, z: yz }
  basis.rows[2] = { type: 'vector3', x: zx, y: zy, z: zz }
  return basis;
}

export const ORTHO_BASIS = [
  MakeBasis(1, 0, 0, 0, 1, 0, 0, 0, 1),
  MakeBasis(0, -1, 0, 1, 0, 0, 0, 0, 1),
  MakeBasis(-1, 0, 0, 0, -1, 0, 0, 0, 1),
  MakeBasis(0, 1, 0, -1, 0, 0, 0, 0, 1),
  MakeBasis(1, 0, 0, 0, 0, -1, 0, 1, 0),
  MakeBasis(0, 0, 1, 1, 0, 0, 0, 1, 0),
  MakeBasis(-1, 0, 0, 0, 0, 1, 0, 1, 0),
  MakeBasis(0, 0, -1, -1, 0, 0, 0, 1, 0),
  MakeBasis(1, 0, 0, 0, -1, 0, 0, 0, -1),
  MakeBasis(0, 1, 0, 1, 0, 0, 0, 0, -1),
  MakeBasis(-1, 0, 0, 0, 1, 0, 0, 0, -1),
  MakeBasis(0, -1, 0, -1, 0, 0, 0, 0, -1),
  MakeBasis(1, 0, 0, 0, 0, 1, 0, -1, 0),
  MakeBasis(0, 0, -1, 1, 0, 0, 0, -1, 0),
  MakeBasis(-1, 0, 0, 0, 0, -1, 0, -1, 0),
  MakeBasis(0, 0, 1, -1, 0, 0, 0, -1, 0),
  MakeBasis(0, 0, 1, 0, 1, 0, -1, 0, 0),
  MakeBasis(0, -1, 0, 0, 0, 1, -1, 0, 0),
  MakeBasis(0, 0, -1, 0, -1, 0, -1, 0, 0),
  MakeBasis(0, 1, 0, 0, 0, -1, -1, 0, 0),
  MakeBasis(0, 0, 1, 0, -1, 0, 1, 0, 0),
  MakeBasis(0, 1, 0, 0, 0, 1, 1, 0, 0),
  MakeBasis(0, 0, -1, 0, 1, 0, 1, 0, 0),
  MakeBasis(0, -1, 0, 0, 0, -1, 1, 0, 0)
]
export function gridmap_parse_cells(vals: Uint32Array) {
  const res: IndexKeyCell[] = [];
  const dv = new DataView(vals.buffer);
  for (let i = 0; i < vals.length; i += 3) {
    const offset = i * 4;
    const x = dv.getInt16(offset, true);
    const y = dv.getInt16(offset + 2, true);
    const z = dv.getInt16(offset + 4, true);
    const item = dv.getUint16(offset + 8, true);
    const rot_layer = dv.getUint16(offset + 10, true);
    const rot = rot_layer & 0x1F;
    const layer = rot_layer >> 5;
    res.push({ x, y, z, item, rot, layer })
  }
  return res;
}

export interface GridMapCell<MeshType,Shape3DType> {
  item: MeshLibraryItem<MeshType,Shape3DType>;
  scale: number;
  transforms: Transform3D[]
}
export function DefaultGridMap<MeshType,Shape3DType>(gridmap: GridMap<MeshType,Shape3DType>) {
  gridmap.cell_center_x ??= true;
  gridmap.cell_center_y ??= true;
  gridmap.cell_center_z ??= true;
  gridmap.cell_octant_size ??= 8;
  gridmap.cell_scale ??= 1;
  gridmap.cell_size ??= { type: 'vector3', x: 2, y: 2, z: 2 };
  gridmap.collision_layer ??= 1;
  gridmap.collision_mask ??= 1;
  gridmap.collision_priority ??= 1;
  return gridmap;
}

export function gridmap_item_instances<MeshType,Shape3DType>(gridmap: GridMap<MeshType,Shape3DType>, meshlibray_items: MeshLibraryItem<MeshType,Shape3DType>[]): GridMapCell<MeshType,Shape3DType>[] {
  const mesh: Record<number, GridMapCell<MeshType,Shape3DType>> = {};
  DefaultGridMap(gridmap);
  const cells = gridmap_parse_cells(gridmap.data.cells);
  const ofs = new Vector3();
  const s = gridmap.cell_size;
  ofs.x = s.x * (gridmap.cell_center_x ? 0.5 : 0)
  ofs.y = s.y * (gridmap.cell_center_y ? 0.5 : 0)
  ofs.z = s.z * (gridmap.cell_center_z ? 0.5 : 0)
  const scale = gridmap.cell_scale;
  cells.forEach(cell => {
    if (!mesh[cell.item]) {
      mesh[cell.item] = { item: meshlibray_items[cell.item], scale: gridmap.cell_scale, transforms: [] };
    }
    const entry = mesh[cell.item];
    const { x, y, z } = cell;
    if (entry) {
      const v3 = { type: 'vector3', x: x * s.x + ofs.x, y: y * s.y + ofs.y, z: z * s.z + ofs.z};
      const transform: Transform3D = { type: 'transform3d', origin: v3, basis: ORTHO_BASIS[cell.rot] };
      transform.basis = Basis_scale(transform.basis, Vector3_set(new Vector3(), scale,scale,scale));
      entry.transforms.push(transform);
    }
  })

  return Object.values(mesh);
}

interface CollisionItem<Shape3DType> {
  shape: Shape3DType, transform: Transform3D
}
export interface GridMapCellData<MeshType,Shape3DType> {
  root_transforms: Transform3D[];
  mesh: MeshType,
  scale: number;
  mesh_transform: Transform3D;
  collision: CollisionItem<Shape3DType>[];
}

export function gridmap_cell_data<MeshType,Shape3DType>(instance: GridMapCell<MeshType,Shape3DType>): GridMapCellData<MeshType,Shape3DType> {
  const { mesh, mesh_transform } = instance.item;
  const collision: CollisionItem<Shape3DType>[] = [];

  for(let i=0;i< instance.item.shapes.length ;i+=2) {
    const [ shape, transform ] = instance.item.shapes.slice(i, i+2);
    const t = <Transform3D>transform;
    const item: CollisionItem<Shape3DType> = {
      shape: <Shape3DType>shape, transform: t
    }
    collision.push(item);
  }

  return { mesh, scale: instance.scale, root_transforms: instance.transforms, mesh_transform, collision };
}