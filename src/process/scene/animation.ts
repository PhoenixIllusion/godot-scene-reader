export type TrackType = 'position_3d' | 'rotation_3d' |'scale_3d' |'blend_shape' |'value' |'method' |'bezier' |'audio' |'animation'

export const enum UpdateMode {
  UPDATE_CONTINUOUS = 0,
  UPDATE_DISCRETE = 1,
  UPDATE_CAPTURE = 2,
}

export interface TrackKeys {
  times: Float32Array;
  transitions: Float32Array;
  values: any[]
  update: UpdateMode;
}

// Godot: /core/math/math_funcs.cpp#L96
// double Math::ease(double p_x, double p_c)
export function animation_transition_ease(p_x: number, p_c: number) {
	if (p_x < 0) {
		p_x = 0;
	} else if (p_x > 1.0) {
		p_x = 1.0;
	}
	if (p_c > 0) {
		if (p_c < 1.0) {
			return 1.0 - Math.pow(1.0 - p_x, 1.0 / p_c);
		} else {
			return Math.pow(p_x, p_c);
		}
	} else if (p_c < 0) {
		//inout ease
		if (p_x < 0.5) {
			return Math.pow(p_x * 2.0, -p_c) * 0.5;
		} else {
			return (1.0 - Math.pow(1.0 - (p_x - 0.5) * 2.0, -p_c)) * 0.5 + 0.5;
		}
	} else {
		return 0; // no ease (raw)
	}
}

export function animation_convert_track_float32_array(type: TrackType, keys: Float32Array): TrackKeys {
    const times: number[] = [];
    const transitions: number[] = [];
    const values: any[] = [];
    function addValues(i: number, count: number): Float32Array {
      times.push(keys[i]);
      transitions.push(keys[i+1]);
      return keys.slice(i+2, i+2+count);
    }
    switch(type) {
      case 'rotation_3d':
        for(let i=0;i<keys.length;i+=6) {
          values.push(addValues(i, 4))
        }
        break;
      case 'scale_3d':
      case 'position_3d':
        for(let i=0;i<keys.length;i+=5) {
          values.push(addValues(i, 3))
        }
        break;
      case 'blend_shape':
        for(let i=0;i<keys.length;i+=3) {;
          values.push(addValues(i, 1))
        }
        break;
      default:
        throw new Error(`Unable to parse Float32 Animation Track keys for type ${type}`)
    }
  
  return { times: new Float32Array(times), transitions: new Float32Array(transitions), values, update: 0};
}