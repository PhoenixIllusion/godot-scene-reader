import { InternalResourceEntry } from "../resource";
import { Dictionary, String, StringName, VariantType } from "../variant";

export function unwrap_string(variant: VariantType): string {
  if(!(variant instanceof String || variant instanceof StringName)) {
    throw new Error("Attempted to Unwrap String, but not String or StringName")
  }
  const str = variant as (String|StringName);
  return str.value;
}

export function assertType<T>(variantT: VariantType, type: string): T {
  if(variantT.type !== type) {
    throw new Error(`Assert Fail: Expected ${type} and got ${variantT.type}`);
  }
  return variantT as T;
}

export function unwrap_props( resource: InternalResourceEntry) {
  const response: Record<string, VariantType> = {}
  resource.props.forEach(prop => {
    response[prop.name] = prop.value;
  });
  return response;
}

export function unwrap_dictionary(dictionary: Dictionary) {
  const result: Record<string, VariantType> = {};
  [... dictionary.value.entries()].forEach(([key,val]) => {
    if(!(key instanceof String || key instanceof StringName)) {
      throw new Error("Dictionary key not String or StringName")
    }
    const keyStr = key as (String|StringName);
    result[keyStr.value] = val;
  });
  return result;
}