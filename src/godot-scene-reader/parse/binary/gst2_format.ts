export const enum ImageFormat {
  FORMAT_L8, //luminance
  FORMAT_LA8, //luminance-alpha
  FORMAT_R8,
  FORMAT_RG8,
  FORMAT_RGB8,
  FORMAT_RGBA8,
  FORMAT_RGBA4444,
  FORMAT_RGB565,
  FORMAT_RF, //float
  FORMAT_RGF,
  FORMAT_RGBF,
  FORMAT_RGBAF,
  FORMAT_RH, //half float
  FORMAT_RGH,
  FORMAT_RGBH,
  FORMAT_RGBAH,
  FORMAT_RGBE9995,
  FORMAT_DXT1, //s3tc bc1
  FORMAT_DXT3, //bc2
  FORMAT_DXT5, //bc3
  FORMAT_RGTC_R,
  FORMAT_RGTC_RG,
  FORMAT_BPTC_RGBA, //btpc bc7
  FORMAT_BPTC_RGBF, //float bc6h
  FORMAT_BPTC_RGBFU, //unsigned float bc6hu
  FORMAT_ETC, //etc1
  FORMAT_ETC2_R11, //etc2
  FORMAT_ETC2_R11S, //signed, NOT srgb.
  FORMAT_ETC2_RG11,
  FORMAT_ETC2_RG11S,
  FORMAT_ETC2_RGB8,
  FORMAT_ETC2_RGBA8,
  FORMAT_ETC2_RGB8A1,
  FORMAT_ETC2_RA_AS_RG, //used to make basis universal happy
  FORMAT_DXT5_RA_AS_RG, //used to make basis universal happy
  FORMAT_ASTC_4x4,
  FORMAT_ASTC_4x4_HDR,
  FORMAT_ASTC_8x8,
  FORMAT_ASTC_8x8_HDR,
  FORMAT_MAX
};

export const enum DataFormat {
  DATA_FORMAT_IMAGE,
  DATA_FORMAT_PNG,
  DATA_FORMAT_WEBP,
  DATA_FORMAT_BASIS_UNIVERSAL,
};

  // @ts-ignore
const enum Version {
  FORMAT_VERSION = 1
};

  // @ts-ignore
const enum FormatBits {
  FORMAT_BIT_STREAM = 1 << 22,
  FORMAT_BIT_HAS_MIPMAPS = 1 << 23,
  FORMAT_BIT_DETECT_3D = 1 << 24,
  //FORMAT_BIT_DETECT_SRGB = 1 << 25,
  FORMAT_BIT_DETECT_NORMAL = 1 << 26,
  FORMAT_BIT_DETECT_ROUGNESS = 1 << 27,
};


export function get_format_pixel_size(p_format: ImageFormat) {
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

export function get_format_pixel_rshift(p_format: ImageFormat) {
	if (p_format == ImageFormat.FORMAT_ASTC_8x8) {
		return 2;
	} else if (p_format == ImageFormat.FORMAT_DXT1 || p_format == ImageFormat.FORMAT_RGTC_R || p_format == ImageFormat.FORMAT_ETC || p_format == ImageFormat.FORMAT_ETC2_R11 ||
             p_format == ImageFormat.FORMAT_ETC2_R11S || p_format == ImageFormat.FORMAT_ETC2_RGB8 || p_format == ImageFormat.FORMAT_ETC2_RGB8A1) {
		return 1;
	} else {
		return 0;
	}
}

export function get_format_block_size(p_format: ImageFormat) {
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