export type TrackType = 'position_3d' | 'rotation_3d' | 'scale_3d' | 'blend_shape' | 'value' | 'method' | 'bezier' | 'audio' | 'animation';
export interface TrackKeys {
    times: Float32Array;
    transitions: Float32Array;
    values: any[];
}
export declare function animation_transition_ease(p_x: number, p_c: number): number;
export declare function animation_convert_track_float32_array(type: TrackType, keys: Float32Array): TrackKeys;
