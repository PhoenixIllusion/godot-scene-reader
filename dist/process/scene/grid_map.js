import { Basis, Vector3 } from "../../parse/binary/variant.js";
import { Basis_scale, Vector3_set } from "./math.js";
function MakeBasis(xx, xy, xz, yx, yy, yz, zx, zy, zz) {
    const basis = new Basis();
    basis.rows[0] = { type: 'vector3', x: xx, y: xy, z: xz };
    basis.rows[1] = { type: 'vector3', x: yx, y: yy, z: yz };
    basis.rows[2] = { type: 'vector3', x: zx, y: zy, z: zz };
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
];
export function gridmap_parse_cells(vals) {
    const res = [];
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
        res.push({ x, y, z, item, rot, layer });
    }
    return res;
}
export function DefaultGridMap(gridmap) {
    gridmap.cell_center_x ?? (gridmap.cell_center_x = true);
    gridmap.cell_center_y ?? (gridmap.cell_center_y = true);
    gridmap.cell_center_z ?? (gridmap.cell_center_z = true);
    gridmap.cell_octant_size ?? (gridmap.cell_octant_size = 8);
    gridmap.cell_scale ?? (gridmap.cell_scale = 1);
    gridmap.cell_size ?? (gridmap.cell_size = { type: 'vector3', x: 2, y: 2, z: 2 });
    gridmap.collision_layer ?? (gridmap.collision_layer = 1);
    gridmap.collision_mask ?? (gridmap.collision_mask = 1);
    gridmap.collision_priority ?? (gridmap.collision_priority = 1);
    return gridmap;
}
export function gridmap_item_instances(gridmap, meshlibray_items) {
    const mesh = {};
    DefaultGridMap(gridmap);
    const cells = gridmap_parse_cells(gridmap.data.cells);
    const ofs = new Vector3();
    const s = gridmap.cell_size;
    ofs.x = s.x * (gridmap.cell_center_x ? 0.5 : 0);
    ofs.y = s.y * (gridmap.cell_center_y ? 0.5 : 0);
    ofs.z = s.z * (gridmap.cell_center_z ? 0.5 : 0);
    const scale = gridmap.cell_scale;
    cells.forEach(cell => {
        if (!mesh[cell.item]) {
            mesh[cell.item] = { item: meshlibray_items[cell.item], scale: gridmap.cell_scale, transforms: [] };
        }
        const entry = mesh[cell.item];
        const { x, y, z } = cell;
        if (entry) {
            const v3 = { type: 'vector3', x: x * s.x + ofs.x, y: y * s.y + ofs.y, z: z * s.z + ofs.z };
            const transform = { type: 'transform3d', origin: v3, basis: ORTHO_BASIS[cell.rot] };
            transform.basis = Basis_scale(transform.basis, Vector3_set(new Vector3(), scale, scale, scale));
            entry.transforms.push(transform);
        }
    });
    return Object.values(mesh);
}
export function gridmap_cell_data(instance) {
    const { mesh, mesh_transform } = instance.item;
    const collision = [];
    for (let i = 0; i < instance.item.shapes.length; i += 2) {
        const [shape, transform] = instance.item.shapes.slice(i, i + 2);
        const t = transform;
        const item = {
            shape: shape, transform: t
        };
        collision.push(item);
    }
    return { mesh, scale: instance.scale, root_transforms: instance.transforms, mesh_transform, collision };
}
