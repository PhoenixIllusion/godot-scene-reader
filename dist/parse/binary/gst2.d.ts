import { DataFormat, ImageFormat } from "./gst2_format";
export interface cTexEntry {
    width: number;
    height: number;
    mipmap_level: number;
    data_format: DataFormat;
    image_format: ImageFormat;
    buffer: Uint8Array;
}
export interface cTexFile {
    version: number;
    width: number;
    height: number;
    flags: number;
    mipmap_limit: number;
    images: cTexEntry[];
}
export declare function try_open_ctex(arrayBuffer: ArrayBuffer): cTexFile;
