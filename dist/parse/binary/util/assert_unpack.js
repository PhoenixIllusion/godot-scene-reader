export function unwrap_string(variant) {
    if (!(variant.type == 'string' || variant.type == 'stringname')) {
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
export function unwrap_dictionary(dictionary) {
    const result = {};
    [...dictionary.value.entries()].forEach(([key, val]) => {
        if (!(key.type == 'string' || key.type == 'stringname')) {
            throw new Error("Dictionary key not String or StringName");
        }
        const keyStr = key;
        result[keyStr.value] = val;
    });
    return result;
}
export function unwrap_array(array) {
    return assertType(array, "array").value;
}
export function unwrap_array_map(array, type) {
    return assertType(array, "array").value.map(x => assertType(x, type));
}
export function unwrap_value(variant) {
    if (typeof variant !== 'object' || !('value' in variant))
        throw new Error(`Assert Fail: Attempted to unwrap non-value variant: ${variant.type}`);
    return variant.value;
}
