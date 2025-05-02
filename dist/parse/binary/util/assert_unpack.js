import { String, StringName } from "../variant";
export function unwrap_string(variant) {
    if (!(variant instanceof String || variant instanceof StringName)) {
        throw new Error("Attempted to Unwrap String, but not String or StringName");
    }
    const str = variant;
    return str.value;
}
export function assertType(variantT, type) {
    if (variantT.type !== type) {
        throw new Error(`Assert Fail: Expected ${type} and got ${variantT.type}`);
    }
    return variantT;
}
export function unwrap_props(resource) {
    const response = {};
    resource.props.forEach(prop => {
        response[prop.name] = prop.value;
    });
    return response;
}
export function unwrap_dictionary(dictionary) {
    const result = {};
    [...dictionary.value.entries()].forEach(([key, val]) => {
        if (!(key instanceof String || key instanceof StringName)) {
            throw new Error("Dictionary key not String or StringName");
        }
        const keyStr = key;
        result[keyStr.value] = val;
    });
    return result;
}
