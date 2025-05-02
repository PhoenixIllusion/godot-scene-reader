
import { decycle } from './cycle';

function _arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function dump_cyclic(data: any) {
  return JSON.stringify(decycle(data, (v) =>
    typeof v == 'bigint' ? v.toString(16) :
      (v === null) ? undefined :
        (v === "") ? undefined :
          (Array.isArray(v) && v.length == 0) ? undefined :
            (v instanceof Map) ? [...v.entries()] :
              (v?.buffer instanceof ArrayBuffer) ? _arrayBufferToBase64(v.buffer) :
                v
  ), undefined, '  ');
}

export function dump_cyclic_to_link(path: string, data: any): { json: string, anchor: HTMLAnchorElement } {
  const json = dump_cyclic(data);
  const blob = new Blob([json], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.innerText = ' download';
  anchor.download = path.substring(path.lastIndexOf('/')) + '.json';
  anchor.href = URL.createObjectURL(blob);
  return { json, anchor };
}