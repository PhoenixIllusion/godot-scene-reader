import { DataReader, decoder } from "../../util/data-reader";
import { TokenType } from "./gdc_tokens";
import { decode_variant } from "./unmarshaller";
import { unmarshaller_type_as_string } from "./unmarshaller_type";
import { GodotReader } from "./util/reader";
import * as fzstd from 'fzstd';
var TOKEN;
(function (TOKEN) {
    TOKEN[TOKEN["TOKEN_BYTE_MASK"] = 128] = "TOKEN_BYTE_MASK";
    TOKEN[TOKEN["TOKEN_BITS"] = 8] = "TOKEN_BITS";
    TOKEN[TOKEN["TOKEN_MASK"] = 127] = "TOKEN_MASK";
})(TOKEN || (TOKEN = {}));
;
function _binary_to_token(arrayBuffer, identifiers, constants) {
    let f = new DataView(arrayBuffer);
    let idx = 0;
    const token_type = f.getUint32(idx, true);
    const type = token_type & TOKEN.TOKEN_MASK;
    if (token_type & TOKEN.TOKEN_BYTE_MASK) {
        idx += 4;
    }
    else {
        f = new DataView(arrayBuffer.slice(1));
    }
    const start_line = f.getUint32(idx, true);
    const token = { type, start_line };
    switch (type) {
        case TokenType.ANNOTATION:
        case TokenType.IDENTIFIER:
            {
                // Get name from map.
                const identifier_pos = token_type >> TOKEN.TOKEN_BITS;
                if (identifier_pos >= identifiers.length) {
                    throw new Error("Identifier index out of bounds.");
                }
                token.literal = identifiers[identifier_pos];
            }
            break;
        case TokenType.ERROR:
        case TokenType.LITERAL:
            {
                // Get literal from map.
                const constant_pos = token_type >> TOKEN.TOKEN_BITS;
                if (constant_pos >= constants.length) {
                    throw new Error("Constant index out of bounds.");
                }
                token.literal = constants[constant_pos];
            }
            break;
        default:
            break;
    }
    return token;
}
export function try_open_gdc(arrayBuffer) {
    let dataView = new DataView(arrayBuffer);
    const header = decoder.decode(new Uint8Array(arrayBuffer.slice(0, 4)));
    if (header !== 'GDSC') {
        throw new Error("Cannot Open File");
    }
    const version = dataView.getUint32(4, true);
    const decompressed_size = dataView.getUint32(8, true);
    let startIndex = 12;
    if (decompressed_size !== 0) {
        arrayBuffer = fzstd.decompress(new Uint8Array(arrayBuffer.slice(12, arrayBuffer.byteLength))).buffer;
        dataView = new DataView(arrayBuffer);
        startIndex = 12;
    }
    const f = new GodotReader(new DataReader(dataView, true), false);
    f.skip(startIndex);
    const identifier_count = f.get_32();
    const constant_count = f.get_32();
    const token_line_count = f.get_32();
    f.get_32();
    const token_count = f.get_32();
    const identifiers = [];
    const _tmp = new Uint8Array(4);
    const _tmp_u32 = new DataView(_tmp.buffer);
    for (let i = 0; i < identifier_count; i++) {
        const len = f.get_32();
        const cs = new Uint32Array(len);
        for (let j = 0; j < len; j++) {
            for (let k = 0; k < 4; k++) {
                _tmp[k] = f.get_8() ^ 0xb6;
            }
            cs[j] = _tmp_u32.getUint32(0, true);
        }
        identifiers[i] = decoder.decode(new Uint8Array(cs));
    }
    const constants = [];
    for (let i = 0; i < constant_count; i++) {
        const type = f.get_32();
        const type_s = unmarshaller_type_as_string(type);
        const val = decode_variant(type, f);
        constants.push({ type, type_s, val });
    }
    const token_lines = {};
    const token_columns = {};
    for (let i = 0; i < token_line_count; i++) {
        const token_index = f.get_32();
        const line = f.get_32();
        token_lines[token_index] = line;
    }
    for (let i = 0; i < token_line_count; i++) {
        const token_index = f.get_32();
        const column = f.get_32();
        token_columns[token_index] = column;
    }
    const tokens = [];
    for (let i = 0; i < token_count; i++) {
        const pos = f.get_position();
        const token_0 = f.get_8();
        f.seek(pos);
        const token_len = (token_0 & TOKEN.TOKEN_BYTE_MASK) ? 8 : 5;
        const token = f.get_buffer(token_len);
        tokens.push(_binary_to_token(new Uint8Array(token).buffer, identifiers, constants));
    }
    if (f.get_position() !== arrayBuffer.byteLength) {
        throw new Error("Error: Invalid GD Binary File");
    }
    return {
        header, version,
        identifiers, constants,
        token_lines, token_columns,
        tokens
    };
}
