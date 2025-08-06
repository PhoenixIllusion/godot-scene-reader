import { ERR_FAIL_V } from "../../../util/data-reader";
import { AABB, Vector3, Vector4 } from "../../../parse/binary/variant";
import { mesh_surface_make_offsets_from_format } from "./mesh_offset_util";
import { ArrayCustomFormat, ArrayFormat, ArrayType } from "./mesh_types";

const CMP_EPSILON = 0.00001

type F1 = number
type F2 = [number, number]
type F3 = [number, number, number];
type F4 = [number, number, number, number];
type F8 = [number, number, number, number,number, number, number, number];

type F1A = F1[]
type F2A = F2[]
type F3A = F3[]
type F4A = F4[]
type F8A = F8[]

export type FA = F1A | F2A | F3A | F4A | F8A;

type TypedArray = Uint8Array | Int8Array |
  Uint16Array | Int16Array |
  Uint32Array | Int32Array |
  Float32Array | Float64Array;

function is_zero_approx(v: F1 | F2 | F3 | F4): boolean {
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) {
      if (Math.abs(v[i]) > CMP_EPSILON) {
        return false;
      }
    }
    return true;
  } else {
    return Math.abs(v) < CMP_EPSILON;
  }
}

function set_axis_angle(axis: F3, p_angle: number): { rows: [F3, F3, F3] } {
  const p_axis = { x: axis[0], y: axis[1], z: axis[2] };
  const rows: [F3, F3, F3] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
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

function _get_tbn_from_axis_angle(p_axis: F3, p_angle: number): { normal: F3, tangent: F4 } {
  const binormal_sign = p_angle > 0.5 ? 1.0 : -1.0;
  const angle = Math.abs(p_angle * 2.0 - 1.0) * Math.PI;

  const tbn = set_axis_angle(p_axis, angle);
  const tan: F3 = tbn.rows[0];
  const tangent: F4 = [tan[0], tan[1], tan[2], binormal_sign];
  const normal: F3 = tbn.rows[2];
  return { tangent, normal }
}

function length_squared(v: F3): number {
  const x2 = v[0] * v[0];
  const y2 = v[1] * v[1];
  const z2 = v[2] * v[2];
  return x2 + y2 + z2;
}

function normalized(v: F3): F3 {
  const lengthsq = length_squared(v);
  if (lengthsq == 0) { return [0, 0, 0] }
  const length = Math.sqrt(lengthsq);
  return [v[0] / length, v[1] / length, v[2] / length];
}

function CLAMP(v: number, min: number, max: number) {
  return v > max ? max : v < min ? min : v;
}

function octahedron_decode_(p_oct: F2): F3 {
  const f: F2 = [p_oct[0] * 2.0 - 1.0, p_oct[1] * 2.0 - 1.0];
  const n: F3 = [f[0], f[1], 1.0 - Math.abs(f[0]) - Math.abs(f[1])];
  const t = CLAMP(-n[2], 0.0, 1.0);
  n[0] += n[0] >= 0 ? -t : t;
  n[1] += n[1] >= 0 ? -t : t;
  return normalized(n);
}
function octahedron_decode(x: number, y: number): F3 {
  return octahedron_decode_([x, y]);
}

function octahedron_tangent_decode(p_oct: F2): { res: F3, tangent_sign: number } {
  const oct_compressed: F2 = p_oct;
  oct_compressed[1] = oct_compressed[1] * 2 - 1;
  const r_sign = oct_compressed[1] >= 0.0 ? 1.0 : -1.0;
  oct_compressed[1] = Math.abs(oct_compressed[1]);
  const res: F3 = octahedron_decode_(oct_compressed);
  return { res, tangent_sign: r_sign };
}

type ctor<T> = { new(buffer: ArrayBuffer, byteOffset: number, length?: number): T };

function reinterpret_cast<T extends TypedArray>(_class: ctor<T>, buffer: ArrayBuffer, offset: number, len?: number) {
  return new _class(buffer, offset, len);
}

function _v3_madd(vec: F3, size: Vector3, pos: Vector3): F3 {
  const x = vec[0] * size.x + pos.x;
  const y = vec[1] * size.y + pos.y;
  const z = vec[2] * size.z + pos.z;
  return [x, y, z];
}
function _v2_sub_mult(vec: F2, sub: F2, mult: F2): F2 {
  const x = (vec[0] - sub[0]) * mult[0];
  const y = (vec[1] - sub[1]) * mult[1];
  return [x, y];
}

export function _get_array_from_surface(p_format: number, p_vertex_data: ArrayBuffer, p_attrib_data: ArrayBuffer | null, p_skin_data: ArrayBuffer | null,
  p_vertex_len: number, p_index_data: ArrayBuffer | null, p_index_len: number, p_aabb: AABB, p_uv_scale: Vector4) {
  const offsets: number[] = [];

  const elem_size = mesh_surface_make_offsets_from_format(p_format, p_vertex_len, p_index_len, offsets);

  const { vertex_element_size, attrib_element_size, skin_element_size } = elem_size;

  const ret: (FA | Uint8Array[])[] = [];

  const uv_scale: F4 = [0, 0, 0, 0];
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
      case ArrayType.ARRAY_VERTEX: {
        if (p_format & ArrayFormat.ARRAY_FLAG_USE_2D_VERTICES) {
          const arr_2d: F2A = [];

          {
            const w = arr_2d;

            for (let j = 0; j < p_vertex_len; j++) {
              const v = reinterpret_cast(Float32Array, r, j * vertex_element_size + offsets[i], 2);
              w[j] = [v[0], v[1]];
            }
          }

          ret[i] = arr_2d;
        } else {
          const arr_3d: F3A = [];

          {
            const w = arr_3d;

            if (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) {
              // We only have vertices to read, so just read them and skip everything else.
              if (!(p_format & ArrayFormat.ARRAY_FORMAT_NORMAL)) {
                for (let j = 0; j < p_vertex_len; j++) {
                  const v = reinterpret_cast(Uint16Array, r, j * vertex_element_size + offsets[i], 3);
                  const vec: F3 = [(v[0]) / 65535.0, (v[1]) / 65535.0, (v[2]) / 65535.0];
                  w[j] = _v3_madd(vec, p_aabb.size, p_aabb.position);
                }
                ret[i] = arr_3d;
                continue;
              }

              const normals: F3A = [];
              const normalsw = normals;
              const tangents: F4A = [];
              const tangentsw = tangents;

              const _n_stride = elem_size.normal_element_size / 4;
              const _n_array = reinterpret_cast(Uint32Array, r, offsets[ArrayType.ARRAY_NORMAL]);

              for (let j = 0; j < p_vertex_len; j++) {
                const n = _n_array[j * _n_stride];
                const axis = octahedron_decode((n & 0xFFFF) / 65535.0, ((n >> 16) & 0xFFFF) / 65535.0);

                const v = reinterpret_cast(Uint16Array, r, j * vertex_element_size + offsets[i], 4);
                const vec: F3 = [(v[0]) / 65535.0, (v[1]) / 65535.0, (v[2]) / 65535.0];
                const angle = (v[3]) / 65535.0;
                w[j] = _v3_madd(vec, p_aabb.size, p_aabb.position);

                const { normal, tangent } = _get_tbn_from_axis_angle(axis, angle);

                normalsw[j] = normal;
                tangentsw[j] = tangent;
              }
              ret[ArrayType.ARRAY_NORMAL] = normals;
              ret[ArrayType.ARRAY_TANGENT] = tangentsw;

            } else {
              for (let j = 0; j < p_vertex_len; j++) {
                const v = reinterpret_cast(Float32Array, r, j * vertex_element_size + offsets[i], 3);
                w[j] = [v[0], v[1], v[2]];
              }
            }
          }

          ret[i] = arr_3d;
        }

      } break;
      case ArrayType.ARRAY_NORMAL: {
        if (!(p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES)) {
          const arr: F3A = [];

          const w = arr;

          const _n_stride = elem_size.normal_element_size / 4;
          const _v_arr = reinterpret_cast(Uint32Array, r, offsets[i]);
          for (let j = 0; j < p_vertex_len; j++) {
            const v = _v_arr[j * _n_stride];

            w[j] = octahedron_decode((v & 0xFFFF) / 65535.0, ((v >> 16) & 0xFFFF) / 65535.0);
          }

          ret[i] = arr;
        }
      } break;

      case ArrayType.ARRAY_TANGENT: {
        if (!(p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES)) {
          const arr: F4A = []

          const w = arr;

          const _n_stride = elem_size.normal_element_size / 4;
          const _v_arr = reinterpret_cast(Uint32Array, r, offsets[i]);
          for (let j = 0; j < p_vertex_len; j++) {
            const v = _v_arr[j * _n_stride];
            const { res, tangent_sign } = octahedron_tangent_decode([(v & 0xFFFF) / 65535.0, ((v >> 16) & 0xFFFF) / 65535.0]);
            w[j] = [...res, tangent_sign];
          }

          ret[i] = arr;
        }
      } break;
      case ArrayType.ARRAY_COLOR: {
        const arr: F4A = [];

        const w = arr;
        if (!ar) {
          throw new Error("No Attrute Array");
        }

        const _v_arr = reinterpret_cast(Uint8Array, ar, offsets[i]);
        for (let j = 0; j < p_vertex_len; j++) {
          const v = _v_arr.subarray(j * attrib_element_size, j * attrib_element_size + 4);
          w[j] = [v[0] / 255.0, v[1] / 255.0, v[2] / 255.0, v[3] / 255.0];
        }

        ret[i] = arr;
      } break;
      case ArrayType.ARRAY_TEX_UV: {
        const arr: F2A = [];

        if (!ar) {
          throw new Error("No Attrute Array");
        }
        const w = arr;
        if (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) {

          const _v_stride = attrib_element_size / 2;
          const _v_arr = reinterpret_cast(Uint16Array, ar, offsets[i]);
          for (let j = 0; j < p_vertex_len; j++) {
            const v = _v_arr.subarray(j * _v_stride, j * _v_stride + 2);
            let vec: F2 = [(v[0]) / 65535.0, (v[1]) / 65535.0];
            if (!is_zero_approx(uv_scale)) {
              vec = _v2_sub_mult(vec, [0.5, 0.5], [p_uv_scale.x, p_uv_scale.y]);
            }

            w[j] = vec;
          }
        } else {
          const _v_stride = attrib_element_size / 4;
          const _v_arr = reinterpret_cast(Float32Array, ar, offsets[i]);
          for (let j = 0; j < p_vertex_len; j++) {
            const v = _v_arr.subarray(j * _v_stride, j * _v_stride + 2);
            w[j] = [v[0], v[1]];
          }
        }
        ret[i] = arr;
      } break;

      case ArrayType.ARRAY_TEX_UV2: {
        const arr: F2A = [];

        const w = arr;
        if (!ar) {
          throw new Error("No Attrute Array");
        }

        if (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) {
          const _v_stride = attrib_element_size / 2;
          const _v_arr = reinterpret_cast(Uint16Array, ar, offsets[i]);
          for (let j = 0; j < p_vertex_len; j++) {
            const v = _v_arr.subarray(j * _v_stride, j * _v_stride + 2);
            let vec: F2 = [(v[0]) / 65535.0, (v[1]) / 65535.0];
            if (!is_zero_approx(uv_scale)) {
              vec = _v2_sub_mult(vec, [0.5, 0.5], [p_uv_scale.z, p_uv_scale.w]);
            }
            w[j] = vec;
          }
        } else {
          const _v_stride = attrib_element_size / 4;
          const _v_arr = reinterpret_cast(Float32Array, ar, offsets[i]);
          for (let j = 0; j < p_vertex_len; j++) {
            const v = _v_arr.subarray(j * _v_stride, j * _v_stride + 2);
            w[j] = [v[0], v[1]];
          }
        }

        ret[i] = arr;

      } break;
      case ArrayType.ARRAY_CUSTOM0:
      case ArrayType.ARRAY_CUSTOM1:
      case ArrayType.ARRAY_CUSTOM2:
      case ArrayType.ARRAY_CUSTOM3: {
        const type = (p_format >> (ArrayFormat.ARRAY_FORMAT_CUSTOM_BASE + ArrayFormat.ARRAY_FORMAT_CUSTOM_BITS * (i - ArrayType.ARRAY_CUSTOM0))) & ArrayFormat.ARRAY_FORMAT_CUSTOM_MASK;

        if (!ar) {
          throw new Error("No Attrute Array");
        }
        switch (type) {
          case ArrayCustomFormat.ARRAY_CUSTOM_RGBA8_UNORM:
          case ArrayCustomFormat.ARRAY_CUSTOM_RGBA8_SNORM:
          case ArrayCustomFormat.ARRAY_CUSTOM_RG_HALF:
          case ArrayCustomFormat.ARRAY_CUSTOM_RGBA_HALF: {
            // Size 4
            const s = type == ArrayCustomFormat.ARRAY_CUSTOM_RGBA_HALF ? 8 : 4;
            const arr: Uint8Array[] = [];

            const _v_arr: Uint8Array = reinterpret_cast(Uint8Array, ar, offsets[i]);
            for (let j = 0; j < p_vertex_len; j++) {
              const v = _v_arr.subarray(j * attrib_element_size, j * attrib_element_size + s);
              arr[j] = v;
            }

            ret[i] = arr;

          } break;
          case ArrayCustomFormat.ARRAY_CUSTOM_R_FLOAT:
          case ArrayCustomFormat.ARRAY_CUSTOM_RG_FLOAT:
          case ArrayCustomFormat.ARRAY_CUSTOM_RGB_FLOAT:
          case ArrayCustomFormat.ARRAY_CUSTOM_RGBA_FLOAT: {
            const s = type - ArrayCustomFormat.ARRAY_CUSTOM_R_FLOAT + 1;

            const arr: Uint8Array[] = [];

            const _v_arr: Uint8Array = reinterpret_cast(Uint8Array, ar, offsets[i]);
            for (let j = 0; j < p_vertex_len; j++) {
              const v = _v_arr.subarray(j * attrib_element_size, j * attrib_element_size + s);
              arr[j] = v;
            }
            ret[i] = arr;

          } break;
          default: {
          }
        }

      } break;
      case ArrayType.ARRAY_WEIGHTS: {
        const bone_count = (p_format & ArrayFormat.ARRAY_FLAG_USE_8_BONE_WEIGHTS) ? 8 : 4;

        const arr: F4A|F8A = [];

        if (bone_count) {
          if (!sr) {
            throw new Error("No Skin Array");
          }
          const w = arr;
          for (let j = 0; j < p_vertex_len; j++) {
            const v = reinterpret_cast(Uint16Array, sr, j * skin_element_size + offsets[i], bone_count)
            w[j] = [... v].map(x => x  / 65535.0) as F4|F8
          }
        }

        ret[i] = arr;

      } break;
      case ArrayType.ARRAY_BONES: {
        const bone_count = (p_format & ArrayFormat.ARRAY_FLAG_USE_8_BONE_WEIGHTS) ? 8 : 4;

        const arr: F4A|F8A = [];

        if (bone_count) {
          if (!sr) {
            throw new Error("No Skin Array");
          }
          const w = arr;
          for (let j = 0; j < p_vertex_len; j++) {
            const v = reinterpret_cast(Uint16Array, sr, j * skin_element_size + offsets[i], bone_count)
            w[j] = [... v] as F4|F8
          }

          ret[i] = arr;
        }
      } break;
      case ArrayType.ARRAY_INDEX: {
        /* determine whether using 16 or 32 bits indices */
        const arr: F1A = [];
        if (p_index_len > 0) {
          if (!p_index_data) {
            throw new Error("Not Index Data, but index")
          }
          if (p_vertex_len <= (1 << 16)) {
            const w = arr;

            const ir = new Uint16Array(p_index_data);

            for (let j = 0; j < p_index_len; j++) {
              const v = ir[j];
              w[j] = v;
            }
          } else {
            const w = arr;
            const ir = new Uint32Array(p_index_data);

            for (let j = 0; j < p_index_len; j++) {
              const v = ir[j];
              w[j] = v;
            }
          }
        }
        ret[i] = arr;
      } break;
      default: {
        ERR_FAIL_V('Unknown Index Type in Get Arrays');
      }
    }
  }

  return ret;
}