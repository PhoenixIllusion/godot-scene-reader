import { decoder } from "../../util/data-reader.js";
import * as fzstd from 'fzstd';
const MAGIC = 'RSCC';
var CompressionMode;
(function (CompressionMode) {
    CompressionMode[CompressionMode["MODE_FASTLZ"] = 0] = "MODE_FASTLZ";
    CompressionMode[CompressionMode["MODE_DEFLATE"] = 1] = "MODE_DEFLATE";
    CompressionMode[CompressionMode["MODE_ZSTD"] = 2] = "MODE_ZSTD";
    CompressionMode[CompressionMode["MODE_GZIP"] = 3] = "MODE_GZIP";
    CompressionMode[CompressionMode["MODE_BROTLI"] = 4] = "MODE_BROTLI";
})(CompressionMode || (CompressionMode = {}));
async function get_decoder(c_mode) {
    switch (c_mode) {
        case CompressionMode.MODE_ZSTD: {
            return fzstd.decompress;
        }
        default:
            throw new Error("Unknown read mode");
    }
}
export async function decompress_buffer(buffer) {
    const magic = decoder.decode(new Uint8Array(buffer.slice(0, 4)));
    if (magic != MAGIC) {
        throw new Error(`Magic Header Incorrect: Expected [${MAGIC}] and found [${magic}]`);
    }
    let idx = 4;
    const dataView = new DataView(buffer);
    const c_mode = dataView.getUint32(idx, true);
    idx += 4;
    const block_size = dataView.getUint32(idx, true);
    idx += 4;
    const read_total = dataView.getUint32(idx, true);
    idx += 4;
    const bc = Math.floor(read_total / block_size) + 1;
    let acc_ofs = idx + bc * 4;
    let max_bs = 0;
    const read_blocks = [];
    for (let i = 0; i < bc; i++) {
        const offset = acc_ofs;
        const csize = dataView.getUint32(idx, true);
        idx += 4;
        acc_ofs += csize;
        max_bs = Math.max(max_bs, csize);
        read_blocks.push({ offset, csize });
    }
    const end_magic = new Uint8Array(buffer.slice(acc_ofs, acc_ofs + 4));
    if (decoder.decode(end_magic) != MAGIC) {
        throw new Error(`Magic Footer Incorrect: Expected [${MAGIC}] and found [${magic}]`);
    }
    const result = [];
    const decompress = await get_decoder(c_mode);
    for (let i = 0; i < read_blocks.length; i++) {
        const rb = read_blocks[i];
        const block = new Uint8Array(buffer, rb.offset, rb.csize);
        result.push(decompress(block));
    }
    return new Blob(result).arrayBuffer();
}
