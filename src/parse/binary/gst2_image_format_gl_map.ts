import { ERR_FAIL_V_MSG } from "../../util/data-reader";
import { ImageFormat } from "./gst2_format";

const RED = 0x1903;
const RGB8 = 0x8051;
const RGBA4 = 0x8056;
const RGBA8 = 0x8058;
const RGBA32F = 0x8814;
const RGB32F = 0x8815;
const RGBA16F = 0x881A;
const RGB16F = 0x881B;
const RGB9_E5 = 0x8C3D;
const R8 = 0x8229;
const RG8 = 0x822B;
const R16F = 0x822D;
const R32F = 0x822E;
const RG16F = 0x822F;
const RG32F = 0x8230;

// Data types - WebGL 1
const UNSIGNED_BYTE = 0x1401;
const FLOAT = 0x1406;

// Pixel Format
const RGB = 0x1907;
const RGBA = 0x1908;
const LUMINANCE = 0x1909;
const LUMINANCE_ALPHA = 0x190A;

// Pixel Type
//const UNSIGNED_BYTE = 0x1401;
const UNSIGNED_SHORT_4_4_4_4 = 0x8033;

// Pixel Type - WebGL 2
const UNSIGNED_INT_5_9_9_9_REV = 0x8C3E;
const HALF_FLOAT = 0x140B;
const RG = 0x8227;

// Extensions
// S3TC
const _EXT_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
const _EXT_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
const _EXT_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;
// ETC
const _EXT_COMPRESSED_R11_EAC = 0x9270;
const _EXT_COMPRESSED_SIGNED_R11_EAC = 0x9271;
const _EXT_COMPRESSED_RG11_EAC = 0x9272;
const _EXT_COMPRESSED_SIGNED_RG11_EAC = 0x9273;
const _EXT_COMPRESSED_RGB8_ETC2 = 0x9274;
const _EXT_COMPRESSED_RGBA8_ETC2_EAC = 0x9275;
const _EXT_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9278;
//pvrtc

//etc1

const _EXT_COMPRESSED_RED_RGTC1_EXT = 0x8DBB
const _EXT_COMPRESSED_RED_GREEN_RGTC2_EXT = 0x8DBD;
const _EXT_COMPRESSED_RGBA_BPTC_UNORM = 0x8E8C;
const _EXT_COMPRESSED_RGB_BPTC_SIGNED_FLOAT = 0x8E8E;
const _EXT_COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT = 0x8E8F;
const _EXT_COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93B0;
const _EXT_COMPRESSED_RGBA_ASTC_8x8_KHR = 0x93B7;

interface GL_Image_Data_Type {
  internal_format: number;
  format: number;
  type: number;
  compressed: boolean;
}

export function parse_ctex_image_format(image_format: ImageFormat): GL_Image_Data_Type {

  let r_compressed = false;
  let r_gl_internal_format = 0;
  let r_gl_format = 0;
  let r_gl_type = 0;
  
  switch (image_format) {
    case ImageFormat.FORMAT_L8: {
      r_gl_internal_format = LUMINANCE;
      r_gl_format = LUMINANCE;
      r_gl_type = UNSIGNED_BYTE;
    } break;
    case ImageFormat.FORMAT_LA8: {
      r_gl_internal_format = LUMINANCE_ALPHA;
      r_gl_format = LUMINANCE_ALPHA;
      r_gl_type = UNSIGNED_BYTE;
    } break;
    case ImageFormat.FORMAT_R8: {
      r_gl_internal_format = R8;
      r_gl_format = RED;
      r_gl_type = UNSIGNED_BYTE;
    } break;
    case ImageFormat.FORMAT_RG8: {
      r_gl_internal_format = RG8;
      r_gl_format = RG;
      r_gl_type = UNSIGNED_BYTE;
    } break;
    case ImageFormat.FORMAT_RGB8: {
      r_gl_internal_format = RGB8;
      r_gl_format = RGB;
      r_gl_type = UNSIGNED_BYTE;
    } break;
    case ImageFormat.FORMAT_RGBA8: {
      r_gl_format = RGBA;
      r_gl_internal_format = RGBA8;
      r_gl_type = UNSIGNED_BYTE;
    } break;
    case ImageFormat.FORMAT_RGBA4444: {
      r_gl_internal_format = RGBA4;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_SHORT_4_4_4_4;
    } break;
    case ImageFormat.FORMAT_RF: {
      r_gl_internal_format = R32F;
      r_gl_format = RED;
      r_gl_type = FLOAT;
    } break;
    case ImageFormat.FORMAT_RGF: {
      r_gl_internal_format = RG32F;
      r_gl_format = RG;
      r_gl_type = FLOAT;
    } break;
    case ImageFormat.FORMAT_RGBF: {
      r_gl_internal_format = RGB32F;
      r_gl_format = RGB;
      r_gl_type = FLOAT;
    } break;
    case ImageFormat.FORMAT_RGBAF: {
      r_gl_internal_format = RGBA32F;
      r_gl_format = RGBA;
      r_gl_type = FLOAT;
    } break;
    case ImageFormat.FORMAT_RH: {
      r_gl_internal_format = R16F;
      r_gl_format = RED;
      r_gl_type = HALF_FLOAT;
    } break;
    case ImageFormat.FORMAT_RGH: {
      r_gl_internal_format = RG16F;
      r_gl_format = RG;
      r_gl_type = HALF_FLOAT;
    } break;
    case ImageFormat.FORMAT_RGBH: {
      r_gl_internal_format = RGB16F;
      r_gl_format = RGB;
      r_gl_type = HALF_FLOAT;
    } break;
    case ImageFormat.FORMAT_RGBAH: {
      r_gl_internal_format = RGBA16F;
      r_gl_format = RGBA;
      r_gl_type = HALF_FLOAT;
    } break;
    case ImageFormat.FORMAT_RGBE9995: {
      r_gl_internal_format = RGB9_E5;
      r_gl_format = RGB;
      r_gl_type = UNSIGNED_INT_5_9_9_9_REV;
    } break;
    case ImageFormat.FORMAT_DXT1: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_S3TC_DXT1_EXT;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_DXT3: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_S3TC_DXT3_EXT;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_DXT5: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_S3TC_DXT5_EXT;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_RGTC_R: {
      r_gl_internal_format = _EXT_COMPRESSED_RED_RGTC1_EXT;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_RGTC_RG: {
      r_gl_internal_format = _EXT_COMPRESSED_RED_GREEN_RGTC2_EXT;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_BPTC_RGBA: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_BPTC_UNORM;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_BPTC_RGBF: {
      r_gl_internal_format = _EXT_COMPRESSED_RGB_BPTC_SIGNED_FLOAT;
      r_gl_format = RGB;
      r_gl_type = FLOAT;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_BPTC_RGBFU: {
      r_gl_internal_format = _EXT_COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT;
      r_gl_format = RGB;
      r_gl_type = FLOAT;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_R11: {
      r_gl_internal_format = _EXT_COMPRESSED_R11_EAC;
      r_gl_format = RED;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_R11S: {
      r_gl_internal_format = _EXT_COMPRESSED_SIGNED_R11_EAC;
      r_gl_format = RED;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_RG11: {
      r_gl_internal_format = _EXT_COMPRESSED_RG11_EAC;
      r_gl_format = RG;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_RG11S: {
      r_gl_internal_format = _EXT_COMPRESSED_SIGNED_RG11_EAC;
      r_gl_format = RG;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC:
    case ImageFormat.FORMAT_ETC2_RGB8: {
      r_gl_internal_format = _EXT_COMPRESSED_RGB8_ETC2;
      r_gl_format = RGB;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_RGBA8: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA8_ETC2_EAC;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_RGB8A1: {
      r_gl_internal_format = _EXT_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ETC2_RA_AS_RG: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA8_ETC2_EAC;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_DXT5_RA_AS_RG: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_S3TC_DXT5_EXT;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ASTC_4x4: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_ASTC_4x4_KHR;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ASTC_4x4_HDR: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_ASTC_4x4_KHR;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ASTC_8x8: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_ASTC_8x8_KHR;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    case ImageFormat.FORMAT_ASTC_8x8_HDR: {
      r_gl_internal_format = _EXT_COMPRESSED_RGBA_ASTC_8x8_KHR;
      r_gl_format = RGBA;
      r_gl_type = UNSIGNED_BYTE;
      r_compressed = true;
    } break;
    default: {
      ERR_FAIL_V_MSG("parse_ctex_image_format", "The image format " + image_format + " is not supported by the GL Compatibility rendering backend.");
    }
  }

  return {
    internal_format: r_gl_internal_format,
    format: r_gl_format,
    type: r_gl_type,
    compressed: r_compressed
  }
}