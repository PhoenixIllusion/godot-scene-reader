import { DataReader } from "../../../util/data-reader.js";
export declare class GodotReader {
    reader: DataReader;
    use_real64: boolean;
    constructor(reader: DataReader, use_real64: boolean);
    get_position(): number;
    get_8(): number;
    get_16(): number;
    get_32(lE?: boolean): number;
    get_S32(lE?: boolean): number;
    get_64(): number;
    get_S64(): number;
    get_S64bi(): bigint;
    get_64bi(): bigint;
    seek(idx: number): void;
    get_buffer(len: number): Uint8Array<ArrayBufferLike>;
    get_float(): number;
    get_real(): number;
    get_double(): number;
    skip(len: number): void;
}
