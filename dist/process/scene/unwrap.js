import { assertType, unwrap_value } from "../../parse/binary/util/assert_unpack";
export function unwrap_property_array(properties, field, keys) {
    const ret = [];
    let idx = 0;
    while (properties[`${field}/${idx}/${keys[0]}`]) {
        const entry = {};
        keys.forEach(k => {
            entry[k] = properties[`${field}/${idx}/${k}`];
        });
        idx++;
        ret.push(entry);
    }
    return ret;
}
export function unwrap_array(array) {
    return assertType(array, "array").value;
}
export function unwrap_dictionary(dictionary) {
    const result = {};
    [...dictionary.value.entries()].forEach(([key, val]) => {
        const keyVal = unwrap_value(key);
        if (typeof keyVal == 'object')
            throw new Error('Attempted to unwrap Dictionary with key type "object"');
        result[keyVal] = val;
    });
    return result;
}
export function unwrap_property(v) {
    if (v.type == 'array') {
        return unwrap_array(v).map(unwrap_property);
    }
    if (v.type == 'dictionary') {
        const dict = unwrap_dictionary(v);
        for (const [k, v] of Object.entries(dict)) {
            dict[k] = unwrap_property(v);
        }
        return dict;
    }
    if (v.type == 'ref') {
        const ref = v.value;
        if (ref.properties)
            return { type: ref.type, properties: unwrap_properties(ref.properties) };
    }
    if (v.type == 'nodepath') {
        const ref = v;
        const result = Object.assign({}, ref);
        result.names = result.names.map(x => x.value);
        result.subnames = result.subnames.map(x => x.value);
        return result;
    }
    if ('value' in v) {
        if (Array.isArray(v.value) && !('byteLength' in v.value)) {
            v.value = v.value.map(unwrap_property);
        }
        return v.value;
    }
    return v;
}
export function unwrap_properties(properties) {
    const result = {};
    for (const [k, v] of Object.entries(properties)) {
        result[k] = unwrap_property(v);
    }
    return result;
}
