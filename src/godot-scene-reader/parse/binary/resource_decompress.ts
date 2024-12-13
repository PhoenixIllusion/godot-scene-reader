import { decoder } from "../../util/data-reader";

import * as fzstd from 'fzstd';

const MAGIC = 'RSCC';

enum CompressionMode {
  MODE_FASTLZ,
  MODE_DEFLATE,
  MODE_ZSTD,
  MODE_GZIP,
  MODE_BROTLI
}



async function get_decoder(c_mode: number): Promise<(buffer: Uint8Array)=>Uint8Array> {
  switch(c_mode) {
    case CompressionMode.MODE_ZSTD: {
      return fzstd.decompress;
    }
    default:
      throw new Error("Unknown read mode")
  }
}

export async function decompress_buffer(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  const magic = decoder.decode(new Uint8Array(buffer.slice(0, 4)));

  if(magic != MAGIC) {
    throw new Error(`Magic Header Incorrect: Expected [${MAGIC}] and found [${magic}]`)
  }
  let idx = 4;
  const dataView = new DataView(buffer);

  const c_mode: CompressionMode = dataView.getUint32(idx, true); idx+=4;
  const block_size = dataView.getUint32(idx, true); idx+=4;
  const read_total = dataView.getUint32(idx, true); idx+=4;

  const bc = Math.floor(read_total / block_size) + 1;
	let acc_ofs = idx + bc * 4;
	let max_bs = 0;
  const read_blocks: { offset: number, csize: number}[] = [];
  for (let i = 0; i < bc; i++) {
		const offset = acc_ofs;
		const csize = dataView.getUint32(idx, true); idx+=4;
		acc_ofs += csize;
		max_bs = Math.max(max_bs, csize);
		read_blocks.push({offset, csize});
	}
  const end_magic = new Uint8Array(buffer.slice(acc_ofs, acc_ofs + 4));
  if( decoder.decode(end_magic) != MAGIC) {
    throw new Error(`Magic Footer Incorrect: Expected [${MAGIC}] and found [${magic}]`)
  }

  const result: Uint8Array[] = [];
  const decompress = await get_decoder(c_mode);
  for(let i=0; i< read_blocks.length; i++) {
    const rb = read_blocks[i];
    const block = new Uint8Array(buffer, rb.offset, rb.csize);
    result.push(decompress(block));
  }

  return new Blob(result).arrayBuffer();
}