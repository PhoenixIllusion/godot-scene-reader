export declare const VERSION_MAJOR = 4;
export declare const VERSION_MINOR = 4;
export declare function ERR_FAIL_V_MSG(label: string, log: string): void;
export declare function ERR_FAIL_COND_V_MSG(test: boolean, check: boolean, log: string): void;
export declare function WARN_PRINT(log: string): void;
export declare function ERR_FAIL_V(log: string): void;
export declare function ERR_PRINT(log: string): void;
export declare const decoder: TextDecoder;
export declare class DataReader {
    private dataView;
    private littleEndian;
    private index;
    constructor(dataView: DataView, littleEndian?: boolean);
    U8(): number;
    U16(endian?: boolean): number;
    S32(endian?: boolean): number;
    U32(endian?: boolean): number;
    U64(endian?: boolean): number;
    S64(endian?: boolean): number;
    U64_BigInt(endian?: boolean): bigint;
    F32(endian?: boolean): number;
    F64(endian?: boolean): number;
    CHUNK(len: number): Uint8Array;
    SKIP(len: number): void;
    SEEK(offset: number): void;
    INDEX(): number;
}
