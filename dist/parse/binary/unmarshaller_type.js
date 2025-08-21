import { VariantMarshaller } from "./unmarshaller.js";
export function unmarshaller_type_as_string(type) {
    switch (type) {
        case VariantMarshaller.NIL: return 'NIL';
        case VariantMarshaller.BOOL: return 'BOOL';
        case VariantMarshaller.INT: return 'INT';
        case VariantMarshaller.FLOAT: return 'FLOAT';
        case VariantMarshaller.STRING: return 'STRING';
        case VariantMarshaller.VECTOR2: return 'VECTOR2';
        case VariantMarshaller.VECTOR2I: return 'VECTOR2I';
        case VariantMarshaller.RECT2: return 'RECT2';
        case VariantMarshaller.RECT2I: return 'RECT2I';
        case VariantMarshaller.VECTOR3: return 'VECTOR3';
        case VariantMarshaller.VECTOR3I: return 'VECTOR3I';
        case VariantMarshaller.TRANSFORM2D: return 'TRANSFORM2D';
        case VariantMarshaller.VECTOR4: return 'VECTOR4';
        case VariantMarshaller.VECTOR4I: return 'VECTOR4I';
        case VariantMarshaller.PLANE: return 'PLANE';
        case VariantMarshaller.QUATERNION: return 'QUATERNION';
        case VariantMarshaller.AABB: return 'AABB';
        case VariantMarshaller.BASIS: return 'BASIS';
        case VariantMarshaller.TRANSFORM3D: return 'TRANSFORM3D';
        case VariantMarshaller.PROJECTION: return 'PROJECTION';
        case VariantMarshaller.COLOR: return 'COLOR';
        case VariantMarshaller.STRING_NAME: return 'STRING_NAME';
        case VariantMarshaller.NODE_PATH: return 'NODE_PATH';
        case VariantMarshaller.RID: return 'RID';
        case VariantMarshaller.OBJECT: return 'OBJECT';
        case VariantMarshaller.CALLABLE: return 'CALLABLE';
        case VariantMarshaller.SIGNAL: return 'SIGNAL';
        case VariantMarshaller.DICTIONARY: return 'DICTIONARY';
        case VariantMarshaller.ARRAY: return 'ARRAY';
        case VariantMarshaller.PACKED_BYTE_ARRAY: return 'PACKED_BYTE_ARRAY';
        case VariantMarshaller.PACKED_INT32_ARRAY: return 'PACKED_INT32_ARRAY';
        case VariantMarshaller.PACKED_INT64_ARRAY: return 'PACKED_INT64_ARRAY';
        case VariantMarshaller.PACKED_FLOAT32_ARRAY: return 'PACKED_FLOAT32_ARRAY';
        case VariantMarshaller.PACKED_FLOAT64_ARRAY: return 'PACKED_FLOAT64_ARRAY';
        case VariantMarshaller.PACKED_STRING_ARRAY: return 'PACKED_STRING_ARRAY';
        case VariantMarshaller.PACKED_VECTOR2_ARRAY: return 'PACKED_VECTOR2_ARRAY';
        case VariantMarshaller.PACKED_VECTOR3_ARRAY: return 'PACKED_VECTOR3_ARRAY';
        case VariantMarshaller.PACKED_COLOR_ARRAY: return 'PACKED_COLOR_ARRAY';
        case VariantMarshaller.PACKED_VECTOR4_ARRAY: return 'PACKED_VECTOR4_ARRAY';
    }
    throw new Error(`Unknown Unmarshaller Type: ${type}`);
}
