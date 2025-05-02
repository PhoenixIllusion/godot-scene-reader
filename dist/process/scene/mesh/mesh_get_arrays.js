import { ERR_FAIL_V } from "../../../util/data-reader";
import { mesh_surface_make_offsets_from_format } from "./mesh_offset_util";
import { ArrayCustomFormat, ArrayFormat, ArrayType } from "./mesh_types";
const CMP_EPSILON = 0.00001;
function is_zero_approx(v) {
    if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) {
            if (Math.abs(v[i]) > CMP_EPSILON) {
                return false;
            }
        }
        return true;
    }
    else {
        return Math.abs(v) < CMP_EPSILON;
    }
}
function set_axis_angle(axis, p_angle) {
    const p_axis = { x: axis[0], y: axis[1], z: axis[2] };
    const rows = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const axis_sq = { x: p_axis.x * p_axis.x, y: p_axis.y * p_axis.y, z: p_axis.z * p_axis.z };
    const cosine = Math.cos(p_angle);
    rows[0][0] = axis_sq.x + cosine * (1.0 - axis_sq.x);
    rows[1][1] = axis_sq.y + cosine * (1.0 - axis_sq.y);
    rows[2][2] = axis_sq.z + cosine * (1.0 - axis_sq.z);
    const sine = Math.sin(p_angle);
    const t = 1 - cosine;
    let xyzt = p_axis.x * p_axis.y * t;
    let zyxs = p_axis.z * sine;
    rows[0][1] = xyzt - zyxs;
    rows[1][0] = xyzt + zyxs;
    xyzt = p_axis.x * p_axis.z * t;
    zyxs = p_axis.y * sine;
    rows[0][2] = xyzt + zyxs;
    rows[2][0] = xyzt - zyxs;
    xyzt = p_axis.y * p_axis.z * t;
    zyxs = p_axis.x * sine;
    rows[1][2] = xyzt - zyxs;
    rows[2][1] = xyzt + zyxs;
    return { rows };
}
function _get_tbn_from_axis_angle(p_axis, p_angle) {
    const binormal_sign = p_angle > 0.5 ? 1.0 : -1.0;
    const angle = Math.abs(p_angle * 2.0 - 1.0) * Math.PI;
    const tbn = set_axis_angle(p_axis, angle);
    const tan = tbn.rows[0];
    const tangent = [tan[0], tan[1], tan[2], binormal_sign];
    const normal = tbn.rows[2];
    return { tangent, normal };
}
function length_squared(v) {
    const x2 = v[0] * v[0];
    const y2 = v[1] * v[1];
    const z2 = v[2] * v[2];
    return x2 + y2 + z2;
}
function normalized(v) {
    const lengthsq = length_squared(v);
    if (lengthsq == 0) {
        return [0, 0, 0];
    }
    const length = Math.sqrt(lengthsq);
    return [v[0] / length, v[1] / length, v[2] / length];
}
function CLAMP(v, min, max) {
    return v > max ? max : v < min ? min : v;
}
function octahedron_decode_(p_oct) {
    const f = [p_oct[0] * 2.0 - 1.0, p_oct[1] * 2.0 - 1.0];
    const n = [f[0], f[1], 1.0 - Math.abs(f[0]) - Math.abs(f[1])];
    const t = CLAMP(-n[2], 0.0, 1.0);
    n[0] += n[0] >= 0 ? -t : t;
    n[1] += n[1] >= 0 ? -t : t;
    return normalized(n);
}
function octahedron_decode(x, y) {
    return octahedron_decode_([x, y]);
}
function octahedron_tangent_decode(p_oct) {
    const oct_compressed = p_oct;
    oct_compressed[1] = oct_compressed[1] * 2 - 1;
    const r_sign = oct_compressed[1] >= 0.0 ? 1.0 : -1.0;
    oct_compressed[1] = Math.abs(oct_compressed[1]);
    const res = octahedron_decode_(oct_compressed);
    return { res, tangent_sign: r_sign };
}
function reinterpret_cast(_class, buffer, offset, len) {
    return new _class(buffer, offset, len);
}
function _v3_madd(vec, size, pos) {
    const x = vec[0] * size.x + pos.x;
    const y = vec[1] * size.y + pos.y;
    const z = vec[2] * size.z + pos.z;
    return [x, y, z];
}
function _v2_sub_mult(vec, sub, mult) {
    const x = (vec[0] - sub[0]) * mult[0];
    const y = (vec[1] - sub[1]) * mult[1];
    return [x, y];
}
export function _get_array_from_surface(p_format, p_vertex_data, p_attrib_data, p_skin_data, p_vertex_len, p_index_data, p_index_len, p_aabb, p_uv_scale) {
    const offsets = [];
    const elem_size = mesh_surface_make_offsets_from_format(p_format, p_vertex_len, p_index_len, offsets);
    const { vertex_element_size } = elem_size;
    const ret = [];
    const uv_scale = [0, 0, 0, 0];
    {
        const { x, y, z, w } = p_uv_scale;
        [uv_scale[0], uv_scale[1], uv_scale[2], uv_scale[3]] = [x, y, z, w];
    }
    const r = p_vertex_data;
    const ar = p_attrib_data;
    const sr = p_skin_data;
    for (let i = 0; i < ArrayType.ARRAY_MAX; i++) {
        if (!(p_format & (1 << i))) {
            continue;
        }
        switch (i) {
            case ArrayType.ARRAY_VERTEX:
                {
                    if (p_format & ArrayFormat.ARRAY_FLAG_USE_2D_VERTICES) {
                        const arr_2d = [];
                        {
                            const w = arr_2d;
                            for (let j = 0; j < p_vertex_len; j++) {
                                const v = reinterpret_cast(Float32Array, r, j * vertex_element_size + offsets[i], 2);
                                w[j] = [v[0], v[1]];
                            }
                        }
                        ret[i] = arr_2d;
                    }
                    else {
                        const arr_3d = [];
                        {
                            const w = arr_3d;
                            if (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) {
                                // We only have vertices to read, so just read them and skip everything else.
                                if (!(p_format & ArrayFormat.ARRAY_FORMAT_NORMAL)) {
                                    for (let j = 0; j < p_vertex_len; j++) {
                                        const v = reinterpret_cast(Uint16Array, r, j * vertex_element_size + offsets[i], 3);
                                        const vec = [(v[0]) / 65535.0, (v[1]) / 65535.0, (v[2]) / 65535.0];
                                        w[j] = _v3_madd(vec, p_aabb.size, p_aabb.position);
                                    }
                                    ret[i] = arr_3d;
                                    continue;
                                }
                                const normals = [];
                                const normalsw = normals;
                                const tangents = [];
                                const tangentsw = tangents;
                                const _n_array = reinterpret_cast(Uint32Array, r, offsets[ArrayType.ARRAY_NORMAL], p_vertex_len);
                                for (let j = 0; j < p_vertex_len; j++) {
                                    const n = _n_array[j];
                                    const axis = octahedron_decode((n & 0xFFFF) / 65535.0, ((n >> 16) & 0xFFFF) / 65535.0);
                                    const v = reinterpret_cast(Uint16Array, r, j * vertex_element_size + offsets[i], 4);
                                    const vec = [(v[0]) / 65535.0, (v[1]) / 65535.0, (v[2]) / 65535.0];
                                    const angle = (v[3]) / 65535.0;
                                    w[j] = _v3_madd(vec, p_aabb.size, p_aabb.position);
                                    const { normal, tangent } = _get_tbn_from_axis_angle(axis, angle);
                                    normalsw[j] = normal;
                                    tangentsw[j] = tangent;
                                }
                                ret[ArrayType.ARRAY_NORMAL] = normals;
                                ret[ArrayType.ARRAY_TANGENT] = tangentsw;
                            }
                            else {
                                for (let j = 0; j < p_vertex_len; j++) {
                                    const v = reinterpret_cast(Float32Array, r, j * vertex_element_size + offsets[i], 3);
                                    w[j] = [v[0], v[1], v[2]];
                                }
                            }
                        }
                        ret[i] = arr_3d;
                    }
                }
                break;
            case ArrayType.ARRAY_NORMAL:
                {
                    if (!(p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES)) {
                        const arr = [];
                        const w = arr;
                        const _v_arr = reinterpret_cast(Uint32Array, r, offsets[i], p_vertex_len);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr[j];
                            w[j] = octahedron_decode((v & 0xFFFF) / 65535.0, ((v >> 16) & 0xFFFF) / 65535.0);
                        }
                        ret[i] = arr;
                    }
                }
                break;
            case ArrayType.ARRAY_TANGENT:
                {
                    if (!(p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES)) {
                        const arr = [];
                        const w = arr;
                        const _v_arr = reinterpret_cast(Uint32Array, r, offsets[i], p_vertex_len);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr[j];
                            const { res, tangent_sign } = octahedron_tangent_decode([(v & 0xFFFF) / 65535.0, ((v >> 16) & 0xFFFF) / 65535.0]);
                            w[j] = [...res, tangent_sign];
                        }
                        ret[i] = arr;
                    }
                }
                break;
            case ArrayType.ARRAY_COLOR:
                {
                    const arr = [];
                    const w = arr;
                    if (!ar) {
                        throw new Error("No Attrute Array");
                    }
                    const _v_arr = reinterpret_cast(Uint8Array, ar, offsets[i], p_vertex_len * 4);
                    for (let j = 0; j < p_vertex_len; j++) {
                        const v = _v_arr.subarray(j * 4, j * 4 + 4);
                        w[j] = [v[0] / 255.0, v[1] / 255.0, v[2] / 255.0, v[3] / 255.0];
                    }
                    ret[i] = arr;
                }
                break;
            case ArrayType.ARRAY_TEX_UV:
                {
                    const arr = [];
                    if (!ar) {
                        throw new Error("No Attrute Array");
                    }
                    const w = arr;
                    if (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) {
                        const _v_arr = reinterpret_cast(Uint16Array, ar, offsets[i], p_vertex_len * 2);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr.subarray(j * 2, j * 2 + 2);
                            let vec = [(v[0]) / 65535.0, (v[1]) / 65535.0];
                            if (!is_zero_approx(uv_scale)) {
                                vec = _v2_sub_mult(vec, [0.5, 0.5], [p_uv_scale.x, p_uv_scale.y]);
                            }
                            w[j] = vec;
                        }
                    }
                    else {
                        const _v_arr = reinterpret_cast(Float32Array, ar, offsets[i], p_vertex_len * 2);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr.subarray(j * 2, j * 2 + 2);
                            w[j] = [v[0], v[1]];
                        }
                    }
                    ret[i] = arr;
                }
                break;
            case ArrayType.ARRAY_TEX_UV2:
                {
                    const arr = [];
                    const w = arr;
                    if (!ar) {
                        throw new Error("No Attrute Array");
                    }
                    if (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) {
                        const _v_arr = reinterpret_cast(Uint16Array, ar, offsets[i], p_vertex_len * 2);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr.subarray(j * 2, j * 2 + 2);
                            let vec = [(v[0]) / 65535.0, (v[1]) / 65535.0];
                            if (!is_zero_approx(uv_scale)) {
                                vec = _v2_sub_mult(vec, [0.5, 0.5], [p_uv_scale.z, p_uv_scale.w]);
                            }
                            w[j] = vec;
                        }
                    }
                    else {
                        const _v_arr = reinterpret_cast(Float32Array, ar, offsets[i], p_vertex_len * 2);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr.subarray(j * 2, j * 2 + 2);
                            w[j] = [v[0], v[1]];
                        }
                    }
                    ret[i] = arr;
                }
                break;
            case ArrayType.ARRAY_CUSTOM0:
            case ArrayType.ARRAY_CUSTOM1:
            case ArrayType.ARRAY_CUSTOM2:
            case ArrayType.ARRAY_CUSTOM3:
                {
                    const type = (p_format >> (ArrayFormat.ARRAY_FORMAT_CUSTOM_BASE + ArrayFormat.ARRAY_FORMAT_CUSTOM_BITS * (i - ArrayType.ARRAY_CUSTOM0))) & ArrayFormat.ARRAY_FORMAT_CUSTOM_MASK;
                    if (!ar) {
                        throw new Error("No Attrute Array");
                    }
                    switch (type) {
                        case ArrayCustomFormat.ARRAY_CUSTOM_RGBA8_UNORM:
                        case ArrayCustomFormat.ARRAY_CUSTOM_RGBA8_SNORM:
                        case ArrayCustomFormat.ARRAY_CUSTOM_RG_HALF:
                        case ArrayCustomFormat.ARRAY_CUSTOM_RGBA_HALF:
                            {
                                // Size 4
                                const s = type == ArrayCustomFormat.ARRAY_CUSTOM_RGBA_HALF ? 8 : 4;
                                const arr = [];
                                const _v_arr = reinterpret_cast(Uint8Array, ar, offsets[i], p_vertex_len * s);
                                for (let j = 0; j < p_vertex_len; j++) {
                                    const v = _v_arr.subarray(j * s, j * s + s);
                                    arr[j] = v;
                                }
                                ret[i] = arr;
                            }
                            break;
                        case ArrayCustomFormat.ARRAY_CUSTOM_R_FLOAT:
                        case ArrayCustomFormat.ARRAY_CUSTOM_RG_FLOAT:
                        case ArrayCustomFormat.ARRAY_CUSTOM_RGB_FLOAT:
                        case ArrayCustomFormat.ARRAY_CUSTOM_RGBA_FLOAT:
                            {
                                const s = type - ArrayCustomFormat.ARRAY_CUSTOM_R_FLOAT + 1;
                                const arr = [];
                                const _v_arr = reinterpret_cast(Uint8Array, ar, offsets[i], p_vertex_len * s);
                                for (let j = 0; j < p_vertex_len; j++) {
                                    const v = _v_arr.subarray(j * s, j * s + s);
                                    arr[j] = v;
                                }
                                ret[i] = arr;
                            }
                            break;
                        default: {
                        }
                    }
                }
                break;
            case ArrayType.ARRAY_WEIGHTS:
                {
                    const bone_count = (p_format & ArrayFormat.ARRAY_FLAG_USE_8_BONE_WEIGHTS) ? 8 : 4;
                    const arr = [];
                    if (bone_count) {
                        if (!sr) {
                            throw new Error("No Skin Array");
                        }
                        const w = arr;
                        const _v_arr = reinterpret_cast(Uint16Array, sr, offsets[i], p_vertex_len * bone_count);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr.subarray(j * bone_count, j * bone_count + bone_count);
                            for (let k = 0; k < bone_count; k++) {
                                w[j * bone_count + k] = (v[k] / 65535.0);
                            }
                        }
                    }
                    ret[i] = arr;
                }
                break;
            case ArrayType.ARRAY_BONES:
                {
                    const bone_count = (p_format & ArrayFormat.ARRAY_FLAG_USE_8_BONE_WEIGHTS) ? 8 : 4;
                    const arr = [];
                    if (bone_count) {
                        if (!sr) {
                            throw new Error("No Skin Array");
                        }
                        const w = arr;
                        const _v_arr = reinterpret_cast(Uint16Array, sr, offsets[i], p_vertex_len * bone_count);
                        for (let j = 0; j < p_vertex_len; j++) {
                            const v = _v_arr.subarray(j * bone_count, j * bone_count + bone_count);
                            for (let k = 0; k < bone_count; k++) {
                                w[j * bone_count + k] = (v[k] / 65535.0);
                            }
                        }
                        ret[i] = arr;
                    }
                }
                break;
            case ArrayType.ARRAY_INDEX:
                {
                    /* determine whether using 16 or 32 bits indices */
                    const arr = [];
                    if (p_index_len > 0) {
                        if (!p_index_data) {
                            throw new Error("Not Index Data, but index");
                        }
                        if (p_vertex_len <= (1 << 16)) {
                            const w = arr;
                            const ir = new Uint16Array(p_index_data);
                            for (let j = 0; j < p_index_len; j++) {
                                const v = ir[j];
                                w[j] = v;
                            }
                        }
                        else {
                            const w = arr;
                            const ir = new Uint16Array(p_index_data);
                            for (let j = 0; j < p_index_len; j++) {
                                const v = ir[j];
                                w[j] = v;
                            }
                        }
                    }
                    ret[i] = arr;
                }
                break;
            default: {
                ERR_FAIL_V('Unknown Index Type in Get Arrays');
            }
        }
    }
    return ret;
}
