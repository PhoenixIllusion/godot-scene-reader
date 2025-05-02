export declare const enum ImageFormat {
    FORMAT_L8 = 0,//luminance
    FORMAT_LA8 = 1,//luminance-alpha
    FORMAT_R8 = 2,
    FORMAT_RG8 = 3,
    FORMAT_RGB8 = 4,
    FORMAT_RGBA8 = 5,
    FORMAT_RGBA4444 = 6,
    FORMAT_RGB565 = 7,
    FORMAT_RF = 8,//float
    FORMAT_RGF = 9,
    FORMAT_RGBF = 10,
    FORMAT_RGBAF = 11,
    FORMAT_RH = 12,//half float
    FORMAT_RGH = 13,
    FORMAT_RGBH = 14,
    FORMAT_RGBAH = 15,
    FORMAT_RGBE9995 = 16,
    FORMAT_DXT1 = 17,//s3tc bc1
    FORMAT_DXT3 = 18,//bc2
    FORMAT_DXT5 = 19,//bc3
    FORMAT_RGTC_R = 20,
    FORMAT_RGTC_RG = 21,
    FORMAT_BPTC_RGBA = 22,//btpc bc7
    FORMAT_BPTC_RGBF = 23,//float bc6h
    FORMAT_BPTC_RGBFU = 24,//unsigned float bc6hu
    FORMAT_ETC = 25,//etc1
    FORMAT_ETC2_R11 = 26,//etc2
    FORMAT_ETC2_R11S = 27,//signed, NOT srgb.
    FORMAT_ETC2_RG11 = 28,
    FORMAT_ETC2_RG11S = 29,
    FORMAT_ETC2_RGB8 = 30,
    FORMAT_ETC2_RGBA8 = 31,
    FORMAT_ETC2_RGB8A1 = 32,
    FORMAT_ETC2_RA_AS_RG = 33,//used to make basis universal happy
    FORMAT_DXT5_RA_AS_RG = 34,//used to make basis universal happy
    FORMAT_ASTC_4x4 = 35,
    FORMAT_ASTC_4x4_HDR = 36,
    FORMAT_ASTC_8x8 = 37,
    FORMAT_ASTC_8x8_HDR = 38,
    FORMAT_MAX = 39
}
export declare const enum DataFormat {
    DATA_FORMAT_IMAGE = 0,
    DATA_FORMAT_PNG = 1,
    DATA_FORMAT_WEBP = 2,
    DATA_FORMAT_BASIS_UNIVERSAL = 3
}
export declare function get_format_pixel_size(p_format: ImageFormat): 4 | 0 | 1 | 2 | 8 | 16 | 12 | 3 | 6;
export declare function get_format_pixel_rshift(p_format: ImageFormat): 0 | 1 | 2;
export declare function get_format_block_size(p_format: ImageFormat): 4 | 1 | 8;
