import { Array, Dictionary, String, StringName, VariantType } from "../variant.js";

export function unwrap_string(variant: VariantType): string {
  if (!(variant.type == 'string' || variant.type == 'stringname')) {
    throw new Error("Attempted to Unwrap String, but not String or StringName")
  }
  const str = variant as (String | StringName);
  return str.value;
}

export function assertType<T>(variantT: VariantType, type: string): T {
  if (variantT.type !== type) {
    throw new Error(`Assert Fail: Expected ${type} and got ${variantT.type}`);
  }
  return variantT as T;
}

export function unwrap_dictionary(dictionary: Dictionary) {
  const result: Record<string, VariantType> = {};
  [...dictionary.value.entries()].forEach(([key, val]) => {
    if (!(key.type == 'string' || key.type == 'stringname')) {
      throw new Error("Dictionary key not String or StringName")
    }
    const keyStr = key as (String | StringName);
    result[keyStr.value] = val;
  });
  return result;
}

export function unwrap_array(array: VariantType): VariantType[] {
  return assertType<Array>(array, "array").value;
}

export function unwrap_array_map<T>(array: VariantType, type: string): T[] {
  return assertType<Array>(array, "array").value.map(x => assertType<T>(x, type));
}

export function unwrap_value<T>(variant: VariantType): T {
  if (typeof variant !== 'object' || !('value' in variant))
    throw new Error(`Assert Fail: Attempted to unwrap non-value variant: ${variant.type}`);
  return variant.value as T;
}