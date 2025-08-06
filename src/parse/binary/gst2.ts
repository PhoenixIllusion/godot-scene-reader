import { DataReader, decoder } from "../../util/data-reader";
import { DataFormat, get_format_block_size, get_format_pixel_rshift, get_format_pixel_size, ImageFormat } from "./gst2_format";
import { GodotReader } from "./util/reader";

function load_image(f: GodotReader, data_format: DataFormat, w: number, h: number, mipmaps: number, format: ImageFormat, p_size_limit: number) {
  let sw = w;
  let sh = h;

  //mipmaps need to be read independently, they will be later combined
  const mipmap_images: cTexEntry[] = [];

  for (let i = 0; i < mipmaps + 1; i++) {
    const size = f.get_32();

    if (p_size_limit > 0 && i < (mipmaps - 1) && (sw > p_size_limit || sh > p_size_limit)) {
      //can't load this due to size limit
      sw = Math.max(sw >> 1, 1);
      sh = Math.max(sh >> 1, 1);
      f.seek(f.get_position() + size);
      continue;
    }


    const pv = f.get_buffer(size);

    if (pv.length == 0) {
      throw new Error("Image Null or Empty");
    }

    mipmap_images.push({
      width: sw, height: sh, mipmap_level: i,
      data_format: data_format,
      image_format: format,
      buffer: pv
    });

    sw = Math.max(sw >> 1, 1);
    sh = Math.max(sh >> 1, 1);
  }

  return mipmap_images;
}

function data_image(f: GodotReader, w: number, h: number, mipmaps: number, format: ImageFormat) {
  const mipmap_images: cTexEntry[] = [];

  const pixsize = get_format_pixel_size(format);
  const pixshift = get_format_pixel_rshift(format);
  const block = get_format_block_size(format);

  const minw = 1, minh = 1;

  for (let i = 0; i < mipmaps + 1; i++) {
    const bw = w % block != 0 ? w + (block - w % block) : w;
    const bh = h % block != 0 ? h + (block - h % block) : h;

    let size = bw * bh;

    size *= pixsize;
    size >>= pixshift;

    const pv = f.get_buffer(size);

    mipmap_images.push({
      width: w, height: h, mipmap_level: i,
      data_format: DataFormat.DATA_FORMAT_IMAGE,
      image_format: format,
      buffer: pv
    });

    if (w == minw && h == minh) {
      break;
    }
    w = Math.max(minw, w >> 1);
    h = Math.max(minh, h >> 1);


    if (pv.length == 0) {
      throw new Error("Image Null or Empty");
    }
  }
  return mipmap_images;
}

export interface cTexEntry {
  width: number;
  height: number;
  mipmap_level: number;

  data_format: DataFormat;
  image_format: ImageFormat;

  buffer: Uint8Array
}

export interface cTexFile {
  version: number;
  width: number;
  height: number;
  flags: number;
  mipmap_limit: number;

  images: cTexEntry[]
}

function load_image_from_file(f: GodotReader) {
  const data_format = f.get_32();
  const w = f.get_16();
  const h = f.get_16();
  const mipmaps = f.get_32();
  const format = f.get_32();

  let images: cTexEntry[] = [];

  if (data_format == DataFormat.DATA_FORMAT_PNG || data_format == DataFormat.DATA_FORMAT_WEBP) {
    if (data_format == DataFormat.DATA_FORMAT_PNG) {
      images = load_image(f, data_format, w, h, mipmaps, format, 0);
    } else if (data_format == DataFormat.DATA_FORMAT_WEBP) {
      images = load_image(f, data_format, w, h, mipmaps, format, 0);
    }
  } else if (data_format == DataFormat.DATA_FORMAT_BASIS_UNIVERSAL) {
    images = load_image(f, data_format, w, h, 0, format, 0);
  } else if (data_format == DataFormat.DATA_FORMAT_IMAGE) {
    images = data_image(f, w, h, mipmaps, format);
  }
  return { width: w, height: h, data_format, format, mipmaps, images };
}

export function try_open_ctex(arrayBuffer: ArrayBuffer): cTexFile {
  let dataView = new DataView(arrayBuffer);

  const header = decoder.decode(new Uint8Array(arrayBuffer.slice(0, 4)));
  if (header !== 'GST2') {
    throw new Error("Cannot Open File");
  }
  const f = new GodotReader(new DataReader(dataView, true), false);
  f.skip(4);

  const version = f.get_32();
  const width = f.get_32();
  const height = f.get_32();
  const flags = f.get_32();
  const mipmap_limit = f.get_32();

  f.get_32();
  f.get_32();
  f.get_32(); //reserved 12 bytes

  const images = load_image_from_file(f);

  if (f.get_position() != arrayBuffer.byteLength) {
    throw new Error("Assertion Failed in Parsing Image Format")
  }

  return {
    version, width, height, flags, mipmap_limit,
    images: images.images
  };
}

const enum LayeredType {
		LAYERED_TYPE_2D_ARRAY,
		LAYERED_TYPE_CUBEMAP,
		LAYERED_TYPE_CUBEMAP_ARRAY
	}

export function try_open_ctexarray(arrayBuffer: ArrayBuffer): cTexFile[] {
  let dataView = new DataView(arrayBuffer);

  const header = decoder.decode(new Uint8Array(arrayBuffer.slice(0, 4)));
  if (header !== 'GSTL') {
    throw new Error("Cannot Open File");
  }
  const f = new GodotReader(new DataReader(dataView, true), false);
  f.skip(4);

  const version = f.get_32();
  const layer_count = f.get_32();
  const type = f.get_32();
  if( type != LayeredType.LAYERED_TYPE_2D_ARRAY) {
    throw new Error('Invalid Data. CTexArray is not LAYERED_TYPE_2D_ARRAY, found '+ type)
  }
  f.get_32(); // df, data-format, used for p_size_limit, unused
  const mipmap_limit = f.get_32();

  f.get_32();
  f.get_32();
  f.get_32(); //reserved 12 bytes

  const result: cTexFile[] = []
  const flags = 0;
  for(let i=0; i < layer_count; i++) {
    const {  width, height, images } = load_image_from_file(f);
    result.push({
      version, width, height, flags, mipmap_limit,
      images: images
    })
  }

  return result;
}
