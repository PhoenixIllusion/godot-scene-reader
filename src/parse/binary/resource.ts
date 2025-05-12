import { DataReader, decoder, ERR_FAIL_V_MSG, VERSION_MAJOR, VERSION_MINOR, WARN_PRINT } from "../../util/data-reader";
import { decompress_buffer } from "./resource_decompress";
import { GodotReader } from "./util/reader";
import { parse_variant, ResourceData, VariantType } from "./variant";

const FORMAT_VERSION = 6;

const enum FORMAT_FLAGS {
  FORMAT_FLAG_NAMED_SCENE_IDS = 1,
  FORMAT_FLAG_UIDS = 2,
  FORMAT_FLAG_REAL_T_IS_DOUBLE = 4,
  FORMAT_FLAG_HAS_SCRIPT_CLASS = 8,

  // Amount of reserved 32-bit fields in resource header
  RESERVED_FIELDS = 11
}

class ResourceUID {
  static INVALID_ID = -1n;

  private static _singleton: ResourceUID | undefined;
  static get_singleton(): ResourceUID {
    if (!ResourceUID._singleton) {
      ResourceUID._singleton = new ResourceUID();
    }
    return ResourceUID._singleton;
  }

  private _map: Map<BigInt, string> = new Map();

  has_id(uid: BigInt) {
    return this._map.has(uid);
  }
  get_id_path(uid: BigInt) {
    return this._map.get(uid);
  }

}

export interface ExtResource {
  type: string;
  path: string;
  uid?: BigInt;
}

export interface IntResource {
  path: string;
  offset: number;
}

export interface InternalResourceEntry {
  type: string,
  properties: Record<string, VariantType>
}

export async function try_open_bin_resource(res_path: string, arrayBuffer: ArrayBuffer, p_no_resource: boolean, p_keep_uuid_paths: boolean) {
  let dataView = new DataView(arrayBuffer);

  const header = decoder.decode(new Uint8Array(arrayBuffer.slice(0, 4)));
  if (header !== 'RSRC' && header !== 'RSCC') {
    throw new Error("Cannot Open File");
  }
  let read_offset = 4;
  if (header === 'RSCC') {
    arrayBuffer = await decompress_buffer(arrayBuffer);
    dataView = new DataView(arrayBuffer);
    read_offset = 0;
  }

  const big_endian = !!dataView.getUint32(read_offset); read_offset += 4;
  // @ts-ignore
  const use_real64 =
    !!dataView.getUint32(read_offset); read_offset += 4;

  const f = new GodotReader(new DataReader(dataView, !big_endian), false);
  f.skip(read_offset);

  function get_ustring(): string {
    const len = f.get_32();
    const chunk = f.get_buffer(Math.max(len - 1, 0))
    f.skip(1);
    return decoder.decode(chunk)
  }
  const get_unicode_string = get_ustring;

  const ver_major = f.get_32();
  const ver_minor = f.get_32();
  const ver_format = f.get_32();

  if (ver_format > FORMAT_VERSION || ver_major > VERSION_MAJOR) {
    ERR_FAIL_V_MSG('ERR_FILE_UNRECOGNIZED',
      `File '${res_path}' can't be loaded, as it uses a format version (${ver_format}) or engine version (${ver_major}.${ver_minor})` +
      ` which are not supported by your engine version (${VERSION_MAJOR}.${VERSION_MINOR}).`);
  }

  const type = get_ustring();
  // @ts-ignore
  const importmd_ofs = f.get_64bi();
  const flags = f.get_32();

  const using_named_scene_ids = !!(flags & FORMAT_FLAGS.FORMAT_FLAG_NAMED_SCENE_IDS);
  const using_uids = !!(flags & FORMAT_FLAGS.FORMAT_FLAG_UIDS);
  const real_is_double = !!(flags & FORMAT_FLAGS.FORMAT_FLAG_REAL_T_IS_DOUBLE);

  const uid = using_uids ? f.get_64bi() : ResourceUID.INVALID_ID;
  if (!using_uids) { f.get_64bi(); }
  const script_class = (!!(flags & FORMAT_FLAGS.FORMAT_FLAG_HAS_SCRIPT_CLASS)) ? get_ustring() : "";

  for (let i = 0; i < FORMAT_FLAGS.RESERVED_FIELDS; i++) {
    f.get_32(); //skip a few reserved fields
  }

  if (p_no_resource) {
    return;
  }

  const string_map: Record<number, string> = {};
  const string_table_size = f.get_32();

  for (let i = 0; i < string_table_size; i++) {
    const s = get_ustring();
    string_map[i] = s;
  }

  function _get_string() {
    const id = f.get_32();
    if (id & 0x80000000) {
      const len = id & 0x7FFFFFFF;
      const chunk = f.get_buffer(len - 1)
      f.skip(1);
      return decoder.decode(chunk)
    }
    return string_map[id];
  }

  const ext_resources_size = f.get_32();
  const external_resources: ExtResource[] = [];
  for (let i = 0; i < ext_resources_size; i++) {
    const er: ExtResource = { path: '', type: '' };
    er.type = get_unicode_string();
    er.path = get_unicode_string();
    if (using_uids) {
      er.uid = f.get_64bi();
      if (!p_keep_uuid_paths && er.uid != ResourceUID.INVALID_ID) {
        if (ResourceUID.get_singleton().has_id(er.uid)) {
          // If a UID is found and the path is valid, it will be used, otherwise, it falls back to the path.
          er.path = ResourceUID.get_singleton().get_id_path(er.uid)!;
        } else {
          WARN_PRINT(`${res_path}: In external resource #${i}, invalid UID: '${er.uid.toString(16)}' - using text path instead: '${er.path}`);
        }
      }
    }

    external_resources.push(er);
  }

  const int_resources_size = f.get_32();
  const internal_resources: IntResource[] = [];

  for (let i = 0; i < int_resources_size; i++) {
    const ir: IntResource = { path: '', offset: -1 };
    ir.path = get_unicode_string();
    ir.offset = f.get_64();
    internal_resources.push(ir);
  }

  const internal_index_cache = new Map<string, VariantType>();
  const remaps = new Map<string, string>();
  const res: ResourceData = {
    res_path,
    using_named_scene_ids,
    internal_resources,
    internal_index_cache,
    external_resources,
    remaps,
    loadExternal: (path, extType, _mode) => { return { type: "ext_res", path, extType } },
    loadExternalRes: (res) => { return { type: "ext_res", res } },
    localizePath: (_res_path, _path) => { debugger; throw Error() },
    is_relative_path: (_path) => { debugger; throw Error() },
  }

  const internal_entries: InternalResourceEntry[] = [];
  internal_resources.forEach(resource => {
    f.seek(resource.offset);
    const type = get_unicode_string();
    const property_count = f.get_32();
    const entry: InternalResourceEntry = { type, properties: {} }
    for (let j = 0; j < property_count; j++) {
      const name = _get_string();
      const value = parse_variant(res, f, real_is_double, ver_format, _get_string);
      entry.properties[name] = value;
    }
    internal_entries.push(entry);
    internal_index_cache.set(resource.path, { type: 'ref', value: entry } as VariantType);
  });

  return {
    type, uid, script_class, string_map, internal_entries,
    ...res
  };

}
export type BinResource = Awaited<ReturnType<typeof try_open_bin_resource>>;