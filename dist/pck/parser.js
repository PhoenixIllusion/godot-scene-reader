import { DataReader, decoder, ERR_FAIL_COND_V_MSG, VERSION_MAJOR, VERSION_MINOR } from "../util/data-reader.js";
const PACK_HEADER_MAGIC = 0x43504447;
const PACK_FORMAT_VERSION_V2 = 2;
const PACK_FORMAT_VERSION_V3 = 3;
var PackFlags;
(function (PackFlags) {
    PackFlags[PackFlags["PACK_DIR_ENCRYPTED"] = 1] = "PACK_DIR_ENCRYPTED";
    PackFlags[PackFlags["PACK_REL_FILEBASE"] = 2] = "PACK_REL_FILEBASE";
})(PackFlags || (PackFlags = {}));
;
var PackFileFlags;
(function (PackFileFlags) {
    PackFileFlags[PackFileFlags["PACK_FILE_ENCRYPTED"] = 1] = "PACK_FILE_ENCRYPTED";
    PackFileFlags[PackFileFlags["PACK_FILE_REMOVAL"] = 2] = "PACK_FILE_REMOVAL";
})(PackFileFlags || (PackFileFlags = {}));
;
class PckEntry {
    constructor(package_path, path, offset, size, md5, source, replace_files, encrypted) {
        this.package_path = package_path;
        this.path = path;
        this.offset = offset;
        this.size = size;
        this.md5 = md5;
        this.source = source;
        this.replace_files = replace_files;
        this.encrypted = encrypted;
    }
    getData() {
        return this.source.slice(this.offset, this.offset + this.size);
    }
}
export function try_open_pack(pck_path, pack, p_offset = 0) {
    const dataView = new DataView(pack);
    const reader = new DataReader(dataView, true);
    const f = {
        get_position: () => reader.INDEX(),
        get_32: (lE) => reader.U32(lE),
        get_64: () => reader.U64(true),
        seek: (idx) => reader.SEEK(idx),
        get_buffer: (len) => reader.CHUNK(len)
    };
    let pck_header_found = true;
    const magic = f.get_32(false);
    if (magic == PACK_HEADER_MAGIC) {
        pck_header_found = true;
    }
    if (!pck_header_found) {
        if (p_offset != 0) {
            // Search for the header, in case PCK start and section have different alignment.
            for (let i = 0; i < 8; i++) {
                f.seek(p_offset);
                const magic = f.get_32(false);
                if (magic == PACK_HEADER_MAGIC) {
                    pck_header_found = true;
                    break;
                }
                p_offset++;
            }
        }
    }
    if (!pck_header_found) {
        throw new Error("Pack Header Not Found");
    }
    const pck_start_pos = f.get_position() - 4;
    const version = f.get_32();
    const ver_major = f.get_32();
    const ver_minor = f.get_32();
    f.get_32();
    ERR_FAIL_COND_V_MSG(version != PACK_FORMAT_VERSION_V2 && version != PACK_FORMAT_VERSION_V3, false, `Pack version unsupported: ${version}.`);
    ERR_FAIL_COND_V_MSG(ver_major > VERSION_MAJOR || (ver_major == VERSION_MAJOR && ver_minor > VERSION_MINOR), false, `Pack created with a newer version of the engine: ${ver_major}.${ver_minor}.`);
    const pack_flags = f.get_32();
    const enc_directory = (pack_flags & PackFlags.PACK_DIR_ENCRYPTED);
    const rel_filebase = (pack_flags & PackFlags.PACK_REL_FILEBASE); // Note: Always enabled for V3.
    let file_base = f.get_64();
    if ((version == PACK_FORMAT_VERSION_V3) || (version == PACK_FORMAT_VERSION_V2 && rel_filebase)) {
        file_base += pck_start_pos;
    }
    if (version == PACK_FORMAT_VERSION_V3) {
        // V3: Read directory offset and skip reserved part of the header.
        const dir_offset = f.get_64() + pck_start_pos;
        f.seek(dir_offset);
    }
    else if (version == PACK_FORMAT_VERSION_V2) {
        // V2: Directory directly after the header.
        for (let i = 0; i < 16; i++) {
            f.get_32(); // Reserved.
        }
    }
    // Read directory.
    const file_count = f.get_32();
    if (enc_directory) {
        throw new Error("Can't open encrypted pack directory.");
    }
    const result = {};
    for (let i = 0; i < file_count; i++) {
        const sl = f.get_32();
        const path = decoder.decode(f.get_buffer(sl)).replace(/\x00/g, '');
        const ofs = f.get_64();
        const size = f.get_64();
        const md5 = f.get_buffer(16);
        const flags = f.get_32();
        if (flags & PackFileFlags.PACK_FILE_REMOVAL) { // The file was removed.
            if (result[path]) {
                delete result[path];
            }
        }
        else {
            const entry = new PckEntry(pck_path, path, file_base + ofs, size, md5, pack, false, !!(flags & PackFileFlags.PACK_FILE_ENCRYPTED));
            result[path] = entry;
        }
    }
    return result;
}
