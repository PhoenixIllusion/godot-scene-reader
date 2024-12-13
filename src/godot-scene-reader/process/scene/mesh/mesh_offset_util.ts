import { ERR_FAIL_V, ERR_PRINT } from "../../../util/data-reader";
import { ArrayCustomFormat, ArrayFormat, ArrayType } from "./mesh_types";

export interface VertexSizeAccumulator {
  vertex_element_size: number,
  normal_element_size: number,
  attrib_element_size: number,
  skin_element_size: number
}

const SIZE_OF_FLOAT = 4;
const SIZE_OF_U16 = 2;

export function mesh_surface_make_offsets_from_format(p_format: number, p_vertex_len: number, p_index_len: number, offsets: number[]): VertexSizeAccumulator {
	const accums: VertexSizeAccumulator = {
    vertex_element_size: 0,
	  normal_element_size: 0,
	  attrib_element_size: 0,
	  skin_element_size: 0
  }

	let size_accum: keyof VertexSizeAccumulator | null = null;

	for (let i = 0; i < ArrayType.ARRAY_MAX; i++) {
		offsets[i] = 0; // Reset

		if (i == ArrayType.ARRAY_VERTEX) {
			size_accum = 'vertex_element_size';
		} else if (i == ArrayType.ARRAY_NORMAL) {
			size_accum = 'normal_element_size';
		} else if (i == ArrayType.ARRAY_COLOR) {
			size_accum = 'attrib_element_size';
		} else if (i == ArrayType.ARRAY_BONES) {
			size_accum = 'skin_element_size';
		}

		if (!(p_format & (1 << i))) { // No array
			continue;
		}

		let elem_size = 0;

		switch (i) {
			case ArrayType.ARRAY_VERTEX: {
				if (p_format & ArrayFormat.ARRAY_FLAG_USE_2D_VERTICES) {
					elem_size = 2;
				} else {
					elem_size = (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) ? 2 : 3;
				}

				elem_size *= SIZE_OF_FLOAT;
			} break;
			case ArrayType.ARRAY_NORMAL: {
				elem_size = 4;
			} break;
			case ArrayType.ARRAY_TANGENT: {
				elem_size = (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) ? 0 : 4;
			} break;
			case ArrayType.ARRAY_COLOR: {
				elem_size = 4;
			} break;
			case ArrayType.ARRAY_TEX_UV: {
				elem_size = (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) ? 4 : 8;
			} break;
			case ArrayType.ARRAY_TEX_UV2: {
				elem_size = (p_format & ArrayFormat.ARRAY_FLAG_COMPRESS_ATTRIBUTES) ? 4 : 8;
			} break;
			case ArrayType.ARRAY_CUSTOM0:
			case ArrayType.ARRAY_CUSTOM1:
			case ArrayType.ARRAY_CUSTOM2:
			case ArrayType.ARRAY_CUSTOM3: {
				const format = (p_format >> (ArrayFormat.ARRAY_FORMAT_CUSTOM_BASE + (ArrayFormat.ARRAY_FORMAT_CUSTOM_BITS * (i - ArrayType.ARRAY_CUSTOM0)))) & ArrayFormat.ARRAY_FORMAT_CUSTOM_MASK;
				switch (format) {
					case ArrayCustomFormat.ARRAY_CUSTOM_RGBA8_UNORM: {
						elem_size = 4;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_RGBA8_SNORM: {
						elem_size = 4;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_RG_HALF: {
						elem_size = 4;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_RGBA_HALF: {
						elem_size = 8;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_R_FLOAT: {
						elem_size = 4;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_RG_FLOAT: {
						elem_size = 8;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_RGB_FLOAT: {
						elem_size = 12;
					} break;
					case ArrayCustomFormat.ARRAY_CUSTOM_RGBA_FLOAT: {
						elem_size = 16;
					} break;
				}
			} break;
			case ArrayType.ARRAY_WEIGHTS: {
				const bone_count = (p_format & ArrayFormat.ARRAY_FLAG_USE_8_BONE_WEIGHTS) ? 8 : 4;
				elem_size = SIZE_OF_U16 * bone_count;

			} break;
			case ArrayType.ARRAY_BONES: {
				const bone_count = (p_format & ArrayFormat.ARRAY_FLAG_USE_8_BONE_WEIGHTS) ? 8 : 4;
				elem_size = SIZE_OF_U16 * bone_count;
			} break;
			case ArrayType.ARRAY_INDEX: {
				if (p_index_len <= 0) {
					ERR_PRINT("index_array_len==NO_INDEX_ARRAY");
					break;
				}
				/* determine whether using 16 or 32 bits indices */
				if (p_vertex_len <= (1 << 16) && p_vertex_len > 0) {
					elem_size = 2;
				} else {
					elem_size = 4;
				}
				offsets[i] = elem_size;
				continue;
			}
			default: {
				ERR_FAIL_V("INVALID Mesh ARRAY_INDEX TYPE");
			}
		}

		if (size_accum != null) {
			offsets[i] = accums[size_accum];
			if (i == ArrayType.ARRAY_NORMAL || i == ArrayType.ARRAY_TANGENT) {
				offsets[i] += accums['vertex_element_size'] * p_vertex_len;
			}
      accums[size_accum] += elem_size;
		} else {
			offsets[i] = 0;
		}
	}
  return accums;
}