import { decoder } from "../../../util/data-reader";
import { parse_text_resource } from "../resource";

export function parse_remap(value: string | ArrayBuffer): Record<string, string> | null {
  const str = (value instanceof ArrayBuffer) ? decoder.decode(value) : value;
  const blocks = parse_text_resource(str.replace(/\x00$/, ''));

  if (blocks.length != 1 && blocks[0].block.type !== 'remap' && blocks[0].block.attr.length !== 0) {
    throw new Error("Invalid Remap File");
  }
  const props = blocks[0].props;
  const result: Record<string, string> = {}
  props.filter(x => x[0].startsWith('path')).forEach(([k, v]) => {
    result[k] = v as string;
  })
  if (Object.keys(result).length == 0) {
    console.warn("No PATH found on remap");
    return null;
  }
  return result;
}