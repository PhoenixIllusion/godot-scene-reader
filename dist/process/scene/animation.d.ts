export type TrackType = 'position_3d' | 'rotation_3d' | 'scale_3d' | 'blend_shape' | 'value' | 'method' | 'bezier' | 'audio' | 'animation';
export declare const enum UpdateMode {
    UPDATE_CONTINUOUS = 0,
    UPDATE_DISCRETE = 1,
    UPDATE_CAPTURE = 2
}
export interface TrackKeys {
    times: Float32Array;
    transitions: Float32Array;
    values: any[];
    update: UpdateMode;
}
export declare function animation_transition_ease(p_x: number, p_c: number): number;
export declare function animation_convert_track_float32_array(type: TrackType, keys: Float32Array): TrackKeys;
