export interface VertexSizeAccumulator {
    vertex_element_size: number;
    normal_element_size: number;
    attrib_element_size: number;
    skin_element_size: number;
}
export declare function mesh_surface_make_offsets_from_format(p_format: number, p_vertex_len: number, p_index_len: number, offsets: number[]): VertexSizeAccumulator;
