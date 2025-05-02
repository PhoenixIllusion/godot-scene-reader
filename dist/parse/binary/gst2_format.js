export var ImageFormat;
(function (ImageFormat) {
    ImageFormat[ImageFormat["FORMAT_L8"] = 0] = "FORMAT_L8";
    ImageFormat[ImageFormat["FORMAT_LA8"] = 1] = "FORMAT_LA8";
    ImageFormat[ImageFormat["FORMAT_R8"] = 2] = "FORMAT_R8";
    ImageFormat[ImageFormat["FORMAT_RG8"] = 3] = "FORMAT_RG8";
    ImageFormat[ImageFormat["FORMAT_RGB8"] = 4] = "FORMAT_RGB8";
    ImageFormat[ImageFormat["FORMAT_RGBA8"] = 5] = "FORMAT_RGBA8";
    ImageFormat[ImageFormat["FORMAT_RGBA4444"] = 6] = "FORMAT_RGBA4444";
    ImageFormat[ImageFormat["FORMAT_RGB565"] = 7] = "FORMAT_RGB565";
    ImageFormat[ImageFormat["FORMAT_RF"] = 8] = "FORMAT_RF";
    ImageFormat[ImageFormat["FORMAT_RGF"] = 9] = "FORMAT_RGF";
    ImageFormat[ImageFormat["FORMAT_RGBF"] = 10] = "FORMAT_RGBF";
    ImageFormat[ImageFormat["FORMAT_RGBAF"] = 11] = "FORMAT_RGBAF";
    ImageFormat[ImageFormat["FORMAT_RH"] = 12] = "FORMAT_RH";
    ImageFormat[ImageFormat["FORMAT_RGH"] = 13] = "FORMAT_RGH";
    ImageFormat[ImageFormat["FORMAT_RGBH"] = 14] = "FORMAT_RGBH";
    ImageFormat[ImageFormat["FORMAT_RGBAH"] = 15] = "FORMAT_RGBAH";
    ImageFormat[ImageFormat["FORMAT_RGBE9995"] = 16] = "FORMAT_RGBE9995";
    ImageFormat[ImageFormat["FORMAT_DXT1"] = 17] = "FORMAT_DXT1";
    ImageFormat[ImageFormat["FORMAT_DXT3"] = 18] = "FORMAT_DXT3";
    ImageFormat[ImageFormat["FORMAT_DXT5"] = 19] = "FORMAT_DXT5";
    ImageFormat[ImageFormat["FORMAT_RGTC_R"] = 20] = "FORMAT_RGTC_R";
    ImageFormat[ImageFormat["FORMAT_RGTC_RG"] = 21] = "FORMAT_RGTC_RG";
    ImageFormat[ImageFormat["FORMAT_BPTC_RGBA"] = 22] = "FORMAT_BPTC_RGBA";
    ImageFormat[ImageFormat["FORMAT_BPTC_RGBF"] = 23] = "FORMAT_BPTC_RGBF";
    ImageFormat[ImageFormat["FORMAT_BPTC_RGBFU"] = 24] = "FORMAT_BPTC_RGBFU";
    ImageFormat[ImageFormat["FORMAT_ETC"] = 25] = "FORMAT_ETC";
    ImageFormat[ImageFormat["FORMAT_ETC2_R11"] = 26] = "FORMAT_ETC2_R11";
    ImageFormat[ImageFormat["FORMAT_ETC2_R11S"] = 27] = "FORMAT_ETC2_R11S";
    ImageFormat[ImageFormat["FORMAT_ETC2_RG11"] = 28] = "FORMAT_ETC2_RG11";
    ImageFormat[ImageFormat["FORMAT_ETC2_RG11S"] = 29] = "FORMAT_ETC2_RG11S";
    ImageFormat[ImageFormat["FORMAT_ETC2_RGB8"] = 30] = "FORMAT_ETC2_RGB8";
    ImageFormat[ImageFormat["FORMAT_ETC2_RGBA8"] = 31] = "FORMAT_ETC2_RGBA8";
    ImageFormat[ImageFormat["FORMAT_ETC2_RGB8A1"] = 32] = "FORMAT_ETC2_RGB8A1";
    ImageFormat[ImageFormat["FORMAT_ETC2_RA_AS_RG"] = 33] = "FORMAT_ETC2_RA_AS_RG";
    ImageFormat[ImageFormat["FORMAT_DXT5_RA_AS_RG"] = 34] = "FORMAT_DXT5_RA_AS_RG";
    ImageFormat[ImageFormat["FORMAT_ASTC_4x4"] = 35] = "FORMAT_ASTC_4x4";
    ImageFormat[ImageFormat["FORMAT_ASTC_4x4_HDR"] = 36] = "FORMAT_ASTC_4x4_HDR";
    ImageFormat[ImageFormat["FORMAT_ASTC_8x8"] = 37] = "FORMAT_ASTC_8x8";
    ImageFormat[ImageFormat["FORMAT_ASTC_8x8_HDR"] = 38] = "FORMAT_ASTC_8x8_HDR";
    ImageFormat[ImageFormat["FORMAT_MAX"] = 39] = "FORMAT_MAX";
})(ImageFormat || (ImageFormat = {}));
;
export var DataFormat;
(function (DataFormat) {
    DataFormat[DataFormat["DATA_FORMAT_IMAGE"] = 0] = "DATA_FORMAT_IMAGE";
    DataFormat[DataFormat["DATA_FORMAT_PNG"] = 1] = "DATA_FORMAT_PNG";
    DataFormat[DataFormat["DATA_FORMAT_WEBP"] = 2] = "DATA_FORMAT_WEBP";
    DataFormat[DataFormat["DATA_FORMAT_BASIS_UNIVERSAL"] = 3] = "DATA_FORMAT_BASIS_UNIVERSAL";
})(DataFormat || (DataFormat = {}));
;
// @ts-ignore
var Version;
(function (Version) {
    Version[Version["FORMAT_VERSION"] = 1] = "FORMAT_VERSION";
})(Version || (Version = {}));
;
// @ts-ignore
var FormatBits;
(function (FormatBits) {
    FormatBits[FormatBits["FORMAT_BIT_STREAM"] = 4194304] = "FORMAT_BIT_STREAM";
    FormatBits[FormatBits["FORMAT_BIT_HAS_MIPMAPS"] = 8388608] = "FORMAT_BIT_HAS_MIPMAPS";
    FormatBits[FormatBits["FORMAT_BIT_DETECT_3D"] = 16777216] = "FORMAT_BIT_DETECT_3D";
    //FORMAT_BIT_DETECT_SRGB = 1 << 25,
    FormatBits[FormatBits["FORMAT_BIT_DETECT_NORMAL"] = 67108864] = "FORMAT_BIT_DETECT_NORMAL";
    FormatBits[FormatBits["FORMAT_BIT_DETECT_ROUGNESS"] = 134217728] = "FORMAT_BIT_DETECT_ROUGNESS";
})(FormatBits || (FormatBits = {}));
;
export function get_format_pixel_size(p_format) {
    switch (p_format) {
        case ImageFormat.FORMAT_L8:
            return 1; //luminance
        case ImageFormat.FORMAT_LA8:
            return 2; //luminance-alpha
        case ImageFormat.FORMAT_R8:
            return 1;
        case ImageFormat.FORMAT_RG8:
            return 2;
        case ImageFormat.FORMAT_RGB8:
            return 3;
        case ImageFormat.FORMAT_RGBA8:
            return 4;
        case ImageFormat.FORMAT_RGBA4444:
            return 2;
        case ImageFormat.FORMAT_RGB565:
            return 2;
        case ImageFormat.FORMAT_RF:
            return 4; //float
        case ImageFormat.FORMAT_RGF:
            return 8;
        case ImageFormat.FORMAT_RGBF:
            return 12;
        case ImageFormat.FORMAT_RGBAF:
            return 16;
        case ImageFormat.FORMAT_RH:
            return 2; //half float
        case ImageFormat.FORMAT_RGH:
            return 4;
        case ImageFormat.FORMAT_RGBH:
            return 6;
        case ImageFormat.FORMAT_RGBAH:
            return 8;
        case ImageFormat.FORMAT_RGBE9995:
            return 4;
        case ImageFormat.FORMAT_DXT1:
            return 1; //s3tc bc1
        case ImageFormat.FORMAT_DXT3:
            return 1; //bc2
        case ImageFormat.FORMAT_DXT5:
            return 1; //bc3
        case ImageFormat.FORMAT_RGTC_R:
            return 1; //bc4
        case ImageFormat.FORMAT_RGTC_RG:
            return 1; //bc5
        case ImageFormat.FORMAT_BPTC_RGBA:
            return 1; //btpc bc6h
        case ImageFormat.FORMAT_BPTC_RGBF:
            return 1; //float /
        case ImageFormat.FORMAT_BPTC_RGBFU:
            return 1; //unsigned float
        case ImageFormat.FORMAT_ETC:
            return 1; //etc1
        case ImageFormat.FORMAT_ETC2_R11:
            return 1; //etc2
        case ImageFormat.FORMAT_ETC2_R11S:
            return 1; //signed: return 1; NOT srgb.
        case ImageFormat.FORMAT_ETC2_RG11:
            return 1;
        case ImageFormat.FORMAT_ETC2_RG11S:
            return 1;
        case ImageFormat.FORMAT_ETC2_RGB8:
            return 1;
        case ImageFormat.FORMAT_ETC2_RGBA8:
            return 1;
        case ImageFormat.FORMAT_ETC2_RGB8A1:
            return 1;
        case ImageFormat.FORMAT_ETC2_RA_AS_RG:
            return 1;
        case ImageFormat.FORMAT_DXT5_RA_AS_RG:
            return 1;
        case ImageFormat.FORMAT_ASTC_4x4:
            return 1;
        case ImageFormat.FORMAT_ASTC_4x4_HDR:
            return 1;
        case ImageFormat.FORMAT_ASTC_8x8:
            return 1;
        case ImageFormat.FORMAT_ASTC_8x8_HDR:
            return 1;
        case ImageFormat.FORMAT_MAX: {
        }
    }
    return 0;
}
export function get_format_pixel_rshift(p_format) {
    if (p_format == ImageFormat.FORMAT_ASTC_8x8) {
        return 2;
    }
    else if (p_format == ImageFormat.FORMAT_DXT1 || p_format == ImageFormat.FORMAT_RGTC_R || p_format == ImageFormat.FORMAT_ETC || p_format == ImageFormat.FORMAT_ETC2_R11 ||
        p_format == ImageFormat.FORMAT_ETC2_R11S || p_format == ImageFormat.FORMAT_ETC2_RGB8 || p_format == ImageFormat.FORMAT_ETC2_RGB8A1) {
        return 1;
    }
    else {
        return 0;
    }
}
export function get_format_block_size(p_format) {
    switch (p_format) {
        case ImageFormat.FORMAT_DXT1: //s3tc bc1
        case ImageFormat.FORMAT_DXT3: //bc2
        case ImageFormat.FORMAT_DXT5: //bc3
        case ImageFormat.FORMAT_RGTC_R: //bc4
        case ImageFormat.FORMAT_RGTC_RG: { //bc5		case case ImageFormat.FORMAT_DXT1:
            return 4;
        }
        case ImageFormat.FORMAT_ETC: {
            return 4;
        }
        case ImageFormat.FORMAT_BPTC_RGBA:
        case ImageFormat.FORMAT_BPTC_RGBF:
        case ImageFormat.FORMAT_BPTC_RGBFU: {
            return 4;
        }
        case ImageFormat.FORMAT_ETC2_R11: //etc2
        case ImageFormat.FORMAT_ETC2_R11S: //signed: NOT srgb.
        case ImageFormat.FORMAT_ETC2_RG11:
        case ImageFormat.FORMAT_ETC2_RG11S:
        case ImageFormat.FORMAT_ETC2_RGB8:
        case ImageFormat.FORMAT_ETC2_RGBA8:
        case ImageFormat.FORMAT_ETC2_RGB8A1:
        case ImageFormat.FORMAT_ETC2_RA_AS_RG: //used to make basis universal happy
        case ImageFormat.FORMAT_DXT5_RA_AS_RG: //used to make basis universal happy
            {
                return 4;
            }
        case ImageFormat.FORMAT_ASTC_4x4:
        case ImageFormat.FORMAT_ASTC_4x4_HDR: {
            return 4;
        }
        case ImageFormat.FORMAT_ASTC_8x8:
        case ImageFormat.FORMAT_ASTC_8x8_HDR: {
            return 8;
        }
        default: {
        }
    }
    return 1;
}
