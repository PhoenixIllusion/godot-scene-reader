import { try_open_bin_config } from "godot-scene-reader/parse/binary/ecfg.js";
import { cTexFile, try_open_ctex } from "godot-scene-reader/parse/binary/gst2.js";
import { InternalResourceEntry, try_open_bin_resource } from "godot-scene-reader/parse/binary/resource.js";
import { parse_remap } from "godot-scene-reader/parse/text/remap/parse.js";
import { PckFile } from "godot-scene-reader/pck/parser.js";
import { ClassNode } from "godot-scene-reader/process/gdc/type.js";

export interface PCK {
  project?: Record<string, any>;
  resources: Record<string, { internal_entries: InternalResourceEntry[] }>;
  ctex: Record<string, cTexFile>;
  remap: Record<string, Record<string, string>>;
  gdc: Record<string, ClassNode>;
}


export async function process_pck_file(pack: PckFile) {
  const result: PCK = { resources: {}, ctex: {}, remap: {}, gdc: {} }
  const keys = Object.keys(pack)
  for (let i = 0; i < keys.length; i++) {
    const path = keys[i];
    if (path == "project.binary") {
      result.project = try_open_bin_config(pack[path].getData())!;
    } else
      if (path.endsWith('.scn') || path.endsWith('.res')) {
        result.resources[path] = (await try_open_bin_resource(path, pack[path].getData(), false, false))!
      } else
        if (path.endsWith('.ctex')) {
          result.ctex[path] = try_open_ctex(pack[path].getData())!
        } else
        if (path.endsWith('.import') || path.endsWith('.remap')) {
          const remap_path = parse_remap(pack[path].getData());
          if (remap_path) {
            result.remap[path.replace(/\.import$/, '').replace(/\.remap$/, '')] = remap_path;
          }
        } else {
          console.warn("No handler found for path ", path)
        }
  }
  return result;
}