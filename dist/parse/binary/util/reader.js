export class GodotReader {
    constructor(reader, use_real64) {
        this.reader = reader;
        this.use_real64 = use_real64;
    }
    get_position() { return this.reader.INDEX(); }
    get_8() { return this.reader.U8(); }
    get_16() { return this.reader.U16(); }
    get_32(lE) { return this.reader.U32(lE); }
    get_S32(lE) { return this.reader.S32(lE); }
    get_64() { return this.reader.U64(); }
    get_S64() { return this.reader.S64(); }
    get_64bi() { return this.reader.U64_BigInt(); }
    seek(idx) { return this.reader.SEEK(idx); }
    get_buffer(len) { return this.reader.CHUNK(len); }
    get_float() { return this.reader.F32(); }
    get_real() { return this.use_real64 ? this.reader.F64() : this.reader.F32(); }
    get_double() { return this.reader.F64(); }
    skip(len) { return this.reader.SKIP(len); }
}
