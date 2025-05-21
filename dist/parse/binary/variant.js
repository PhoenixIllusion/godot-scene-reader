import { decoder, ERR_FAIL_COND_V_MSG, ERR_FAIL_V, WARN_PRINT } from "../../util/data-reader";
import { BIN } from "./variant_binary";
const cache_mode_for_external = 1;
export class Nil {
    constructor() {
        this.type = "nil";
    }
}
export class Boolean {
    constructor(value) {
        this.value = value;
        this.type = "bool";
    }
}
export class Integer {
    constructor(value) {
        this.value = value;
        this.type = "int32";
    }
}
export class Integer64 {
    constructor(value) {
        this.value = value;
        this.type = "int64";
    }
}
export class Float {
    constructor(value) {
        this.value = value;
        this.type = "float";
    }
}
export class Float64 {
    constructor(value) {
        this.value = value;
        this.type = "float64";
    }
}
export class String {
    constructor(value) {
        this.value = value;
        this.type = "string";
    }
}
export class Vector2 {
    constructor() {
        this.type = "vector2";
        this.x = 0;
        this.y = 0;
    }
}
export class Vector2i {
    constructor() {
        this.type = "vector2i";
        this.x = 0;
        this.y = 0;
    }
}
export class Rect2 {
    constructor() {
        this.type = "rect2";
        this.position = new Vector2();
        this.size = new Vector2();
    }
}
export class Rect2i {
    constructor() {
        this.type = "rect2i";
        this.position = new Vector2i();
        this.size = new Vector2i();
    }
}
export class Vector3 {
    constructor() {
        this.type = "vector3";
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
export class Vector3i {
    constructor() {
        this.type = "vector3i";
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
export class Vector4 {
    constructor() {
        this.type = "vector4";
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
}
export class Vector4i {
    constructor() {
        this.type = "vector4i";
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
}
export class Plane {
    constructor() {
        this.type = "plane";
        this.normal = new Vector3();
        this.d = 0;
    }
}
export class Quaternion {
    constructor() {
        this.type = "quaternion";
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
}
export class AABB {
    constructor() {
        this.type = "aabb";
        this.position = new Vector3();
        this.size = new Vector3();
    }
}
export class Transform2D {
    constructor() {
        this.type = "transform2d";
        this.columns = [new Vector2(), new Vector2(), new Vector2()];
    }
}
export class Basis {
    constructor() {
        this.type = "basis";
        this.rows = [new Vector3(), new Vector3(), new Vector3()];
    }
}
export class Transform3D {
    constructor() {
        this.type = "transform3d";
        this.basis = new Basis();
        this.origin = new Vector3();
    }
}
export class Projection {
    constructor() {
        this.type = "projection";
        this.columns = [new Vector4(), new Vector4(), new Vector4(), new Vector4()];
    }
}
export class Color {
    constructor() {
        this.type = "color";
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
    }
}
export class StringName {
    constructor(value) {
        this.value = value;
        this.type = "stringname";
    }
}
export class NodePath {
    constructor(names, subnames, absolute) {
        this.names = names;
        this.subnames = subnames;
        this.absolute = absolute;
        this.type = "nodepath";
    }
}
export class VariantRID {
    constructor(value) {
        this.value = value;
        this.type = "variantrid";
    }
}
export class Callable {
    constructor() {
        this.type = "callable";
    }
}
export class Signal {
    constructor() {
        this.type = "signal";
    }
}
export class Dictionary {
    constructor() {
        this.type = "dictionary";
        this.value = new Map();
    }
}
export class Array {
    constructor() {
        this.type = "array";
        this.value = [];
    }
}
export class PackedByteArray {
    constructor() {
        this.type = "packed_byte_array";
        this.value = new Uint8Array();
    }
}
export class PackedInt32Array {
    constructor() {
        this.type = "packed_int32_array";
        this.value = new Int32Array();
    }
}
export class PackedInt64Array {
    constructor() {
        this.type = "packed_int64_array";
        this.value = new BigInt64Array();
    }
}
export class PackedF32Array {
    constructor() {
        this.type = "packed_float32_array";
        this.value = new Float32Array();
    }
}
export class PackedF64Array {
    constructor() {
        this.type = "packed_float64_array";
        this.value = new Float64Array();
    }
}
export class PackedStringArray {
    constructor() {
        this.type = "packed_string_array";
        this.value = [];
    }
}
export class PackedVector2Array {
    constructor() {
        this.type = "packed_vector2_array";
        this.value = [];
    }
}
export class PackedVector3Array {
    constructor() {
        this.type = "packed_vector3_array";
        this.value = [];
    }
}
export class PackedColorArray {
    constructor() {
        this.type = "packed_color_array";
        this.value = [];
    }
}
export class PackedVector4Array {
    constructor() {
        this.type = "packed_vector4_array";
        this.value = [];
    }
}
const Variant = () => new Nil();
const bool_t = (v) => new Boolean(!!v);
const int_t = (v) => new Integer(v);
const int64_t = (v) => new Integer64(v);
const float_t = (v) => new Float(v);
const float64_t = (v) => new Float64(v);
const string_t = (v) => new String(v);
export function parse_variant(res, f, use_real64, ver_format, _get_string) {
    f.use_real64 = use_real64;
    function get_ustring() {
        const len = f.get_32();
        const chunk = f.get_buffer(len - 1);
        f.skip(1);
        return decoder.decode(chunk);
    }
    const get_unicode_string = get_ustring;
    function _advance_padding(p_len) {
        const extra = 4 - (p_len % 4);
        if (extra < 4) {
            for (let i = 0; i < extra; i++) {
                f.get_8(); //pad to 32
            }
        }
    }
    const prop_type = f.get_32();
    let r_v = new Nil();
    switch (prop_type) {
        case BIN.VARIANT_NIL:
            {
                r_v = Variant();
            }
            break;
        case BIN.VARIANT_BOOL:
            {
                r_v = bool_t(f.get_32());
            }
            break;
        case BIN.VARIANT_INT:
            {
                r_v = int_t(f.get_32());
            }
            break;
        case BIN.VARIANT_INT64:
            {
                r_v = int64_t(f.get_64bi());
            }
            break;
        case BIN.VARIANT_FLOAT:
            {
                r_v = float_t(f.get_real());
            }
            break;
        case BIN.VARIANT_DOUBLE:
            {
                r_v = float64_t(f.get_double());
            }
            break;
        case BIN.VARIANT_STRING:
            {
                r_v = string_t(get_unicode_string());
            }
            break;
        case BIN.VARIANT_VECTOR2:
            {
                const v = new Vector2();
                v.x = f.get_real();
                v.y = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_VECTOR2I:
            {
                const v = new Vector2i();
                v.x = f.get_32();
                v.y = f.get_32();
                r_v = v;
            }
            break;
        case BIN.VARIANT_RECT2:
            {
                const v = new Rect2();
                v.position.x = f.get_real();
                v.position.y = f.get_real();
                v.size.x = f.get_real();
                v.size.y = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_RECT2I:
            {
                const v = new Rect2i();
                v.position.x = f.get_32();
                v.position.y = f.get_32();
                v.size.x = f.get_32();
                v.size.y = f.get_32();
                r_v = v;
            }
            break;
        case BIN.VARIANT_VECTOR3:
            {
                const v = new Vector3();
                v.x = f.get_real();
                v.y = f.get_real();
                v.z = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_VECTOR3I:
            {
                const v = new Vector3i();
                v.x = f.get_32();
                v.y = f.get_32();
                v.z = f.get_32();
                r_v = v;
            }
            break;
        case BIN.VARIANT_VECTOR4:
            {
                const v = new Vector4();
                v.x = f.get_real();
                v.y = f.get_real();
                v.z = f.get_real();
                v.w = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_VECTOR4I:
            {
                const v = new Vector4i();
                v.x = f.get_32();
                v.y = f.get_32();
                v.z = f.get_32();
                v.w = f.get_32();
                r_v = v;
            }
            break;
        case BIN.VARIANT_PLANE:
            {
                const v = new Plane();
                v.normal.x = f.get_real();
                v.normal.y = f.get_real();
                v.normal.z = f.get_real();
                v.d = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_QUATERNION:
            {
                const v = new Quaternion();
                v.x = f.get_real();
                v.y = f.get_real();
                v.z = f.get_real();
                v.w = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_AABB:
            {
                const v = new AABB();
                v.position.x = f.get_real();
                v.position.y = f.get_real();
                v.position.z = f.get_real();
                v.size.x = f.get_real();
                v.size.y = f.get_real();
                v.size.z = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_TRANSFORM2D:
            {
                const v = new Transform2D();
                v.columns[0].x = f.get_real();
                v.columns[0].y = f.get_real();
                v.columns[1].x = f.get_real();
                v.columns[1].y = f.get_real();
                v.columns[2].x = f.get_real();
                v.columns[2].y = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_BASIS:
            {
                const v = new Basis();
                v.rows[0].x = f.get_real();
                v.rows[0].y = f.get_real();
                v.rows[0].z = f.get_real();
                v.rows[1].x = f.get_real();
                v.rows[1].y = f.get_real();
                v.rows[1].z = f.get_real();
                v.rows[2].x = f.get_real();
                v.rows[2].y = f.get_real();
                v.rows[2].z = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_TRANSFORM3D:
            {
                const v = new Transform3D();
                v.basis.rows[0].x = f.get_real();
                v.basis.rows[0].y = f.get_real();
                v.basis.rows[0].z = f.get_real();
                v.basis.rows[1].x = f.get_real();
                v.basis.rows[1].y = f.get_real();
                v.basis.rows[1].z = f.get_real();
                v.basis.rows[2].x = f.get_real();
                v.basis.rows[2].y = f.get_real();
                v.basis.rows[2].z = f.get_real();
                v.origin.x = f.get_real();
                v.origin.y = f.get_real();
                v.origin.z = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_PROJECTION:
            {
                const v = new Projection();
                v.columns[0].x = f.get_real();
                v.columns[0].y = f.get_real();
                v.columns[0].z = f.get_real();
                v.columns[0].w = f.get_real();
                v.columns[1].x = f.get_real();
                v.columns[1].y = f.get_real();
                v.columns[1].z = f.get_real();
                v.columns[1].w = f.get_real();
                v.columns[2].x = f.get_real();
                v.columns[2].y = f.get_real();
                v.columns[2].z = f.get_real();
                v.columns[2].w = f.get_real();
                v.columns[3].x = f.get_real();
                v.columns[3].y = f.get_real();
                v.columns[3].z = f.get_real();
                v.columns[3].w = f.get_real();
                r_v = v;
            }
            break;
        case BIN.VARIANT_COLOR:
            {
                const v = new Color(); // Colors should always be in single-precision.
                v.r = f.get_float();
                v.g = f.get_float();
                v.b = f.get_float();
                v.a = f.get_float();
                r_v = v;
            }
            break;
        case BIN.VARIANT_STRING_NAME:
            {
                r_v = new StringName(get_unicode_string());
            }
            break;
        case BIN.VARIANT_NODE_PATH:
            {
                const names = [];
                const subnames = [];
                const name_count = f.get_16();
                let subname_count = f.get_16();
                const absolute = subname_count & 0x8000;
                subname_count &= 0x7FFF;
                if (ver_format < BIN.FORMAT_VERSION_NO_NODEPATH_PROPERTY) {
                    subname_count += 1; // has a property field, so we should count it as well
                }
                for (let i = 0; i < name_count; i++) {
                    names.push(new StringName(_get_string()));
                }
                for (let i = 0; i < subname_count; i++) {
                    subnames.push(new StringName(_get_string()));
                }
                const np = new NodePath(names, subnames, !!absolute);
                r_v = np;
            }
            break;
        case BIN.VARIANT_RID:
            {
                r_v = new VariantRID(f.get_32());
            }
            break;
        case BIN.VARIANT_OBJECT:
            {
                const objtype = f.get_32();
                switch (objtype) {
                    case BIN.OBJECT_EMPTY:
                        {
                            //do none
                        }
                        break;
                    case BIN.OBJECT_INTERNAL_RESOURCE:
                        {
                            const index = f.get_32();
                            let path = '';
                            if (res.using_named_scene_ids) { // New format.
                                ERR_FAIL_COND_V_MSG(index == res.internal_resources.length, false, 'ERR_PARSE_ERROR');
                                path = res.internal_resources[index].path;
                            }
                            else {
                                path += res.res_path + "::" + index;
                            }
                            //always use internal cache for loading internal resources
                            if (!res.internal_index_cache[path]) {
                                WARN_PRINT(`Couldn't load resource (no cache): ${res.res_path}.`);
                                r_v = new Nil();
                            }
                            else {
                                r_v = res.internal_index_cache[path];
                            }
                        }
                        break;
                    case BIN.OBJECT_EXTERNAL_RESOURCE:
                        {
                            //old file format, still around for compatibility
                            const exttype = get_unicode_string();
                            let path = get_unicode_string();
                            if (!path.includes("://") && res.is_relative_path(path)) {
                                // path is relative to file being loaded, so convert to a resource path
                                path = res.localizePath(res.res_path, path);
                            }
                            if (res.remaps[path]) {
                                path = res.remaps[path];
                            }
                            const result = res.loadExternal(path, exttype, cache_mode_for_external);
                            if (result.type === "nil") {
                                WARN_PRINT(`Couldn't load resource: ${path}.`);
                            }
                            r_v = result;
                        }
                        break;
                    case BIN.OBJECT_EXTERNAL_RESOURCE_INDEX:
                        {
                            //new file format, just refers to an index in the external list
                            const erindex = f.get_32();
                            if (erindex < 0 || erindex >= res.external_resources.length) {
                                WARN_PRINT("Broken external resource! (index out of size)");
                                r_v = new Nil();
                            }
                            else {
                                r_v = res.loadExternalRes(res.external_resources[erindex]);
                            }
                        }
                        break;
                    default:
                        {
                            ERR_FAIL_V('ERR_FILE_CORRUPT');
                        }
                        break;
                }
            }
            break;
        case BIN.VARIANT_CALLABLE:
            {
                r_v = new Callable();
            }
            break;
        case BIN.VARIANT_SIGNAL:
            {
                r_v = new Signal();
            }
            break;
        case BIN.VARIANT_DICTIONARY:
            {
                let len = f.get_32();
                const d = new Dictionary(); //last bit means shared
                len &= 0x7FFFFFFF;
                for (let i = 0; i < len; i++) {
                    const key = parse_variant(res, f, use_real64, ver_format, _get_string);
                    const value = parse_variant(res, f, use_real64, ver_format, _get_string);
                    d.value.set(key, value);
                }
                r_v = d;
            }
            break;
        case BIN.VARIANT_ARRAY:
            {
                let len = f.get_32();
                const a = new Array(); //last bit means shared
                len &= 0x7FFFFFFF;
                a.value.length = len;
                for (let i = 0; i < len; i++) {
                    const val = parse_variant(res, f, use_real64, ver_format, _get_string);
                    a.value[i] = val;
                }
                r_v = a;
            }
            break;
        case BIN.VARIANT_PACKED_BYTE_ARRAY:
            {
                const len = f.get_32();
                const array = new PackedByteArray();
                array.value = new Uint8Array(len);
                array.value.set(f.get_buffer(len), 0);
                _advance_padding(len);
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_INT32_ARRAY:
            {
                let len = f.get_32();
                const array = new PackedInt32Array();
                array.value = new Int32Array(len);
                for (let i = 0; i < len; i++) {
                    array.value[i] = f.get_32();
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_INT64_ARRAY:
            {
                let len = f.get_32();
                const array = new PackedInt64Array();
                array.value = new BigInt64Array(len);
                for (let i = 0; i < len; i++) {
                    array.value[i] = f.get_64bi();
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_FLOAT32_ARRAY:
            {
                let len = f.get_32();
                const array = new PackedF32Array();
                array.value = new Float32Array(len);
                for (let i = 0; i < len; i++) {
                    array.value[i] = f.get_float();
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_FLOAT64_ARRAY:
            {
                let len = f.get_32();
                const array = new PackedF64Array();
                array.value = new Float64Array(len);
                for (let i = 0; i < len; i++) {
                    array.value[i] = f.get_double();
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_STRING_ARRAY:
            {
                const len = f.get_32();
                const array = new PackedStringArray();
                array.value.length = len;
                for (let i = 0; i < len; i++) {
                    array.value[i] = new String(get_unicode_string());
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_VECTOR2_ARRAY:
            {
                const len = f.get_32();
                const array = new PackedVector2Array();
                array.value.length = len;
                for (let i = 0; i < len; i++) {
                    const v = new Vector2();
                    v.x = f.get_real();
                    v.y = f.get_real();
                    array.value[i] = v;
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_VECTOR3_ARRAY:
            {
                const len = f.get_32();
                const array = new PackedVector3Array();
                array.value.length = len;
                for (let i = 0; i < len; i++) {
                    const v = new Vector3();
                    v.x = f.get_real();
                    v.y = f.get_real();
                    v.z = f.get_real();
                    array.value[i] = v;
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_COLOR_ARRAY:
            {
                const len = f.get_32();
                const array = new PackedColorArray();
                array.value.length = len;
                for (let i = 0; i < len; i++) {
                    const v = new Color();
                    v.r = f.get_float();
                    v.g = f.get_float();
                    v.b = f.get_float();
                    v.a = f.get_float();
                    array.value[i] = v;
                }
                r_v = array;
            }
            break;
        case BIN.VARIANT_PACKED_VECTOR4_ARRAY:
            {
                const len = f.get_32();
                const array = new PackedVector4Array();
                array.value.length = len;
                for (let i = 0; i < len; i++) {
                    const v = new Vector4();
                    v.x = f.get_real();
                    v.y = f.get_real();
                    v.z = f.get_real();
                    v.w = f.get_real();
                    array.value[i] = v;
                }
                r_v = array;
            }
            break;
        default:
            {
                ERR_FAIL_V('ERR_FILE_CORRUPT');
            }
            break;
    }
    return r_v;
}
