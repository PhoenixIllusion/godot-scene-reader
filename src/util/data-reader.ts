
export const VERSION_MAJOR = 4;
export const VERSION_MINOR = 4;

export const enum LogLevel {
  OFF,
  ERROR,
  WARN,
  VERBOSE
}

let LOG_LEVEL = LogLevel.OFF;
export function setLogLevel(level: LogLevel) {
  LOG_LEVEL = level;
}

function bigIntToInt(bigInt: bigint): number {
  if (bigInt >= Number.MIN_SAFE_INTEGER && bigInt <= Number.MAX_SAFE_INTEGER) {
    return Number(bigInt);
  } else {
    throw new Error("BigInt value is outside the safe integer range.");
  }
}

export function ERR_FAIL_V_MSG(label: string, log: string) {
  throw new Error(`${label}: ${log}`)
}

export function ERR_FAIL_COND_V_MSG(test: boolean, check: boolean, log: string) {
  if (test != check) {
    throw new Error(log);
  }
}

export function WARN_PRINT(log: string) {
  if (LOG_LEVEL >= LogLevel.WARN)
    console.warn(log);
}

export function ERR_FAIL_V(log: string) {
  new Error(log);
}

export function ERR_PRINT(log: string) {
  if (LOG_LEVEL >= LogLevel.ERROR)
    console.error(log);
}

export const decoder = new TextDecoder();

export class DataReader {
  private index = 0;
  constructor(private dataView: DataView, private littleEndian = false) {
    this.index = 0;
  }
  U8(): number {
    this.index++;
    return this.dataView.getUint8(this.index - 1);
  }
  U16(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 2;
    return this.dataView.getUint16(this.index - 2, endian);
  }
  S32(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 4;
    return this.dataView.getInt32(this.index - 4, endian);
  }
  U32(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 4;
    return this.dataView.getUint32(this.index - 4, endian);
  }
  U64(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 8;
    return bigIntToInt(this.dataView.getBigUint64(this.index - 8, endian));
  }
  S64(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 8;
    return bigIntToInt(this.dataView.getBigInt64(this.index - 8, endian));
  }
  U64_BigInt(endian?: boolean): bigint {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 8;
    return this.dataView.getBigUint64(this.index - 8, endian);
  }
  F32(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 4;
    return this.dataView.getFloat32(this.index - 4, endian);
  }
  F64(endian?: boolean): number {
    endian = endian === undefined ? this.littleEndian : endian;
    this.index += 8;
    return this.dataView.getFloat64(this.index - 8, endian);
  }
  CHUNK(len: number): Uint8Array {
    this.index += len;
    return new Uint8Array(this.dataView.buffer, this.index - len, len)
  }
  SKIP(len: number): void {
    this.index += len;
  }
  SEEK(offset: number) {
    this.index = offset;
  }
  INDEX() {
    return this.index;
  }
}