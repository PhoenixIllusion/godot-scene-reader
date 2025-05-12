import { assertType, unwrap_dictionary, unwrap_string } from "../../../parse/binary/util/assert_unpack";
import { AABB, Vector4 } from "../../../parse/binary/variant";
import { ARRAY_FLAG_MASK } from "./mesh_types";
import { _get_array_from_surface } from "./mesh_get_arrays";
export class Surface {
    constructor(surface) {
        const format = Number(assertType(surface["format"], "int64").value & ARRAY_FLAG_MASK);
        this.primitive = assertType(surface["primitive"], "int32").value;
        this.vertex_count = assertType(surface["vertex_count"], "int32").value;
        this.index_count = surface["index_count"] ? assertType(surface["index_count"], "int32").value : 0;
        this.aabb = surface["aabb"] ? assertType(surface["aabb"], "aabb") : new AABB();
        this.uv_scale = surface["uv_scale"] ? assertType(surface["uv_scale"], "vector4") : new Vector4();
        const vertex_data = assertType(surface["vertex_data"], "packed_byte_array").value.buffer;
        const attribute_data = surface["attribute_data"] ? assertType(surface["attribute_data"], "packed_byte_array").value?.buffer : null;
        const index_data = surface["index_data"] ? assertType(surface["index_data"], "packed_byte_array").value?.buffer : null;
        const skin_data = surface["skin_data"] ? assertType(surface["skin_data"], "packed_byte_array").value?.buffer : null;
        this.material = surface['material'];
        this.arrays = _get_array_from_surface(format, vertex_data, attribute_data, skin_data, this.vertex_count, index_data, this.index_count, this.aabb, this.uv_scale);
    }
}
export class Mesh {
    constructor(resource) {
        this.name = '';
        this.surfaces = [];
        const res = resource.properties;
        this.name = res['resource_name'] ? unwrap_string(res['resource_name']) : "<no_name>";
        this.blend_shape_mode = assertType(res['blend_shape_mode'], "int32").value;
        const _surfaces = assertType(res["_surfaces"], "array").value.map(o => {
            const dict = assertType(o, "dictionary");
            return unwrap_dictionary(dict);
        });
        _surfaces.forEach(surface => {
            this.surfaces.push(new Surface(surface));
        });
    }
}
