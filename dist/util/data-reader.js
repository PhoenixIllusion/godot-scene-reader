export const VERSION_MAJOR = 4;
export const VERSION_MINOR = 4;
function bigIntToInt(bigInt) {
    if (bigInt >= Number.MIN_SAFE_INTEGER && bigInt <= Number.MAX_SAFE_INTEGER) {
        return Number(bigInt);
    }
    else {
        throw new Error("BigInt value is outside the safe integer range.");
    }
}
export function ERR_FAIL_V_MSG(label, log) {
    throw new Error(`${label}: ${log}`);
}
export function ERR_FAIL_COND_V_MSG(test, check, log) {
    if (test != check) {
        throw new Error(log);
    }
}
export function WARN_PRINT(log) {
    console.warn(log);
}
export function ERR_FAIL_V(log) {
    new Error(log);
}
export function ERR_PRINT(log) {
    console.error(log);
}
export const decoder = new TextDecoder();
export class DataReader {
    constructor(dataView, littleEndian = false) {
        this.dataView = dataView;
        this.littleEndian = littleEndian;
        this.index = 0;
        this.index = 0;
    }
    U8() {
        this.index++;
        return this.dataView.getUint8(this.index - 1);
    }
    U16(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 2;
        return this.dataView.getUint16(this.index - 2, endian);
    }
    S32(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 4;
        return this.dataView.getInt32(this.index - 4, endian);
    }
    U32(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 4;
        return this.dataView.getUint32(this.index - 4, endian);
    }
    U64(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 8;
        return bigIntToInt(this.dataView.getBigUint64(this.index - 8, endian));
    }
    S64(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 8;
        return bigIntToInt(this.dataView.getBigInt64(this.index - 8, endian));
    }
    U64_BigInt(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 8;
        return this.dataView.getBigUint64(this.index - 8, endian);
    }
    F32(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 4;
        return this.dataView.getFloat32(this.index - 4, endian);
    }
    F64(endian) {
        endian = endian === undefined ? this.littleEndian : endian;
        this.index += 8;
        return this.dataView.getFloat64(this.index - 8, endian);
    }
    CHUNK(len) {
        this.index += len;
        return new Uint8Array(this.dataView.buffer, this.index - len, len);
    }
    SKIP(len) {
        this.index += len;
    }
    SEEK(offset) {
        this.index = offset;
    }
    INDEX() {
        return this.index;
    }
}
