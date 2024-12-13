import { decoder } from "../../util/data-reader";
import { GodotReader } from "./util/reader";

const HEADER_TYPE_MASK = 0xFF;
const HEADER_DATA_FLAG_64 = (1 << 16)

const HEADER_DATA_FLAG_OBJECT_AS_ID = (1 << 16)
const KINDS = ['NIL', 'BOOL', 'INT', 'FLOAT', 'STRING', 'VECTOR2', 'VECTOR2I', 'RECT2', 'RECT2I', 'VECTOR3', 'VECTOR3I', 'TRANSFORM2D', 'VECTOR4', 'VECTOR4I', 'PLANE', 'QUATERNION', 'AABB', 'BASIS', 'TRANSFORM3D', 'PROJECTION', 'COLOR', 'STRING_NAME', 'NODE_PATH', 'RID', 'OBJECT', 'CALLABLE', 'SIGNAL', 'DICTIONARY', 'ARRAY', 'PACKED_BYTE_ARRAY', 'PACKED_INT32_ARRAY', 'PACKED_INT64_ARRAY', 'PACKED_FLOAT32_ARRAY', 'PACKED_FLOAT64_ARRAY', 'PACKED_STRING_ARRAY', 'PACKED_VECTOR2_ARRAY', 'PACKED_VECTOR3_ARRAY', 'PACKED_COLOR_ARRAY', 'PACKED_VECTOR4_ARRAY', 'VARIANT_MAX'];

export function unmarshaller_type_as_string(kind: number) {
  return KINDS[kind & HEADER_TYPE_MASK]
}

export function decode_variant(kind: number, f: GodotReader) {
  const kind_s = unmarshaller_type_as_string(kind);
  if(kind_s == 'STRING') {
    const len = f.get_32()
    const ret = decoder.decode(f.get_buffer(len));
    while(f.get_position() % 4)f.skip(1);
    return ret;
  }
  if(kind_s == 'STRING_NAME') {
    const len = f.get_32()
    const ret = decoder.decode(f.get_buffer(len));
    while(f.get_position() % 4)f.skip(1);
    return ret;
  }
  if(kind_s == 'PACKED_STRING_ARRAY') {
    const res: string[] = [];
    const count = f.get_32()
    for(let i=0;i<count;i++) {
      const len = f.get_32()
      res.push(decoder.decode(f.get_buffer(len-1)));
      f.skip(1);
      while(f.get_position() % 4)f.skip(1);
    }
    return res;
  }
  if(kind_s == 'BOOL') {
    return !!f.get_32()
  }
  if(kind_s == 'INT') {
    if(kind & HEADER_DATA_FLAG_64)
      return f.get_S64();
    return f.get_S32()
  }
  if(kind_s == 'FLOAT') {
    if(kind & HEADER_DATA_FLAG_64)
      return f.get_double();
    return f.get_float()
  }
  if(kind_s == 'ARRAY') {
    const ret: any[] = [];
    const count = f.get_32();
    for(let i=0;i<count;i++) {
      const key_t = f.get_32()
      const val = decode_variant(key_t, f);
      ret.push(val);
    }
    return ret;
  }
  if(kind_s == 'OBJECT') {
    const name: string = decode_variant(4, f) as string;
    const props = new Map();
    const count = f.get_32();
    for(let i=0;i<count;i++) {
      const key = decode_variant(4, f);
      const val_t = f.get_32()
      const val = decode_variant(val_t, f);
      props.set(key, val);
    }
    return { name, props } 
  }
  if(kind_s == 'DICTIONARY') {
    const count = f.get_32();
    const ret = new Map();
    for(let i=0;i<count;i++) {
      const key_t = f.get_32()
      const key = decode_variant(key_t, f);
      const val_t = f.get_32()
      const val = decode_variant(val_t, f);
      ret.set(key, val);
    }
    return ret;
  }

  return kind;
}