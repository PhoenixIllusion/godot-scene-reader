import { DataReader, decoder } from "../../util/data-reader";
import { decode_variant } from "./unmarshaller";
import { GodotReader } from "./util/reader";


export function try_open_bin_config(arrayBuffer: ArrayBuffer) {
  const header = decoder.decode(arrayBuffer.slice(0,4));
  if(header !== 'ECFG') {
    throw new Error("Cannot Open File");
  }
  const dataView = new DataView(arrayBuffer);
  
  const f = new GodotReader(new DataReader(dataView, true), false);
  f.skip(4);

  function get_ustring(): string {
    const len = f.get_32();
    const chunk = f.get_buffer(len)
    return decoder.decode(chunk)
  }

  const result: Record<string, any> = {};
  const count = f.get_32();
  for(let i=0;i<count;i++) {
    const key = get_ustring();
    const chunk = f.get_32();
    const type = f.get_32();
    const buffer = f.get_buffer(chunk-4);
    const payload = new DataReader(new DataView(new Uint8Array(buffer).buffer), true);
    result[key] = decode_variant(type, new GodotReader(payload, false));
  }
  return result;
}