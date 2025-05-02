import { DataReader } from "../../../util/data-reader";

export class GodotReader {
  constructor(public reader: DataReader, public use_real64: boolean) { }
  get_position() { return this.reader.INDEX() }
  get_8() { return this.reader.U8() }
  get_16() { return this.reader.U16() }
  get_32(lE?: boolean) { return this.reader.U32(lE) }
  get_S32(lE?: boolean) { return this.reader.S32(lE) }
  get_64() { return this.reader.U64() }
  get_S64() { return this.reader.S64() }
  get_64bi() { return this.reader.U64_BigInt() }
  seek(idx: number) { return this.reader.SEEK(idx) }
  get_buffer(len: number) { return this.reader.CHUNK(len) }
  get_float() { return this.reader.F32() }
  get_real() { return this.use_real64 ? this.reader.F64() : this.reader.F32() }
  get_double() { return this.reader.F64() }
  skip(len: number) { return this.reader.SKIP(len) }
}