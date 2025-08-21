import { InternalResourceEntry } from "../../parse/binary/resource.js";
import { assertType, unwrap_value } from "../../parse/binary/util/assert_unpack.js";
import { Dictionary, Array as ArrayT, VariantType, NodePath } from "../../parse/binary/variant.js";

export type LinkRef = { type: 'ref', value: InternalResourceEntry };

export function unwrap_property_array<T>(properties: Record<string,any>, field: string, keys: string[]): T[] {
  const ret: T[] = [];
  let idx = 0;
  while(properties[`${field}/${idx}/${keys[0]}`]) {
    const entry = {} as any;
    keys.forEach(k => {
      entry[k] = properties[`${field}/${idx}/${k}`] as any;
    })
    idx++;
    ret.push(entry);
  }
  return ret;
} 
export function unwrap_property_paths<T>(properties: Record<string,any>): T {
  const result: Record<string,any> = {};
  for(const [path, val] of Object.entries(properties)) {
    const parts = path.split('/');
    const key = parts.pop()!;
    let root = result;
    while(parts.length) {
      const path = parts.shift()!;
      root = (root[path] = (root[path] || {}));
    }
    root[key] = val;
  }
  return result as T;
}

export function unwrap_array(array: VariantType): VariantType[] {
  return assertType<ArrayT>(array, "array").value;
}

export function unwrap_dictionary(dictionary: Dictionary) {
  const result: Record<string, VariantType> = {};
  [...dictionary.value.entries()].forEach(([key, val]) => {
    const keyVal = unwrap_value(key);
    if (typeof keyVal == 'object') throw new Error('Attempted to unwrap Dictionary with key type "object"');
    result[keyVal as string] = val;
  });
  return result;
}

export function unwrap_property<T>(v: VariantType): T {
  if (v.type == 'array') {
    return unwrap_array(v).map(unwrap_property) as T
  }
  if (v.type == 'dictionary') {
    const dict = unwrap_dictionary(<Dictionary>v);
    for (const [k, v] of Object.entries(dict)) {
      dict[k] = unwrap_property(v);
    }
    return dict as T;
  }
  if (v.type == 'ref') {
    const ref = (<LinkRef>v).value as InternalResourceEntry;
    if (ref.properties)
      return { type: ref.type, properties: unwrap_properties(ref.properties) } as T;
  }
  if('properties' in v) {
      return { type: v.type, properties: unwrap_properties(v.properties as Record<string, VariantType>)} as T;
  }
  if(v.type == 'nodepath') {
    const ref = <NodePath>v;
    const result = Object.assign({}, ref);
    result.names = <any>result.names.map(x => x.value)
    result.subnames = <any>result.subnames.map(x => x.value)
    return result as T;
  }

  if ('value' in v) {
    if(Array.isArray(v.value) && !('byteLength' in v.value)) { 
      v.value = v.value.map(unwrap_property)
    }
    return v.value as T;
  }
  return v as T;
}

export function unwrap_properties<T extends Record<string, any>>(properties: Record<string, VariantType>): T {
  const result = {} as Record<string, any>;
  for (const [k, v] of Object.entries(properties)) {
    result[k] = unwrap_property(v);
  }
  return result as T;
}