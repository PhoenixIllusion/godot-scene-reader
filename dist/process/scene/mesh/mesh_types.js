export var BlendShapeMode;
(function (BlendShapeMode) {
    BlendShapeMode[BlendShapeMode["BLEND_SHAPE_MODE_NORMALIZED"] = 0] = "BLEND_SHAPE_MODE_NORMALIZED";
    BlendShapeMode[BlendShapeMode["BLEND_SHAPE_MODE_RELATIVE"] = 1] = "BLEND_SHAPE_MODE_RELATIVE";
})(BlendShapeMode || (BlendShapeMode = {}));
export var ArrayType;
(function (ArrayType) {
    ArrayType[ArrayType["ARRAY_VERTEX"] = 0] = "ARRAY_VERTEX";
    ArrayType[ArrayType["ARRAY_NORMAL"] = 1] = "ARRAY_NORMAL";
    ArrayType[ArrayType["ARRAY_TANGENT"] = 2] = "ARRAY_TANGENT";
    ArrayType[ArrayType["ARRAY_COLOR"] = 3] = "ARRAY_COLOR";
    ArrayType[ArrayType["ARRAY_TEX_UV"] = 4] = "ARRAY_TEX_UV";
    ArrayType[ArrayType["ARRAY_TEX_UV2"] = 5] = "ARRAY_TEX_UV2";
    ArrayType[ArrayType["ARRAY_CUSTOM0"] = 6] = "ARRAY_CUSTOM0";
    ArrayType[ArrayType["ARRAY_CUSTOM1"] = 7] = "ARRAY_CUSTOM1";
    ArrayType[ArrayType["ARRAY_CUSTOM2"] = 8] = "ARRAY_CUSTOM2";
    ArrayType[ArrayType["ARRAY_CUSTOM3"] = 9] = "ARRAY_CUSTOM3";
    ArrayType[ArrayType["ARRAY_BONES"] = 10] = "ARRAY_BONES";
    ArrayType[ArrayType["ARRAY_WEIGHTS"] = 11] = "ARRAY_WEIGHTS";
    ArrayType[ArrayType["ARRAY_INDEX"] = 12] = "ARRAY_INDEX";
    ArrayType[ArrayType["ARRAY_MAX"] = 13] = "ARRAY_MAX";
})(ArrayType || (ArrayType = {}));
export var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["PRIMITIVE_POINTS"] = 0] = "PRIMITIVE_POINTS";
    PrimitiveType[PrimitiveType["PRIMITIVE_LINES"] = 1] = "PRIMITIVE_LINES";
    PrimitiveType[PrimitiveType["PRIMITIVE_LINE_STRIP"] = 2] = "PRIMITIVE_LINE_STRIP";
    PrimitiveType[PrimitiveType["PRIMITIVE_TRIANGLES"] = 3] = "PRIMITIVE_TRIANGLES";
    PrimitiveType[PrimitiveType["PRIMITIVE_TRIANGLE_STRIP"] = 4] = "PRIMITIVE_TRIANGLE_STRIP";
    PrimitiveType[PrimitiveType["PRIMITIVE_MAX"] = 5] = "PRIMITIVE_MAX";
})(PrimitiveType || (PrimitiveType = {}));
export var ArrayCustomFormat;
(function (ArrayCustomFormat) {
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RGBA8_UNORM"] = 0] = "ARRAY_CUSTOM_RGBA8_UNORM";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RGBA8_SNORM"] = 1] = "ARRAY_CUSTOM_RGBA8_SNORM";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RG_HALF"] = 2] = "ARRAY_CUSTOM_RG_HALF";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RGBA_HALF"] = 3] = "ARRAY_CUSTOM_RGBA_HALF";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_R_FLOAT"] = 4] = "ARRAY_CUSTOM_R_FLOAT";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RG_FLOAT"] = 5] = "ARRAY_CUSTOM_RG_FLOAT";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RGB_FLOAT"] = 6] = "ARRAY_CUSTOM_RGB_FLOAT";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_RGBA_FLOAT"] = 7] = "ARRAY_CUSTOM_RGBA_FLOAT";
    ArrayCustomFormat[ArrayCustomFormat["ARRAY_CUSTOM_MAX"] = 8] = "ARRAY_CUSTOM_MAX";
})(ArrayCustomFormat || (ArrayCustomFormat = {}));
export var ArrayFormat;
(function (ArrayFormat) {
    /* ARRAY FORMAT FLAGS */
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_VERTEX"] = 1] = "ARRAY_FORMAT_VERTEX";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_NORMAL"] = 2] = "ARRAY_FORMAT_NORMAL";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_TANGENT"] = 4] = "ARRAY_FORMAT_TANGENT";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_COLOR"] = 8] = "ARRAY_FORMAT_COLOR";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_TEX_UV"] = 16] = "ARRAY_FORMAT_TEX_UV";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_TEX_UV2"] = 32] = "ARRAY_FORMAT_TEX_UV2";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM0"] = 64] = "ARRAY_FORMAT_CUSTOM0";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM1"] = 128] = "ARRAY_FORMAT_CUSTOM1";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM2"] = 256] = "ARRAY_FORMAT_CUSTOM2";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM3"] = 512] = "ARRAY_FORMAT_CUSTOM3";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_BONES"] = 1024] = "ARRAY_FORMAT_BONES";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_WEIGHTS"] = 2048] = "ARRAY_FORMAT_WEIGHTS";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_INDEX"] = 4096] = "ARRAY_FORMAT_INDEX";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_BLEND_SHAPE_MASK"] = 7] = "ARRAY_FORMAT_BLEND_SHAPE_MASK";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM_BASE"] = 13] = "ARRAY_FORMAT_CUSTOM_BASE";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM_BITS"] = 3] = "ARRAY_FORMAT_CUSTOM_BITS";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM_MASK"] = 7] = "ARRAY_FORMAT_CUSTOM_MASK";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM0_SHIFT"] = 13] = "ARRAY_FORMAT_CUSTOM0_SHIFT";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM1_SHIFT"] = 16] = "ARRAY_FORMAT_CUSTOM1_SHIFT";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM2_SHIFT"] = 19] = "ARRAY_FORMAT_CUSTOM2_SHIFT";
    ArrayFormat[ArrayFormat["ARRAY_FORMAT_CUSTOM3_SHIFT"] = 22] = "ARRAY_FORMAT_CUSTOM3_SHIFT";
    ArrayFormat[ArrayFormat["ARRAY_COMPRESS_FLAGS_BASE"] = 25] = "ARRAY_COMPRESS_FLAGS_BASE";
    ArrayFormat[ArrayFormat["ARRAY_FLAG_USE_2D_VERTICES"] = 33554432] = "ARRAY_FLAG_USE_2D_VERTICES";
    ArrayFormat[ArrayFormat["ARRAY_FLAG_USE_DYNAMIC_UPDATE"] = 67108864] = "ARRAY_FLAG_USE_DYNAMIC_UPDATE";
    ArrayFormat[ArrayFormat["ARRAY_FLAG_USE_8_BONE_WEIGHTS"] = 134217728] = "ARRAY_FLAG_USE_8_BONE_WEIGHTS";
    ArrayFormat[ArrayFormat["ARRAY_FLAG_USES_EMPTY_VERTEX_ARRAY"] = 268435456] = "ARRAY_FLAG_USES_EMPTY_VERTEX_ARRAY";
    ArrayFormat[ArrayFormat["ARRAY_FLAG_COMPRESS_ATTRIBUTES"] = 536870912] = "ARRAY_FLAG_COMPRESS_ATTRIBUTES";
})(ArrayFormat || (ArrayFormat = {}));
export const ARRAY_FLAG_MASK = 0xffffffffn;
// We leave enough room for up to 5 more compression flags.
export const ARRAY_FLAG_FORMAT_VERSION_BASE = ArrayFormat.ARRAY_COMPRESS_FLAGS_BASE + 10, ARRAY_FLAG_FORMAT_VERSION_SHIFT = ARRAY_FLAG_FORMAT_VERSION_BASE, 
// When changes are made to the mesh format, add a new version and use it for the CURRENT_VERSION.
ARRAY_FLAG_FORMAT_VERSION_1 = 0, ARRAY_FLAG_FORMAT_VERSION_2 = 1n << BigInt(ARRAY_FLAG_FORMAT_VERSION_SHIFT), ARRAY_FLAG_FORMAT_CURRENT_VERSION = ARRAY_FLAG_FORMAT_VERSION_2, ARRAY_FLAG_FORMAT_VERSION_MASK = 0xFF; // 8 bits version
