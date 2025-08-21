import { decoder } from "../../util/data-reader.js";
import * as Variant from './variant.js';
const HEADER_TYPE_MASK = 0xFF;
const HEADER_DATA_FLAG_64 = (1 << 16);
const HEADER_DATA_FIELD_TYPED_ARRAY_MASK = (0b11 << 16);
const HEADER_DATA_FIELD_TYPED_ARRAY_NONE = (0b00 << 16);
const HEADER_DATA_FIELD_TYPED_ARRAY_BUILTIN = (0b01 << 16);
const HEADER_DATA_FIELD_TYPED_ARRAY_CLASS_NAME = (0b10 << 16);
const HEADER_DATA_FIELD_TYPED_ARRAY_SCRIPT = (0b11 << 16);
// @ts-ignore
const HEADER_DATA_FLAG_OBJECT_AS_ID = (1 << 16);
export var VariantMarshaller;
(function (VariantMarshaller) {
    VariantMarshaller[VariantMarshaller["NIL"] = 0] = "NIL";
    VariantMarshaller[VariantMarshaller["BOOL"] = 1] = "BOOL";
    VariantMarshaller[VariantMarshaller["INT"] = 2] = "INT";
    VariantMarshaller[VariantMarshaller["FLOAT"] = 3] = "FLOAT";
    VariantMarshaller[VariantMarshaller["STRING"] = 4] = "STRING";
    VariantMarshaller[VariantMarshaller["VECTOR2"] = 5] = "VECTOR2";
    VariantMarshaller[VariantMarshaller["VECTOR2I"] = 6] = "VECTOR2I";
    VariantMarshaller[VariantMarshaller["RECT2"] = 7] = "RECT2";
    VariantMarshaller[VariantMarshaller["RECT2I"] = 8] = "RECT2I";
    VariantMarshaller[VariantMarshaller["VECTOR3"] = 9] = "VECTOR3";
    VariantMarshaller[VariantMarshaller["VECTOR3I"] = 10] = "VECTOR3I";
    VariantMarshaller[VariantMarshaller["TRANSFORM2D"] = 11] = "TRANSFORM2D";
    VariantMarshaller[VariantMarshaller["VECTOR4"] = 12] = "VECTOR4";
    VariantMarshaller[VariantMarshaller["VECTOR4I"] = 13] = "VECTOR4I";
    VariantMarshaller[VariantMarshaller["PLANE"] = 14] = "PLANE";
    VariantMarshaller[VariantMarshaller["QUATERNION"] = 15] = "QUATERNION";
    VariantMarshaller[VariantMarshaller["AABB"] = 16] = "AABB";
    VariantMarshaller[VariantMarshaller["BASIS"] = 17] = "BASIS";
    VariantMarshaller[VariantMarshaller["TRANSFORM3D"] = 18] = "TRANSFORM3D";
    VariantMarshaller[VariantMarshaller["PROJECTION"] = 19] = "PROJECTION";
    VariantMarshaller[VariantMarshaller["COLOR"] = 20] = "COLOR";
    VariantMarshaller[VariantMarshaller["STRING_NAME"] = 21] = "STRING_NAME";
    VariantMarshaller[VariantMarshaller["NODE_PATH"] = 22] = "NODE_PATH";
    VariantMarshaller[VariantMarshaller["RID"] = 23] = "RID";
    VariantMarshaller[VariantMarshaller["OBJECT"] = 24] = "OBJECT";
    VariantMarshaller[VariantMarshaller["CALLABLE"] = 25] = "CALLABLE";
    VariantMarshaller[VariantMarshaller["SIGNAL"] = 26] = "SIGNAL";
    VariantMarshaller[VariantMarshaller["DICTIONARY"] = 27] = "DICTIONARY";
    VariantMarshaller[VariantMarshaller["ARRAY"] = 28] = "ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_BYTE_ARRAY"] = 29] = "PACKED_BYTE_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_INT32_ARRAY"] = 30] = "PACKED_INT32_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_INT64_ARRAY"] = 31] = "PACKED_INT64_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_FLOAT32_ARRAY"] = 32] = "PACKED_FLOAT32_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_FLOAT64_ARRAY"] = 33] = "PACKED_FLOAT64_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_STRING_ARRAY"] = 34] = "PACKED_STRING_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_VECTOR2_ARRAY"] = 35] = "PACKED_VECTOR2_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_VECTOR3_ARRAY"] = 36] = "PACKED_VECTOR3_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_COLOR_ARRAY"] = 37] = "PACKED_COLOR_ARRAY";
    VariantMarshaller[VariantMarshaller["PACKED_VECTOR4_ARRAY"] = 38] = "PACKED_VECTOR4_ARRAY";
    VariantMarshaller[VariantMarshaller["VARIANT_MAX"] = 39] = "VARIANT_MAX";
})(VariantMarshaller || (VariantMarshaller = {}));
export function decode_variant(kind, f) {
    const float = (kind & HEADER_DATA_FLAG_64) ? f.get_double.bind(f) : f.get_float.bind(f);
    function _advance_padding(p_len) {
        const extra = 4 - (p_len % 4);
        if (extra < 4) {
            for (let i = 0; i < extra; i++) {
                f.get_8(); //pad to 32
            }
        }
    }
    switch (kind & HEADER_TYPE_MASK) {
        case VariantMarshaller.NIL:
            return new Variant.Nil();
        case VariantMarshaller.BOOL:
            return new Variant.Boolean(!!f.get_32());
        case VariantMarshaller.INT:
            if (kind & HEADER_DATA_FLAG_64)
                return new Variant.Integer64(f.get_S64bi());
            return new Variant.Integer(f.get_S32());
        case VariantMarshaller.FLOAT:
            return new Variant.Float(float());
        case VariantMarshaller.STRING: {
            const len = f.get_32();
            const ret = decoder.decode(f.get_buffer(len));
            while (f.get_position() % 4)
                f.skip(1);
            return new Variant.String(ret);
        }
        case VariantMarshaller.VECTOR2: {
            return Object.assign(new Variant.Vector2(), { x: float(), y: float() });
        }
        case VariantMarshaller.VECTOR2I: {
            return Object.assign(new Variant.Vector2i(), { x: f.get_32(), y: f.get_32() });
        }
        case VariantMarshaller.RECT2: {
            const ret = new Variant.Rect2();
            Object.assign(ret.position, { x: float(), y: float() });
            Object.assign(ret.size, { x: float(), y: float() });
            return ret;
        }
        case VariantMarshaller.RECT2I: {
            const ret = new Variant.Rect2i();
            Object.assign(ret.position, { x: f.get_32(), y: f.get_32() });
            Object.assign(ret.size, { x: f.get_32(), y: f.get_32() });
            return ret;
        }
        case VariantMarshaller.VECTOR3: {
            return Object.assign(new Variant.Vector3(), { x: float(), y: float(), z: float() });
        }
        case VariantMarshaller.VECTOR3I: {
            return Object.assign(new Variant.Vector3i(), { x: f.get_32(), y: f.get_32(), z: f.get_32() });
        }
        case VariantMarshaller.VECTOR4: {
            return Object.assign(new Variant.Vector4(), { x: float(), y: float(), z: float(), w: float() });
        }
        case VariantMarshaller.VECTOR4I: {
            return Object.assign(new Variant.Vector4i(), { x: f.get_32(), y: f.get_32(), z: f.get_32(), w: f.get_32() });
        }
        case VariantMarshaller.TRANSFORM2D: {
            const ret = new Variant.Transform2D();
            for (let i = 0; i < 3; i++) {
                ret.columns[i].x = float();
                ret.columns[i].y = float();
            }
            return ret;
        }
        case VariantMarshaller.PLANE: {
            const ret = new Variant.Plane();
            Object.assign(ret.normal, { x: float(), y: float(), z: float() });
            ret.d = float();
            return ret;
        }
        case VariantMarshaller.QUATERNION: {
            return Object.assign(new Variant.Quaternion(), { x: float(), y: float(), z: float(), w: float() });
        }
        case VariantMarshaller.AABB: {
            const ret = new Variant.AABB();
            Object.assign(ret.position, { x: float(), y: float(), z: float() });
            Object.assign(ret.size, { x: float(), y: float(), z: float() });
            return ret;
        }
        case VariantMarshaller.BASIS: {
            const ret = new Variant.Basis();
            Object.assign(ret.rows[0], { x: float(), y: float(), z: float() });
            Object.assign(ret.rows[1], { x: float(), y: float(), z: float() });
            Object.assign(ret.rows[2], { x: float(), y: float(), z: float() });
            return ret;
        }
        case VariantMarshaller.TRANSFORM3D: {
            const ret = new Variant.Transform3D();
            const { basis, origin } = ret;
            Object.assign(basis.rows[0], { x: float(), y: float(), z: float() });
            Object.assign(basis.rows[1], { x: float(), y: float(), z: float() });
            Object.assign(basis.rows[2], { x: float(), y: float(), z: float() });
            Object.assign(origin, { x: float(), y: float(), z: float() });
            return ret;
        }
        case VariantMarshaller.PROJECTION: {
            const ret = new Variant.Projection();
            for (let i = 0; i < 4; i++) {
                Object.assign(ret.columns[i], { x: float(), y: float(), z: float(), w: float() });
            }
            return ret;
        }
        case VariantMarshaller.COLOR: {
            return Object.assign(new Variant.Color(), { r: f.get_float(), g: f.get_float(), b: f.get_float(), a: f.get_float() });
        }
        case VariantMarshaller.STRING_NAME: {
            const len = f.get_32();
            const ret = decoder.decode(f.get_buffer(len));
            while (f.get_position() % 4)
                f.skip(1);
            return new Variant.StringName(ret);
        }
        case VariantMarshaller.NODE_PATH: {
            let strlen = f.get_32();
            if (strlen & 0x80000000) {
                const names = [];
                const subnames = [];
                const namecount = strlen &= 0x7FFFFFFF;
                let subnamecount = f.get_32();
                const np_flags = f.get_32();
                if (np_flags & 2) { // Obsolete format with property separate from subpath.
                    subnamecount++;
                }
                const total = namecount + subnamecount;
                for (let i = 0; i < total; i++) {
                    const str = decode_variant(21, f);
                    if (i < namecount) {
                        names.push(str);
                    }
                    else {
                        subnames.push(str);
                    }
                }
                return new Variant.NodePath(names, subnames, (np_flags & 1) > 0);
            }
            throw new Error("NodeNames: Data passed is invalid, Old Format");
        }
        case VariantMarshaller.RID: {
            return new Variant.VariantRID(f.get_64());
        }
        case VariantMarshaller.OBJECT: {
            if (kind & HEADER_DATA_FLAG_OBJECT_AS_ID) {
                const object_id = f.get_64bi();
                if (object_id == 0n) {
                    return { type: "null_pointer", properties: {} };
                }
                return { type: "EncodedObjectAsID", properties: { object_id: new Variant.Integer64(object_id) } };
            }
            const type = decode_variant(4, f).value;
            if (!(type?.length)) {
                return { type: "null_pointer", properties: {} };
            }
            const properties = {};
            const count = f.get_32();
            for (let i = 0; i < count; i++) {
                const key = decode_variant(4, f);
                const val_t = f.get_32();
                const val = decode_variant(val_t, f);
                properties[key.value] = val;
            }
            return { type, properties };
        }
        case VariantMarshaller.CALLABLE: {
            return new Variant.Callable();
        }
        case VariantMarshaller.SIGNAL: {
            const ret = new Variant.Signal();
            ret.name = decode_variant(4, f);
            ret.object_id = new Variant.Integer64(f.get_64bi());
            return ret;
        }
        case VariantMarshaller.DICTIONARY: {
            const count = f.get_32();
            const ret = new Variant.Dictionary();
            for (let i = 0; i < count; i++) {
                const key_t = f.get_32();
                const key = decode_variant(key_t, f);
                const val_t = f.get_32();
                const val = decode_variant(val_t, f);
                ret.value.set(key, val);
            }
            return ret;
        }
        case VariantMarshaller.ARRAY: {
            const ret = new Variant.Array();
            switch (kind & HEADER_DATA_FIELD_TYPED_ARRAY_MASK) {
                case HEADER_DATA_FIELD_TYPED_ARRAY_NONE:
                    break; // Untyped array.
                case HEADER_DATA_FIELD_TYPED_ARRAY_BUILTIN: {
                    ret.builtin_type = new Variant.Integer(f.get_32());
                    break;
                }
                case HEADER_DATA_FIELD_TYPED_ARRAY_CLASS_NAME:
                    {
                        ret.builtin_type = new Variant.Integer(VariantMarshaller.OBJECT);
                        ret.class_name = decode_variant(4, f);
                    }
                    break;
                case HEADER_DATA_FIELD_TYPED_ARRAY_SCRIPT:
                    {
                        ret.builtin_type = new Variant.Integer(VariantMarshaller.OBJECT);
                        ret.script = decode_variant(4, f);
                    }
                    break;
            }
            const count = f.get_32() & 0x7FFFFFFF;
            for (let i = 0; i < count; i++) {
                const key_t = f.get_32();
                const val = decode_variant(key_t, f);
                ret.value.push(val);
            }
            return ret;
        }
        case VariantMarshaller.PACKED_BYTE_ARRAY: {
            const len = f.get_32();
            const array = new Variant.PackedByteArray();
            array.value = new Uint8Array(len);
            array.value.set(f.get_buffer(len), 0);
            _advance_padding(len);
            return array;
        }
        case VariantMarshaller.PACKED_INT32_ARRAY: {
            const len = f.get_32();
            const array = new Variant.PackedInt32Array();
            array.value = new Int32Array(len);
            for (let i = 0; i < len; i++) {
                array.value[i] = f.get_32();
            }
            return array;
        }
        case VariantMarshaller.PACKED_INT64_ARRAY: {
            const len = f.get_32();
            const array = new Variant.PackedInt64Array();
            array.value = new BigInt64Array(len);
            for (let i = 0; i < len; i++) {
                array.value[i] = f.get_64bi();
            }
            return array;
        }
        case VariantMarshaller.PACKED_FLOAT32_ARRAY: {
            const len = f.get_32();
            const array = new Variant.PackedF32Array();
            array.value = new Float32Array(len);
            for (let i = 0; i < len; i++) {
                array.value[i] = f.get_float();
            }
            return array;
        }
        case VariantMarshaller.PACKED_FLOAT64_ARRAY: {
            const len = f.get_32();
            const array = new Variant.PackedF64Array();
            array.value = new Float64Array(len);
            for (let i = 0; i < len; i++) {
                array.value[i] = f.get_double();
            }
            return array;
        }
        case VariantMarshaller.PACKED_STRING_ARRAY: {
            const res = new Variant.PackedStringArray();
            const count = f.get_32();
            for (let i = 0; i < count; i++) {
                const len = f.get_32();
                res.value.push(new Variant.String(decoder.decode(f.get_buffer(len - 1))));
                f.skip(1);
                while (f.get_position() % 4)
                    f.skip(1);
            }
            return res;
        }
        case VariantMarshaller.PACKED_VECTOR2_ARRAY: {
            const res = new Variant.PackedVector2Array();
            const count = f.get_32();
            for (let i = 0; i < count; i++) {
                res.value.push(Object.assign(new Variant.Vector2(), { x: float(), y: float() }));
            }
            return res;
        }
        case VariantMarshaller.PACKED_VECTOR3_ARRAY: {
            const res = new Variant.PackedVector3Array();
            const count = f.get_32();
            for (let i = 0; i < count; i++) {
                res.value.push(Object.assign(new Variant.Vector3(), { x: float(), y: float(), z: float() }));
            }
            return res;
        }
        case VariantMarshaller.PACKED_COLOR_ARRAY: {
            const res = new Variant.PackedColorArray();
            const count = f.get_32();
            for (let i = 0; i < count; i++) {
                res.value.push(Object.assign(new Variant.Color(), { r: f.get_float(), g: f.get_float(), b: f.get_float(), a: f.get_float() }));
            }
            return res;
        }
        case VariantMarshaller.PACKED_VECTOR4_ARRAY: {
            const res = new Variant.PackedVector4Array();
            const count = f.get_32();
            for (let i = 0; i < count; i++) {
                res.value.push(Object.assign(new Variant.Vector4(), { x: float(), y: float(), z: float(), w: float() }));
            }
            return res;
        }
    }
    throw new Error(`Unable to unmarshall Variant Type ${kind}`);
}
