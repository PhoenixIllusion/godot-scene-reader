import { InternalResourceEntry } from "../../../parse/binary/resource";
import { assertType, unwrap_dictionary, unwrap_props, unwrap_string } from "../../../parse/binary/util/assert_unpack";
import { AABB, Array, Dictionary, Integer, Integer64, PackedByteArray, VariantType, Vector4 } from "../../../parse/binary/variant";
import { PrimitiveType, ARRAY_FLAG_MASK, BlendShapeMode } from "./mesh_types";
import { _get_array_from_surface } from "./mesh_get_arrays";

type ArrayData = ((number[] | [number, number][] | [number, number, number][] | [number, number, number, number][]) | Uint8Array[]);

class Surface {
  primitive: PrimitiveType;

  vertex_count: number;
  index_count: number;

  aabb: AABB;
  uv_scale: Vector4;
  arrays: ArrayData[];

  constructor(surface: Record<string, VariantType>) {
    const format = Number(assertType<Integer64>(surface["format"], "int64").value & ARRAY_FLAG_MASK);
    
    this.primitive = assertType<Integer>(surface["primitive"], "int32").value;

    this.vertex_count = assertType<Integer>(surface["vertex_count"], "int32").value;
    this.index_count = surface["index_count"] ? assertType<Integer>(surface["index_count"], "int32").value : 0;

    this.aabb = surface["aabb"] ? assertType<AABB>(surface["aabb"], "aabb"): new AABB();
    this.uv_scale = surface["uv_scale"] ? assertType<Vector4>(surface["uv_scale"], "vector4") : new Vector4();
    
    const vertex_data = assertType<PackedByteArray>(surface["vertex_data"], "packed_byte_array").value;
    const attribute_data = surface["attribute_data"] ? assertType<PackedByteArray>(surface["attribute_data"], "packed_byte_array").value : null;
    const index_data = surface["index_data"] ? assertType<PackedByteArray>(surface["index_data"], "packed_byte_array").value : null;
    const skin_data = surface["skin_data"] ? assertType<PackedByteArray>(surface["skin_data"], "packed_byte_array").value : null;

    this.arrays = _get_array_from_surface(format, vertex_data, attribute_data, skin_data, this.vertex_count, index_data, this.index_count, this.aabb, this.uv_scale );
  }

}

export class Mesh {

  name: string = '';
  blend_shape_mode: BlendShapeMode;
  surfaces: Surface[] = [];
  constructor(resource: InternalResourceEntry) {
    const res = unwrap_props(resource);
    this.name = res['resource_name'] ? unwrap_string(res['resource_name']) : "<no_name>";
    this.blend_shape_mode = assertType<Integer>(res['blend_shape_mode'], "int32").value;

    const _surfaces: Record<string, VariantType>[] = assertType<Array>(res["_surfaces"],"array").value.map(o => {
      const dict = assertType<Dictionary>(o, "dictionary");
      return unwrap_dictionary(dict)
    });
    _surfaces.forEach(surface => {
      this.surfaces.push(new Surface(surface));
    })
  }

}