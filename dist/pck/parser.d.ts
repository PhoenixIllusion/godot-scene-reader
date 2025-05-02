declare class PckEntry {
    package_path: string;
    path: string;
    offset: number;
    size: number;
    md5: Uint8Array;
    source: ArrayBuffer;
    replace_files: boolean;
    encrypted: boolean;
    constructor(package_path: string, path: string, offset: number, size: number, md5: Uint8Array, source: ArrayBuffer, replace_files: boolean, encrypted: boolean);
    getData(): ArrayBuffer;
}
export type { PckEntry };
export type PckFile = Record<string, PckEntry>;
export declare function try_open_pack(pck_path: string, pack: ArrayBuffer, p_offset?: number): PckFile;
