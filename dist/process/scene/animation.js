import { Quaternion, Vector3 } from "../../parse/binary/variant";
// Godot: /core/math/math_funcs.cpp#L96
// double Math::ease(double p_x, double p_c)
export function animation_transition_ease(p_x, p_c) {
    if (p_x < 0) {
        p_x = 0;
    }
    else if (p_x > 1.0) {
        p_x = 1.0;
    }
    if (p_c > 0) {
        if (p_c < 1.0) {
            return 1.0 - Math.pow(1.0 - p_x, 1.0 / p_c);
        }
        else {
            return Math.pow(p_x, p_c);
        }
    }
    else if (p_c < 0) {
        //inout ease
        if (p_x < 0.5) {
            return Math.pow(p_x * 2.0, -p_c) * 0.5;
        }
        else {
            return (1.0 - Math.pow(1.0 - (p_x - 0.5) * 2.0, -p_c)) * 0.5 + 0.5;
        }
    }
    else {
        return 0; // no ease (raw)
    }
}
export function animation_convert_track_float32_array(type, keys) {
    const times = [];
    const transitions = [];
    const values = [];
    function addValues(i, count) {
        times.push(keys[i]);
        transitions.push(keys[i + 1]);
        return keys.slice(i + 2, i + 2 + count);
    }
    switch (type) {
        case 'rotation_3d':
            for (let i = 0; i < keys.length; i += 6) {
                const [x, y, z, w] = addValues(i, 4);
                const quat = Object.assign(new Quaternion(), { x, y, z, w });
                values.push(quat);
            }
            break;
        case 'scale_3d':
        case 'position_3d':
            for (let i = 0; i < keys.length; i += 5) {
                const [x, y, z] = addValues(i, 3);
                const quat = Object.assign(new Vector3(), { x, y, z });
                values.push(quat);
            }
            break;
        case 'blend_shape':
            for (let i = 0; i < keys.length; i += 3) {
                const [v] = addValues(i, 3);
                values.push(v);
            }
            break;
        default:
            throw new Error(`Unable to parse Float32 Animation Track keys for type ${type}`);
    }
    return { times: new Float32Array(times), transitions: new Float32Array(transitions), values };
}
