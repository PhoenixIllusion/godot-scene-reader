import { try_open_bin_config } from "../parse/binary/ecfg";
import { try_open_gdc } from "../parse/binary/gdc";
import { cTexFile, try_open_ctex } from "../parse/binary/gst2";
import { InternalResourceEntry, try_open_bin_resource } from "../parse/binary/resource";
import { parse_remap } from "../parse/text/remap/parse";
import type { PckFile } from "../pck/parser"
import { BinaryParser, Tokenizer } from "./gdc/parser";
import { ClassNode } from "./gdc/type";

export interface PCK {
  project?: Record<string, any>;
  resources: Record<string, {internal_entries: InternalResourceEntry[] }>;
  ctex: Record<string, cTexFile>;
  remap: Record<string, Record<string,string>>;
  gdc: Record<string,ClassNode>;
}


export async function process_pck_file(pack: PckFile) {
  const result: PCK = { resources: {}, ctex: {}, remap: {}, gdc: {}}
  const keys = Object.keys(pack)
  for(let i=0;i<keys.length;i++) {
    const path = keys[i];
    if(path == "project.binary") {
      result.project = try_open_bin_config(pack[path].getData())!;
    } else
    if(path.endsWith('.scn') || path.endsWith('.res')) {
      result.resources[path] = (await try_open_bin_resource(path, pack[path].getData(), false, false))!
    } else
    if(path.endsWith('.ctex')) {
      result.ctex[path] = try_open_ctex(pack[path].getData())!
    } else
    if(path.endsWith('.gdc')) {
      const gdcFile = try_open_gdc(pack[path].getData())!
      const parser = new BinaryParser(new Tokenizer(gdcFile), path);
      result.gdc[path] = parser.parse()!;
    } else
    if(path.endsWith('.import') || path.endsWith('.remap')) {
      const remap_path = parse_remap(pack[path].getData());
      if(remap_path) {
        result.remap[path.replace(/\.import$/,'').replace(/\.remap$/,'')] = remap_path;
      }
    } else {
      console.warn("No handler found for path ", path)
    }
  }
  return result;
}